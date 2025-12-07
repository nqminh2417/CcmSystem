// src/api/versionApi.ts

/**
 * API lấy thông tin version mới nhất của app.
 * Hiện tại fake dữ liệu, sau này chỉ cần sửa lại gọi apiClient là được.
 */

export type AppVersionResponse = {
    latestVersionName: string;
    latestVersionCode: number;
};

export async function fetchLatestAppVersion(): Promise<AppVersionResponse> {
    // Fake: giả sử server đang có bản 1.2.3 với versionCode = 5
    return {
        latestVersionName: '1.2.3',
        latestVersionCode: 5,
    };
}
