declare module 'react-native-config' {
    interface NativeConfig {
        API_BASE_URL: string;
        APK_DOWNLOAD_URL: string;
        // thêm các key khác nếu có
    }

    const Config: NativeConfig;
    export default Config;
}
