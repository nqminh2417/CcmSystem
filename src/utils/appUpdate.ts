// src/utils/appUpdate.ts

import { getAppVersionInfo } from './appInfo';
import {
    fetchLatestAppVersion,
    type AppVersionResponse,
} from '../api/versionApi';

export type AppUpdateCheckResult = {
    hasUpdate: boolean;

    currentVersionName: string;
    currentBuildNumber: number;

    latestVersionName?: string;
    latestVersionCode?: number;
};

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
