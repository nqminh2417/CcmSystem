import { Button, Text } from 'react-native-paper';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
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
    poNo: string;
};

// tạm thời 3 cột: QR Raw, Parsed Value, Status (sau bạn đổi tên / cấu trúc tuỳ ý)
type ScanRow = {
    id: string;
    itemCode: string;
    itemName: string;
    qtyPerUnit: string;
    qty: string;
    supplierName: string;
};

const COL_WIDTH = {
    itemCode: 90,
    itemName: 180,
    qtyPerUnit: 80,
    qty: 60,
    supplierName: 160,
};

const TABLE_WIDTH =
    COL_WIDTH.itemCode +
    COL_WIDTH.itemName +
    COL_WIDTH.qtyPerUnit +
    COL_WIDTH.qty +
    COL_WIDTH.supplierName;

export function ScanQrReceiveScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const poNo = (route.params as ScanQrReceiveRouteParams)?.poNo ?? '';

    // TODO: sau này rows sẽ được cập nhật khi máy scan bắn data vào
    const [rows, setRows] = useState<ScanRow[]>([
        {
            id: '1',
            itemCode: 'ITEM-001',
            itemName: 'Item name 01',
            qtyPerUnit: '10',
            qty: '1',
            supplierName: 'Supplier A',
        },
        {
            id: '2',
            itemCode: 'ITEM-002',
            itemName: 'Item name 02',
            qtyPerUnit: '10',
            qty: '2',
            supplierName: 'Supplier B',
        },
    ]);

    const handlePickItem = () => {
        // TODO: sau này gọi API "Lưu nhận hàng"
        // Tạm thời điều hướng sang SelectItemScreen
        console.log('qua màn hình chọn item cho PO: ', poNo);
        navigation.navigate(Routes.SelectItem, { poNo });
    };

    const handleSaveReceive = () => {
        // TODO: sau này gọi API "Lưu nhận hàng"
        // Tạm thời điều hướng sang AddQrTemplateScreen
        console.log('Lưu nhận hàng cho PO: ', poNo);
        navigation.navigate(Routes.AddQrTemplate, { poNo });
    };

    const handleFakeScan = () => {
        setRows(prev => {
            const index = prev.length + 1;
            return [
                ...prev,
                {
                    id: String(index),
                    itemCode: `ITEM-${String(index).padStart(3, '0')}`,
                    itemName: `Item name ${String(index).padStart(2, '0')}`,
                    qtyPerUnit: '10',
                    qty: String(index),
                    supplierName: `Supplier ${String.fromCharCode(64 + ((index % 26) || 1))}`,
                },
            ];
        });
    };

    const renderRow = ({ item }: { item: ScanRow }) => (
        <View
            style={[
                styles.row,
                {
                    backgroundColor: theme.colors.surface,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor:
                        theme.colors.outlineVariant ?? theme.colors.outline,
                },
            ]}
        >
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.itemCode, color: primaryText },
                ]}
                numberOfLines={1}
            >
                {item.itemCode}
            </Text>
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.itemName, color: secondaryText },
                ]}
                numberOfLines={1}
            >
                {item.itemName}
            </Text>
            <Text
                style={[
                    styles.cellText,
                    {
                        width: COL_WIDTH.qtyPerUnit,
                        color: primaryText,
                        textAlign: 'center',
                    },
                ]}
                numberOfLines={1}
            >
                {item.qtyPerUnit}
            </Text>
            <Text
                style={[
                    styles.cellText,
                    {
                        width: COL_WIDTH.qty,
                        color: primaryText,
                        textAlign: 'center',
                    },
                ]}
                numberOfLines={1}
            >
                {item.qty}
            </Text>
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.supplierName, color: secondaryText },
                ]}
                numberOfLines={1}
            >
                {item.supplierName}
            </Text>
        </View>
    );

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['right', 'left', 'bottom']}
        >
            <View style={styles.container}>
                <View style={[styles.poRow]}>
                    <Text style={[styles.label, { color: primaryText }]}>
                        PO No.
                    </Text>
                    <TextInput
                        value={poNo}
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

                    {/* Cuộn ngang khi bảng rộng, FlatList cuộn dọc khi nhiều dòng */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator
                        style={{
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor:
                                theme.colors.outlineVariant ?? theme.colors.outline,
                            borderRadius: 8,
                            flex: 1,
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
                                        { width: COL_WIDTH.itemCode, color: primaryText },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Item code
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.itemName, color: primaryText },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Item name
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        {
                                            width: COL_WIDTH.qtyPerUnit,
                                            color: primaryText,
                                            textAlign: 'center',
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Qty/unit
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        {
                                            width: COL_WIDTH.qty,
                                            color: primaryText,
                                            textAlign: 'center',
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Qty
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.supplierName, color: primaryText },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Supplier name
                                </Text>
                            </View>

                            {/* Danh sách rows – không click, chỉ hiển thị */}
                            <FlatList
                                data={rows}
                                keyExtractor={item => item.id}
                                renderItem={renderRow}
                                style={{}}
                                contentContainerStyle={{}}
                            />
                        </View>
                    </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        mode="contained"
                        onPress={handlePickItem}
                        style={styles.saveButton}
                    >
                        Chọn Item
                    </Button>
                    {/* Nút Lưu nhận hàng */}
                    <Button
                        mode="contained"
                        onPress={handleSaveReceive}
                        style={styles.saveButton}
                    >
                        Lưu nhận hàng
                    </Button>
                </View>
                {/* fake scan */}
                <Button
                    mode="outlined"
                    onPress={handleFakeScan}
                    style={{}}
                >
                    Giả lập scan (thêm 1 dòng)
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
    // giống style searchRow ở ReceiveGoods nhưng cho label + input
    poRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    poInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
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
        // alignSelf: 'flex-end', // đổi thành 'stretch' nếu muốn full width
    },
});
