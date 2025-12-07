// src/screens/HomeScreen.tsx

import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppVersionInfo } from '../utils/appInfo';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { useNavigation } from '@react-navigation/native';
import { usePaperAppTheme } from '../context/ThemeContext';
import { useSelection } from '../context/SelectionContext';
import { useSessionContext } from '../context/SessionContext';

type Nav = NativeStackNavigationProp<any>;

export function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const theme = usePaperAppTheme();
    const { displayShort } = getAppVersionInfo();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { openSelection } = useSelection();
    const { warehouseCode, setWarehouseCode } = useSessionContext();

    // --- hỏi warehouse lần đầu vào app ---
    useEffect(() => {
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
                setWarehouseCode(selectedId);
            },
        });
    }, [openSelection, warehouseCode, setWarehouseCode]);

    const handleGoReceive = () => {
        navigation.navigate(Routes.ReceiveGoods as never);
    };

    const handleGoSecond = () => {
        navigation.navigate(Routes.AddQrTemplate as never);
    };

    // --- 5-tap để vào DevDemoScreen ---
    const tapCountRef = useRef(0);
    // ❌ Không dùng NodeJS.Timeout nữa
    const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleVersionTap = () => {
        tapCountRef.current += 1;

        if (tapTimerRef.current) {
            clearTimeout(tapTimerRef.current);
        }

        // nếu trong 800ms không tap thêm thì reset lại
        tapTimerRef.current = setTimeout(() => {
            tapCountRef.current = 0;
        }, 800);

        if (tapCountRef.current >= 5) {
            tapCountRef.current = 0;
            if (tapTimerRef.current) {
                clearTimeout(tapTimerRef.current);
            }
            navigation.navigate(Routes.DevDemo as never);
        }
    };

    useEffect(() => {
        return () => {
            if (tapTimerRef.current) {
                clearTimeout(tapTimerRef.current);
            }
        };
    }, []);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    keyboardShouldPersistTaps="handled"
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
                                        theme.colors.secondaryContainer ??
                                        theme.colors.surface,
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
                </ScrollView>

                {/* Version ở center bottom + tap 5 lần để mở DevDemoScreen */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleVersionTap}
                    style={{ paddingVertical: 6 }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            color: theme.colors.onSurfaceVariant,
                        }}
                    >
                        {displayShort}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
