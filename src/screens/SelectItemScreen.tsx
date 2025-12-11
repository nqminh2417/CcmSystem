// src/screens/SelectItemScreen.tsx

import { Button, Checkbox, Text } from 'react-native-paper';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import React, { useState } from 'react';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';
import { useRoute } from '@react-navigation/native';

type SelectItemRouteParams = {
    poNo: string;
};

type ItemRow = {
    id: string;
    itemCode: string;
    itemName: string;
    checked: boolean;
};

const COL_WIDTH = {
    itemCode: 140,
    itemName: 220,
    check: 80,
};

const TABLE_WIDTH =
    COL_WIDTH.itemCode + COL_WIDTH.itemName + COL_WIDTH.check;

export function SelectItemScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const route = useRoute<any>();
    const poNo = (route.params as SelectItemRouteParams)?.poNo ?? '';

    const [rows, setRows] = useState<ItemRow[]>([
        {
            id: '1',
            itemCode: 'S0000001',
            itemName: 'LOCTITE BONDAGE 233CPA V3 13KG',
            checked: true,
        },
        {
            id: '2',
            itemCode: 'S0000002',
            itemName: 'ITEM NAME DEMO 02',
            checked: false,
        },
        {
            id: '3',
            itemCode: 'S0000003',
            itemName: 'ITEM NAME DEMO 03',
            checked: false,
        },
        {
            id: '4',
            itemCode: 'S0000004',
            itemName: 'ITEM NAME DEMO 04',
            checked: true,
        },
        {
            id: '5',
            itemCode: 'S0000005',
            itemName: 'ITEM NAME DEMO 05',
            checked: true,
        },
    ]);

    const toggleChecked = (id: string) => {
        setRows(prev =>
            prev.map(r =>
                r.id === id ? { ...r, checked: !r.checked } : r,
            ),
        );
    };

    const handleSaveItemTemplate = () => {
        // TODO: sau này gọi API lưu mẫu item
        // Lọc các dòng được check
        const selectedRows = rows.filter(r => r.checked);

        // Lấy danh sách itemCode
        const selectedItemCodes = selectedRows.map(r => r.itemCode);

        // Tạm thời log ra, sau này dùng body này để call API
        console.log('Lưu mẫu item template:', {
            poNo,
            itemCodes: selectedItemCodes,
            // nếu sau này cần thêm itemName / full row:
            // items: selectedRows,
        });
    };

    const renderRow = ({ item }: { item: ItemRow }) => (
        <View
            style={[
                styles.row,
                {
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
                    {
                        width: COL_WIDTH.itemName,
                        color: secondaryText,
                    },
                ]}
                numberOfLines={2}
            >
                {item.itemName}
            </Text>

            <View
                style={[
                    styles.checkCell,
                    { width: COL_WIDTH.check },
                ]}
            >
                <Checkbox
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => toggleChecked(item.id)}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{
                        flex: 1,
                        // backgroundColor: 'orange'
                    }}>
                        {/* PO No. */}
                        <View style={styles.poRow}>
                            <Text style={styles.label}>PO No.</Text>
                            <TextInput
                                value={poNo}
                                editable={false}
                                selectTextOnFocus={false}
                                style={[
                                    styles.poInput,
                                    {
                                        backgroundColor: theme.colors.surface,
                                    },
                                ]}
                            />
                        </View>

                        {/* Scan QRCode + thông tin Read Key */}
                        <View style={styles.scanBlock}>
                            <Text
                                style={[
                                    styles.label,
                                    { color: primaryText },
                                ]}
                            >
                                Scan QR Code
                            </Text>

                            <View
                                style={[
                                    styles.scanInfoBox,
                                    {
                                        flex: 1,
                                        borderColor: theme.colors.outline,
                                        backgroundColor: theme.colors.surface,
                                    },
                                ]}
                            >
                                <ScrollView
                                    style={{ flex: 1, maxHeight: 200 }}    // hoặc dùng flex: 1 nếu muốn chiếm kín
                                    showsVerticalScrollIndicator
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: secondaryText,
                                        }}
                                    >
                                        Supplier Name: HENKEL{'\n'}
                                        Factory Name: Vietnam{'\n'}
                                        Part No.: 2968189{'\n'}
                                        Chemical Name: 233CPA V3{'\n'}
                                        Batch/Lot No.: N453109428{'\n'}
                                        Production Date: 05082025{'\n'}
                                        Expiry Date: 01022026{'\n'}
                                        Capacity: 13{'\n'}
                                        Unit: KG
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    {/* Grid chọn item */}
                    <View style={styles.gridWrapper}>
                        <Text
                            style={[
                                styles.gridTitle,
                                { color: primaryText },
                            ]}
                        >
                            Danh sách Item
                        </Text>

                        {/* Vertical scroll nếu nhiều dòng */}
                        <View style={{ flex: 1 }}>
                            {/* Horizontal scroll để tràn phải thì kéo */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator
                                style={{
                                    flex: 1,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor:
                                        theme.colors.outlineVariant ??
                                        theme.colors.outline,
                                    borderRadius: 8,
                                }}
                            >
                                <View style={{ width: TABLE_WIDTH, flex: 1 }}>
                                    {/* Header */}
                                    <View
                                        style={[
                                            styles.row,
                                            {
                                                backgroundColor:
                                                    theme.colors.surfaceVariant ??
                                                    theme.colors.surface,
                                                borderBottomWidth:
                                                    StyleSheet.hairlineWidth,
                                                borderBottomColor:
                                                    theme.colors.outlineVariant ??
                                                    theme.colors.outline,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.headerCell,
                                                {
                                                    width: COL_WIDTH.itemCode,
                                                    color: primaryText,
                                                },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            Item code
                                        </Text>
                                        <Text
                                            style={[
                                                styles.headerCell,
                                                {
                                                    width: COL_WIDTH.itemName,
                                                    color: primaryText,
                                                },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            Item name
                                        </Text>
                                        <Text
                                            style={[
                                                styles.headerCell,
                                                {
                                                    width: COL_WIDTH.check,
                                                    color: primaryText,
                                                    textAlign: 'center',
                                                },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            Check
                                        </Text>
                                    </View>

                                    {/* Rows: FlatList cuộn dọc */}
                                    <FlatList
                                        data={rows}
                                        keyExtractor={item => item.id}
                                        renderItem={renderRow}
                                        style={{ flex: 1 }}
                                        contentContainerStyle={{}}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>

                {/* Nút Lưu mẫu Item */}
                <Button
                    mode="contained"
                    onPress={handleSaveItemTemplate}
                    style={styles.saveButton}
                >
                    Lưu mẫu Item
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
    content: {
        flex: 1,
    },
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
    scanBlock: {
        flex: 1,
        // marginBottom: 12,
    },
    scanInfoBox: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 4,
    },
    gridWrapper: {
        flex: 1,
        marginTop: 8,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 1,
    },
    headerCell: {
        fontSize: 13,
        fontWeight: '700',
        paddingVertical: 6,
    },
    cellText: {
        fontSize: 11,
        paddingVertical: 6,
    },
    checkCell: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 8,
        alignSelf: 'flex-end', // hoặc 'stretch' nếu muốn full width
    },
});
