import { Button, Text, TextInput } from 'react-native-paper';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Routes } from '../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';

// route params
type ScanQrReceiveRouteParams = {
    poCode: string;
};

// tạm thời 3 cột: QR Raw, Parsed Value, Status (sau bạn đổi tên / cấu trúc tuỳ ý)
type ScanRow = {
    id: string;
    qrRaw: string;
    parsedValue: string;
    status: string;
};

const COL_WIDTH = {
    qrRaw: 200,
    parsedValue: 220,
    status: 120,
};

const TABLE_WIDTH = COL_WIDTH.qrRaw + COL_WIDTH.parsedValue + COL_WIDTH.status;

export function ScanQrReceiveScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const poCode = (route.params as ScanQrReceiveRouteParams)?.poCode ?? '';

    // TODO: sau này rows sẽ được cập nhật khi máy scan bắn data vào
    const [rows] = useState<ScanRow[]>([
        {
            id: '1',
            qrRaw: 'QR-001-ABC',
            parsedValue: 'PO123456 / Item 01',
            status: 'OK',
        },
        {
            id: '2',
            qrRaw: 'QR-002-DEF',
            parsedValue: 'PO123456 / Item 02',
            status: 'OK',
        },
        {
            id: '3',
            qrRaw: 'QR-003-XYZ',
            parsedValue: 'PO123456 / Item 03',
            status: 'DUP',
        },
    ]);

    const handleRowPress = (row: ScanRow) => {
        // Đi tới AddQrTemplateScreen, truyền poCode
        // sau này nếu cần truyền thêm info của row thì nhét vào params luôn
        navigation.navigate(Routes.AddQrTemplate as never, { poCode } as never);
    };

    const handleSaveReceive = () => {
        // TODO: sau này gọi API "Lưu nhận hàng"
        console.log('Lưu nhận hàng cho PO: ', poCode);
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['right', 'left', 'bottom']}
        >
            <View style={styles.container}>
                {/* PO Code block */}
                <View style={styles.poBlock}>
                    <Text style={[styles.label, { color: primaryText }]}>PO Code</Text>
                    <TextInput
                        mode="outlined"
                        value={poCode}
                        editable={false}
                        selectTextOnFocus={false}
                        style={styles.poInput}
                    />
                </View>

                {/* Grid scan QR (3 cột) */}
                <View style={styles.gridWrapper}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: primaryText,
                            marginBottom: 4,
                        }}
                    >
                        Kết quả quét QR
                    </Text>

                    {/* Vertical scroll nếu nhiều dòng */}
                    <ScrollView style={{ flex: 1 }}>
                        {/* Horizontal scroll để giữ cột thẳng, tràn sang phải thì kéo */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator
                            style={{
                                borderWidth: StyleSheet.hairlineWidth,
                                borderColor:
                                    theme.colors.outlineVariant ?? theme.colors.outline,
                                borderRadius: 8,
                            }}
                        >
                            <View style={{ width: TABLE_WIDTH }}>
                                {/* Header */}
                                <View
                                    style={[
                                        styles.row,
                                        {
                                            backgroundColor:
                                                theme.colors.surfaceVariant ?? theme.colors.surface,
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomColor:
                                                theme.colors.outlineVariant ?? theme.colors.outline,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.headerCell,
                                            { width: COL_WIDTH.qrRaw, color: primaryText },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        QR Raw
                                    </Text>
                                    <Text
                                        style={[
                                            styles.headerCell,
                                            { width: COL_WIDTH.parsedValue, color: primaryText },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        Parsed Value
                                    </Text>
                                    <Text
                                        style={[
                                            styles.headerCell,
                                            {
                                                width: COL_WIDTH.status,
                                                color: primaryText,
                                                textAlign: 'center',
                                            },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        Status
                                    </Text>
                                </View>

                                {/* Rows (clickable) */}
                                {rows.map(row => (
                                    <Pressable
                                        key={row.id}
                                        onPress={() => handleRowPress(row)}
                                        android_ripple={{ color: theme.colors.surfaceVariant }}
                                        style={({ pressed }) => [
                                            styles.row,
                                            {
                                                backgroundColor: pressed
                                                    ? theme.colors.surfaceVariant
                                                    : theme.colors.surface,
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                                borderBottomColor:
                                                    theme.colors.outlineVariant ??
                                                    theme.colors.outline,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.cellText,
                                                { width: COL_WIDTH.qrRaw, color: primaryText },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {row.qrRaw}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.cellText,
                                                { width: COL_WIDTH.parsedValue, color: secondaryText },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {row.parsedValue}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.cellText,
                                                {
                                                    width: COL_WIDTH.status,
                                                    color:
                                                        row.status === 'OK'
                                                            ? theme.colors.primary
                                                            : theme.colors.error,
                                                    textAlign: 'center',
                                                },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {row.status}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </ScrollView>
                </View>

                {/* Nút Lưu nhận hàng */}
                <Button
                    mode="contained"
                    onPress={handleSaveReceive}
                    style={styles.saveButton}
                >
                    Lưu nhận hàng
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    poBlock: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    poInput: {
        height: 44,
    },
    gridWrapper: {
        flex: 1,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    headerCell: {
        fontSize: 11,
        fontWeight: '700',
        paddingRight: 4,
    },
    cellText: {
        fontSize: 11,
        paddingRight: 4,
    },
    saveButton: {
        alignSelf: 'flex-end', // đổi thành 'stretch' nếu muốn full width
    },
});
