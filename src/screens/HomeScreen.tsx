// src/screens/HomeScreen.tsx

import { Alert, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';

export function HomeScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const {
        showInfo,
        showError,
        showSuccess,
        showConfirm,
        showBottomSheet,
    } = useDialog();

    const handleTestConfirm = () => {
        showConfirm({
            title: 'Xoá box',
            message: 'Bạn có chắc muốn xoá box này?',
            onConfirm: async () => {
                // giả lập xoá xong
                showSuccess({
                    title: 'Đã xoá box',
                    message: 'Box đã được xoá thành công.',
                    autoCloseMs: 1500,
                });
            },
        });
    };

    const handleTestQueue = () => {
        showInfo({ message: 'Thông báo 1', autoCloseMs: 1000 });
        showInfo({ message: 'Thông báo 2', autoCloseMs: 1000 });
        showSuccess({ message: 'Thông báo 3 (success)', autoCloseMs: 1000 });
    };

    const handleTestAlert = () => {
        Alert.alert('Alert Title', 'My Alert Msg', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View className="flex-1 items-center justify-center px-4 space-y-4">
                <Text
                    className="text-xl font-extrabold"
                    style={{ color: primaryText }}
                >
                    Hello NativeWind v4
                </Text>

                <Text
                    className="mt-3 text-base text-center"
                    style={{ color: secondaryText }}
                >
                    Đây là màn hình Home. Chữ đã tăng độ tương phản cho dễ đọc.
                </Text>

                {/* Test các loại dialog */}
                <View className="mt-6 w-full space-y-2">
                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={() =>
                            showInfo({
                                title: 'Thông báo',
                                message: 'Đây là dialog info auto close 2s.',
                                autoCloseMs: 2000,
                            })
                        }
                    >
                        <Text style={{ color: theme.colors.onPrimary }}>Show Info</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.error }}
                        onPress={() =>
                            showError({
                                title: 'Lỗi Có lỗi xảy ra, vui lòng thử lại.',
                                // message: 'Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui liệu thuese. Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui liệu thử lại.  Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.',
                                message: 'Có lỗi xảy ra, vui lòng thử lại.',
                            })
                        }
                    >
                        <Text style={{ color: theme.colors.onError }}>Show Error</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={handleTestConfirm}
                    >
                        <Text style={{ color: theme.colors.onPrimary }}>
                            Show Confirm + Success
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.secondary }}
                        onPress={() =>
                            showBottomSheet({
                                // title: 'Bottom sheet',
                                title: 'Bottom sheet Có lỗi xảy ra, vui lòng thử lại.',
                                message: 'Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui lòng thử lại. Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui liệu thuese. Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui liệu thử lại.  Có lỗi xảy ra, vui liệu thử lại. Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.Có lỗi xảy ra, vui lòng thử lại.',
                                // message: 'Đây là thông báo kiểu bottom sheet.',
                            })
                        }
                    >
                        <Text style={{ color: theme.colors.onSecondary }}>
                            Show Bottom Sheet
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.tertiary }}
                        onPress={handleTestQueue}
                    >
                        <Text style={{ color: theme.colors.onTertiary }}>
                            Test Queue 3 dialog
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.tertiary }}
                        onPress={handleTestAlert}
                    >
                        <Text style={{ color: theme.colors.onTertiary }}>
                            Test Alert
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
