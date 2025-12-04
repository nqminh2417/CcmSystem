// src/screens/HomeScreen.tsx

import { Text, TouchableOpacity, View } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Routes } from '../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { useNavigation } from '@react-navigation/native';
import { usePaperAppTheme } from '../context/ThemeContext';

type Nav = NativeStackNavigationProp<any>;

export function HomeScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const navigation = useNavigation<Nav>();

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
                </View>
            </View>
        </SafeAreaView>
    );
}
