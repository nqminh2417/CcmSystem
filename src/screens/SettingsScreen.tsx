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
import { storageUtils } from '../utils/mmkv';
import { useAppTheme } from '../context/ThemeContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';

export function SettingsScreen() {
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { isDark, toggleTheme } = useAppTheme();
    const theme = useTheme();

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
