// src/screens/SettingsScreen.tsx

import {
    List,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Vibration, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { checkForAppUpdate } from '../utils/appUpdate';
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
    const { showInfo, showError } = useDialog();

    const [vibrationEnabled, setVibrationEnabledState] = useState(true);

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
        try {
            const result = await checkForAppUpdate();
            if (!result.hasUpdate) {
                showInfo({
                    title: 'Cập nhật',
                    message: 'Bạn đang dùng phiên bản mới nhất.',
                });
                return;
            }

            showInfo({
                title: 'Có bản cập nhật mới',
                message:
                    `Hiện tại: ${result.currentVersionName} (Build ${result.currentBuildNumber})\n` +
                    `Bản mới: ${result.latestVersionName} (Build ${result.latestVersionCode})`,
                // sau này ở đây bạn có thể hiển thị popup confirm "Cập nhật" -> bắt đầu download APK
            });
        } catch (e) {
            console.log('[checkUpdate] error', e);
            showError({
                title: 'Lỗi',
                message: 'Không kiểm tra được phiên bản. Vui lòng thử lại.',
            });
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
                    <TouchableRipple onPress={handleCheckUpdate}>
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
                                    Kiểm tra xem có phiên bản mới hơn hay không
                                </Text>
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
});
