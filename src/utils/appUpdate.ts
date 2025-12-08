// src/utils/appUpdate.ts

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { getAppVersionInfo } from './appInfo';
import {
    fetchLatestAppVersion,
    type AppVersionResponse,
} from '../api/versionApi';
import { Platform } from 'react-native';

export type AppUpdateCheckResult = {
    hasUpdate: boolean;

    currentVersionName: string;
    currentBuildNumber: number;

    latestVersionName?: string;
    latestVersionCode?: number;
};

export type DownloadProgressCallback = (progressPercent: number) => void;

const APK_FILE_NAME = 'ccms-latest.apk';

// ----- Helpers path -----

function getAppPrivateApkPath() {
    // app private dir: chỉ app đọc được
    return `${RNFS.DocumentDirectoryPath}/${APK_FILE_NAME}`;
}

function getDownloadsApkPath() {
    // thư mục public Downloads (Android)
    return `${RNFS.DownloadDirectoryPath}/${APK_FILE_NAME}`;
}

/**
 * Kiểm tra xem app hiện tại có bản mới hơn không.
 * Hiện tại dùng fake API từ versionApi.ts, sau này chỉ cần sửa fetchLatestAppVersion là được.
 */
export async function checkForAppUpdate(): Promise<AppUpdateCheckResult> {
    // Version hiện tại
    const { versionName, buildNumber } = getAppVersionInfo();

    // Gọi "API" lấy version mới (hiện tại đang fake)
    const latest: AppVersionResponse = await fetchLatestAppVersion();

    const latestCode = latest.latestVersionCode ?? 0;
    const hasUpdate = latestCode > buildNumber;

    return {
        hasUpdate,
        currentVersionName: versionName,
        currentBuildNumber: buildNumber,
        latestVersionName: latest.latestVersionName,
        latestVersionCode: latest.latestVersionCode,
    };
}

// ----- Download APK - version 1: app private dir -----

/**
 * Tải APK về thư mục private của app:
 *   <DocumentDirectoryPath>/ccms-latest.apk
 *
 * @param apkUrl URL file .apk trên server nội bộ
 * @param onProgress callback nhận % tải (0–100)
 * @returns localPath tới file apk (dùng cho installApk sau này)
 *
 * Lưu ý: ở nhà không vào được mạng nội bộ => truyền apkUrl nội bộ sẽ bị lỗi network,
 * bạn có thể bắt lỗi này ở UI bằng showError để test flow.
 */
export async function downloadApkToAppDir(
    apkUrl: string,
    onProgress?: DownloadProgressCallback,
): Promise<string> {
    if (!apkUrl) {
        throw new Error('APK URL is empty');
    }

    const destPath = getAppPrivateApkPath();

    const task = RNFS.downloadFile({
        fromUrl: apkUrl,
        toFile: destPath,
        progressDivider: 5,
        progress: progressEvent => {
            if (!onProgress) return;
            const { bytesWritten, contentLength } = progressEvent;
            if (!contentLength) return;
            const percent = (bytesWritten / contentLength) * 100;
            onProgress(Math.round(percent));
        },
    });

    const result = await task.promise;

    if (result.statusCode !== 200) {
        throw new Error(
            `Download failed with status ${result.statusCode ?? 'unknown'}`,
        );
    }

    return destPath;
}

// ----- Download APK - version 2: public Downloads dir -----

/**
 * Tải APK về thư mục public Downloads:
 *   <DownloadDirectoryPath>/ccms-latest.apk
 *
 * Ưu điểm: user có thể thấy file trong app "Tệp" / "Downloads".
 * Nhược: có thể cần thêm quyền nếu dùng sâu hơn (tùy API level).
 */
export async function downloadApkToDownloadsDir(
    apkUrl: string,
    onProgress?: DownloadProgressCallback,
): Promise<string> {
    if (!apkUrl) {
        throw new Error('APK URL is empty');
    }

    const destPath = getDownloadsApkPath();

    const task = RNFS.downloadFile({
        fromUrl: apkUrl,
        toFile: destPath,
        progressDivider: 5,
        progress: progressEvent => {
            if (!onProgress) return;
            const { bytesWritten, contentLength } = progressEvent;
            if (!contentLength) return;
            const percent = (bytesWritten / contentLength) * 100;
            onProgress(Math.round(percent));
        },
    });

    const result = await task.promise;

    if (result.statusCode !== 200) {
        throw new Error(
            `Download failed with status ${result.statusCode ?? 'unknown'}`,
        );
    }

    return destPath;
}

// ----- Clear downloaded APK -----

export type ClearApkTarget = 'appPrivate' | 'downloadsPublic' | 'both';

/**
 * Xoá file ccms-latest.apk đã tải về.
 * - target = 'appPrivate'      => xoá ở DocumentDirectoryPath
 * - target = 'downloadsPublic' => xoá ở DownloadDirectoryPath
 * - target = 'both' (default)  => xoá ở cả 2 nơi (nếu tồn tại)
 */
export async function clearDownloadedApk(
    target: ClearApkTarget = 'both',
): Promise<void> {
    const paths: string[] = [];

    if (target === 'appPrivate' || target === 'both') {
        paths.push(getAppPrivateApkPath());
    }

    if (target === 'downloadsPublic' || target === 'both') {
        paths.push(getDownloadsApkPath());
    }

    for (const p of paths) {
        try {
            const exists = await RNFS.exists(p);
            if (exists) {
                await RNFS.unlink(p);
            }
        } catch (err) {
            // Không cần crash nếu xoá lỗi, chỉ log để debug
            console.warn('[clearDownloadedApk] Failed to delete', p, err);
        }
    }
}

// ----- Install APK -----

/**
 * Mở file APK bằng system installer (Android).
 * - localPath: path trả về từ downloadApkToAppDir / downloadApkToDownloadsDir
 *
 * Lưu ý:
 * - Chỉ chạy được trên Android.
 * - User vẫn phải bấm nút "Install" trong màn hình hệ thống.
 * - Trên Android 8+ cần quyền REQUEST_INSTALL_PACKAGES trong manifest.
 */
export async function installApk(localPath: string): Promise<void> {
    if (Platform.OS !== 'android') {
        throw new Error('installApk chỉ hỗ trợ Android');
    }

    if (!localPath) {
        throw new Error('Đường dẫn APK trống');
    }

    const exists = await RNFS.exists(localPath);
    if (!exists) {
        throw new Error('File APK không tồn tại');
    }

    try {
        // react-native-file-viewer sẽ tự dùng ACTION_VIEW + FileProvider
        // để gọi system installer với mimetype phù hợp.
        await FileViewer.open(localPath, {
            showOpenWithDialog: false,
        });
    } catch (error) {
        console.warn('[installApk] FileViewer.open error', error);
        throw error;
    }
}
