// src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { useNavigation } from '@react-navigation/native';
import { usePaperAppTheme } from '../context/ThemeContext';
import { useSelection } from '../context/SelectionContext';
import { useSessionContext } from '../context/SessionContext';

type Nav = NativeStackNavigationProp<any>;

export function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { openSelection } = useSelection();
    const { warehouseCode, setWarehouseCode } = useSessionContext();
    const { showSuccess, showError } = useDialog();

    useEffect(() => {
        // Đã có warehouse trong session (đã load từ MMKV ở SessionProvider) → khỏi hỏi
        if (warehouseCode) return;

        openSelection({
            title: 'Chọn Warehouse',
            subtitle: 'Vui lòng chọn kho làm việc.',
            variant: 'dialog',
            mode: 'single',
            items: [
                { id: 'H100', label: 'H100' },
                { id: 'R200', label: 'R200' },
            ],
            dismissOnBackdropPress: false,
            confirmLabel: 'Chọn',
            onConfirm: selectedIds => {
                const selectedId = selectedIds[0];
                if (!selectedId) return;

                // ✅ Cập nhật SessionContext - đồng thời đã lưu luôn vào MMKV
                setWarehouseCode(selectedId);
            },
        });
    }, [openSelection, warehouseCode, setWarehouseCode]);

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

    const handleGoReceive = () => {
        // TODO: đổi Routes.ReceivePO cho đúng tên route bạn đăng ký trong navigator
        navigation.navigate(Routes.ReceiveGoods as never);
    };

    const handleGoSecond = () => {
        // TODO: đổi Routes.SecondFeature (hoặc gì đó) cho đúng route thật
        navigation.navigate(Routes.AddQrTemplate as never);
    };

    // ✅ Ví dụ dùng showSuccess + sound
    const handleTestSuccess = () => {
        showSuccess({
            title: 'Thành công',
            message: 'Test success có bật âm thanh.',
            autoCloseMs: 1500,
            playSound: true, // mặc định cũng true, ghi cho rõ
        });
    };

    // ✅ Ví dụ dùng showError nhưng tắt sound
    const handleTestErrorNoSound = () => {
        showError({
            title: 'Lỗi',
            message: 'Test error nhưng KHÔNG phát âm thanh.',
            autoCloseMs: 1500,
            playSound: false,
        });
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View className="flex-1 justify-center items-center px-4">
                <View className="w-full space-y-4">
                    {/* Nút 1: Nhận Hàng */}
                    <TouchableOpacity
                        className="rounded-2xl py-6 px-4"
                        style={{ backgroundColor: theme.colors.primary }}
                        activeOpacity={0.85}
                        onPress={handleGoReceive}
                    >
                        <Text
                            style={{
                                color: theme.colors.onPrimary,
                                fontSize: 18,
                                fontWeight: '700',
                                textAlign: 'center',
                                marginBottom: 6,
                            }}
                        >
                            Nhận Hàng
                        </Text>
                        <Text
                            style={{
                                color: theme.colors.onPrimary,
                                fontSize: 13,
                                textAlign: 'center',
                            }}
                        >
                            Nhập hoặc quét QR để tìm, chọn mã PO
                        </Text>
                    </TouchableOpacity>

                    {/* Nút 2: màn thứ 2 – sẽ làm sau */}
                    <TouchableOpacity
                        className="rounded-2xl py-6 px-4"
                        style={{
                            backgroundColor:
                                theme.colors.secondaryContainer ?? theme.colors.surface,
                        }}
                        activeOpacity={0.85}
                        onPress={handleGoSecond}
                    >
                        <Text
                            style={{
                                color: primaryText,
                                fontSize: 18,
                                fontWeight: '700',
                                textAlign: 'center',
                                marginBottom: 6,
                            }}
                        >
                            Chức năng 2
                        </Text>
                        <Text
                            style={{
                                color: secondaryText,
                                fontSize: 13,
                                textAlign: 'center',
                            }}
                        >
                            Sẽ triển khai sau
                        </Text>
                    </TouchableOpacity>

                    {/* ✅ Nhóm test sound dialog (ví dụ cách dùng) */}
                    <View className="mt-6 space-y-2">
                        <TouchableOpacity
                            className="rounded-xl py-3 px-4"
                            style={{
                                backgroundColor: theme.colors.surfaceVariant,
                            }}
                            activeOpacity={0.85}
                            onPress={handleTestSuccess}
                        >
                            <Text
                                style={{
                                    color: primaryText,
                                    fontSize: 13,
                                    fontWeight: '600',
                                    textAlign: 'center',
                                }}
                            >
                                Test Success (có âm thanh)
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="rounded-xl py-3 px-4"
                            style={{
                                backgroundColor: theme.colors.surfaceVariant,
                            }}
                            activeOpacity={0.85}
                            onPress={handleTestErrorNoSound}
                        >
                            <Text
                                style={{
                                    color: primaryText,
                                    fontSize: 13,
                                    fontWeight: '600',
                                    textAlign: 'center',
                                }}
                            >
                                Test Error (không âm thanh)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
