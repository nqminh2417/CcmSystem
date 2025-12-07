// src/utils/appInfo.ts

import { APP_KEYS, storageUtils } from './mmkv';

import DeviceInfo from 'react-native-device-info';

export type AppVersionInfo = {
    versionName: string;     // ví dụ: "1.2.3"
    buildNumber: number;     // ví dụ: 5 (versionCode)
    displayShort: string;    // "Version 1.2.3"
    displayFull: string;     // "Version 1.2.3 (Build 5)"
};

/**
 * Đọc version từ native & đồng bộ versionName vào MMKV (APP_KEYS.currentVersion)
 * để chỗ khác (như fetchWrapper) có thể dùng VERSION trong body.
 */
export function getAppVersionInfo(): AppVersionInfo {
    const versionName = DeviceInfo.getVersion();          // "1.2.3"
    const buildNumberStr = DeviceInfo.getBuildNumber();   // "5"
    const buildNumber = Number(buildNumberStr) || 0;

    // Sync vào MMKV để client.ts lấy VERSION gửi lên server
    try {
        storageUtils.raw.set(APP_KEYS.currentVersion, versionName);
    } catch (e) {
        // Không cần crash app nếu ghi lỗi
        console.warn('[appInfo] Failed to save currentVersion to MMKV:', e);
    }

    return {
        versionName,
        buildNumber,
        displayShort: `Version ${versionName}`,
        displayFull: `Version ${versionName} (Build ${buildNumber})`,
    };
}
