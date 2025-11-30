// src/screens/HomeScreen.tsx

import { Alert, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';
import { useSelection } from '../context/SelectionContext';

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

    const { openSelection } = useSelection();

    // Demo dữ liệu kho
    const warehouseItems = React.useMemo(
        () => [
            { id: 'H100', label: 'H100', subLabel: 'Kho H100' },
            { id: 'R200', label: 'R200', subLabel: 'Kho H100' },
            { id: 'R300', label: 'R300', subLabel: 'Kho H100' },
            { id: 'R400', label: 'R400', subLabel: 'Kho R300' },
            { id: 'R500', label: 'R500', subLabel: 'Kho R300' },
            { id: 'R600', label: 'R600', subLabel: 'Kho R300' },
            { id: 'R700', label: 'R700', subLabel: 'Kho R300' },
            { id: 'R800', label: 'R800', subLabel: 'Kho R300' },
            { id: 'R900', label: 'R900', subLabel: 'Kho R300' },
            { id: 'H200', label: 'H200', subLabel: 'Kho R300' },
        ],
        [],
    );

    // const warehouseItems = React.useMemo(
    //     () => [
    //         { id: 'H100', label: 'H100', },
    //         { id: 'R200', label: 'R200', },
    //         { id: 'R300', label: 'R300', },
    //         { id: 'R400', label: 'R400', },
    //         { id: 'R500', label: 'R500', },
    //         { id: 'R700', label: 'R700', },
    //         { id: 'R800', label: 'R800', },
    //         { id: 'R900', label: 'R900', },
    //         { id: 'H200', label: 'H200', },
    //     ],
    //     [],
    // );

    const handleSelectSingle = () => {
        openSelection({
            title: 'Chọn 1 kho (Dialog)',
            subtitle: 'Demo chọn 1 kho duy nhất',
            items: warehouseItems,
            mode: 'single',
            variant: 'dialog',
            confirmLabel: 'OK',
            cancelLabel: 'Huỷ',
            onConfirm: (ids) => {
                console.log('Chọn 1 kho:', ids);
            },
        });
    };

    const handleSelectMultiple = () => {
        openSelection({
            title: 'Chọn nhiều kho (Bottom sheet)',
            subtitle: 'Demo chọn nhiều kho',
            items: warehouseItems,
            mode: 'multiple',
            variant: 'bottomSheet',
            confirmLabel: 'Áp dụng',
            cancelLabel: 'Đóng',
            onConfirm: (ids) => {
                console.log('Chọn nhiều kho:', ids);
            },
        });
    };

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
            <View className="flex-1 items-center  px-4 space-y-4">
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

                <View className="mt-6 w-full gap-3">
                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={handleSelectSingle}>
                        <Text>
                            Chọn 1 kho (Dialog)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-3 rounded-lg items-center"
                        style={{ backgroundColor: theme.colors.secondaryContainer }}
                        onPress={handleSelectMultiple}>
                        <Text>
                            Chọn nhiều kho (Bottom sheet)
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
