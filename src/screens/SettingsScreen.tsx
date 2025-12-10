// src/screens/SettingsScreen.tsx

import {
    ActivityIndicator,
    List,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Vibration, View } from 'react-native';
import { checkForAppUpdate, downloadApkToAppDir, installApk } from '../utils/appUpdate';

import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppVersionInfo } from '../utils/appInfo';
import { storageUtils } from '../utils/mmkv';
import { useAppTheme } from '../context/ThemeContext';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';

export function SettingsScreen() {
    const { displayFull } = getAppVersionInfo();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { isDark, toggleTheme } = useAppTheme();
    const theme = useTheme();
    const { showInfo, showError, showConfirm } = useDialog();

    const [vibrationEnabled, setVibrationEnabledState] = useState(true);

    const [checkingUpdate, setCheckingUpdate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    // Load setting rung lần đầu vào màn hình
    useEffect(() => {
        const enabled = storageUtils.getVibrationEnabled();
        setVibrationEnabledState(enabled);
    }, []);

    const handleToggleTheme = () => {
        toggleTheme();
    };

    const handleToggleVibration = () => {
        setVibrationEnabledState(prev => {
            const next = !prev;

            // lưu vào mmkv
            storageUtils.setVibrationEnabled(next);

            // 🔔 chỉ rung khi user bật ON
            if (next) {
                Vibration.vibrate(60);
            }

            return next;
        });
    };

    const handleCheckUpdate = async () => {
        if (checkingUpdate || isUpdating) {
            // đang bận, tránh bấm spam
            return;
        }

        try {
            setCheckingUpdate(true);
            const result = await checkForAppUpdate();

            if (!result.hasUpdate) {
                showInfo({
                    title: 'Cập nhật',
                    message: 'Bạn đang dùng phiên bản mới nhất.',
                });
                return;
            }

            // Có bản mới -> hỏi confirm
            showConfirm({
                title: 'Có bản cập nhật mới',
                message:
                    `Hiện tại: ${result.currentVersionName} (Build ${result.currentBuildNumber})\n` +
                    `Bản mới: ${result.latestVersionName} (Build ${result.latestVersionCode})\n\n` +
                    'Bạn có muốn tải về và cài đặt ngay bây giờ không?',
                onConfirm: async () => {

                    const apkDownloadUrl = Config.APK_DOWNLOAD_URL;

                    if (!apkDownloadUrl) {
                        // Không lộ URL, nhưng nếu cấu hình sai thì hiện thông báo lỗi
                        showError({
                            title: 'Lỗi cấu hình',
                            message:
                                'Biến môi trường APK_DOWNLOAD_URL chưa được cấu hình. Vui lòng liên hệ quản trị hệ thống.',
                        });
                        return;
                    }

                    try {
                        setIsUpdating(true);
                        setDownloadProgress(0);

                        const localPath = await downloadApkToAppDir(
                            apkDownloadUrl,
                            progress => {
                                // progress: 0–100
                                setDownloadProgress(progress);
                            },
                        );

                        // Nếu downloadApkToAppDir hiện đang fake error,
                        // đoạn dưới sẽ vào catch. Khi bạn có URL thật sẽ chạy bình thường.
                        await installApk(localPath);
                    } catch (e) {
                        console.log('[update] download/install error', e);
                        showError({
                            title: 'Lỗi cập nhật',
                            message:
                                'Không tải hoặc cài đặt được bản cập nhật. Vui lòng thử lại sau.',
                        });
                    } finally {
                        setIsUpdating(false);
                        setDownloadProgress(0);
                    }
                },
                onCancel: () => {
                    // user bấm Huỷ -> không làm gì thêm
                },
            });
        } catch (e) {
            console.log('[checkUpdate] error', e);
            showError({
                title: 'Lỗi',
                message: 'Không kiểm tra được phiên bản. Vui lòng thử lại.',
            });
        } finally {
            setCheckingUpdate(false);
        }
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Section giao diện */}
                <List.Section>
                    <List.Subheader style={styles.subheader}>
                        Giao diện
                    </List.Subheader>

                    <TouchableRipple onPress={handleToggleTheme}>
                        <View style={styles.row}>
                            <View style={styles.textBlock}>
                                <Text
                                    style={[
                                        styles.title,
                                        { color: primaryText },
                                    ]}
                                >
                                    Chế độ nền tối
                                </Text>
                                <Text
                                    style={[
                                        styles.description,
                                        { color: secondaryText },
                                    ]}
                                >
                                    Đổi giữa giao diện sáng và tối
                                </Text>
                            </View>
                            <View pointerEvents="none">
                                <Switch
                                    value={isDark}
                                    onValueChange={handleToggleTheme}
                                />
                            </View>
                        </View>
                    </TouchableRipple>
                </List.Section>

                {/* Section thông báo & phản hồi */}
                <List.Section>
                    <List.Subheader style={styles.subheader}>
                        Thông báo & phản hồi
                    </List.Subheader>

                    <TouchableRipple onPress={handleToggleVibration}>
                        <View style={styles.row}>
                            <View style={styles.textBlock}>
                                <Text
                                    style={[
                                        styles.title,
                                        { color: primaryText },
                                    ]}
                                >
                                    Rung khi báo lỗi
                                </Text>
                                <Text
                                    style={[
                                        styles.description,
                                        { color: secondaryText },
                                    ]}
                                >
                                    Rung nhẹ khi hiển thị thông báo lỗi
                                </Text>
                            </View>
                            <View pointerEvents="none">
                                <Switch
                                    value={vibrationEnabled}
                                    onValueChange={handleToggleVibration}
                                />
                            </View>
                        </View>
                    </TouchableRipple>
                </List.Section>

                {/* Section thông tin ứng dụng */}
                <List.Section>
                    <List.Subheader style={styles.subheader}>
                        Thông tin ứng dụng
                    </List.Subheader>

                    {/* Hàng hiển thị phiên bản hiện tại */}
                    <View style={styles.row}>
                        <View style={styles.textBlock}>
                            <Text
                                style={[
                                    styles.title,
                                    { color: primaryText },
                                ]}
                            >
                                Phiên bản
                            </Text>
                            <Text
                                style={[
                                    styles.description,
                                    { color: secondaryText },
                                ]}
                            >
                                {displayFull}
                            </Text>
                        </View>
                    </View>

                    {/* Hàng kiểm tra cập nhật */}
                    <TouchableRipple
                        onPress={handleCheckUpdate}
                        disabled={checkingUpdate || isUpdating}
                    >
                        <View style={styles.row}>
                            <View style={styles.textBlock}>
                                <Text
                                    style={[
                                        styles.title,
                                        { color: primaryText },
                                    ]}
                                >
                                    Kiểm tra cập nhật
                                </Text>
                                <Text
                                    style={[
                                        styles.description,
                                        { color: secondaryText },
                                    ]}
                                >
                                    Kiểm tra và cài đặt bản cập nhật mới
                                </Text>
                            </View>

                            <View style={styles.updateRight}>
                                {checkingUpdate && !isUpdating && (
                                    <View style={styles.inlineStatus}>
                                        <ActivityIndicator size="small" />
                                        <Text
                                            style={[
                                                styles.description,
                                                { color: secondaryText },
                                            ]}
                                        >
                                            {'  Đang kiểm tra...'}
                                        </Text>
                                    </View>
                                )}

                                {isUpdating && (
                                    <View style={styles.inlineStatus}>
                                        <ActivityIndicator size="small" />
                                        <Text
                                            style={[
                                                styles.description,
                                                { color: secondaryText },
                                            ]}
                                        >
                                            {`  Đang tải... ${Math.round(
                                                downloadProgress || 0,
                                            )}%`}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableRipple>
                </List.Section>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    row: {
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textBlock: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
    },
    description: {
        marginTop: 2,
        fontSize: 11,
    },
    subheader: {
        fontSize: 13,
        fontWeight: '600',
        opacity: 0.8,
    },
    updateRight: {
        marginLeft: 8,
        minWidth: 120,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    inlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
