// src/screens/SelectItemScreen.tsx

import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

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
        console.log('Lưu mẫu item cho PO: ', poNo, rows);
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
            edges={['right', 'left', 'bottom']}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* PO No. */}
                    <View style={styles.poRow}>
                        <Text style={styles.label}>PO No.</Text>
                        <TextInput
                            dense
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
                                    borderColor: theme.colors.outline,
                                    backgroundColor: theme.colors.surface,
                                },
                            ]}
                        >
                            {/* Tạm thời fake thông tin Read Key */}
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: secondaryText,
                                }}
                            >
                                Supplier Name: HENKEL{'\n'}
                                Factory Name: Vietnam{'\n'}
                                Part No.: S0000001{'\n'}
                                ...
                            </Text>
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
                        <ScrollView style={{ flex: 1 }}>
                            {/* Horizontal scroll để tràn phải thì kéo */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator
                                style={{
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor:
                                        theme.colors.outlineVariant ??
                                        theme.colors.outline,
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
                                                    theme.colors
                                                        .surfaceVariant ??
                                                    theme.colors.surface,
                                                borderBottomWidth:
                                                    StyleSheet.hairlineWidth,
                                                borderBottomColor:
                                                    theme.colors
                                                        .outlineVariant ??
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

                                    {/* Rows */}
                                    {rows.map(r => (
                                        <React.Fragment key={r.id}>
                                            {renderRow({ item: r })}
                                        </React.Fragment>
                                    ))}
                                </View>
                            </ScrollView>
                        </ScrollView>
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
        fontSize: 14,
    },
    scanBlock: {
        marginBottom: 12,
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
        minHeight: 40,
        paddingHorizontal: 8,
    },
    headerCell: {
        fontSize: 13,
        fontWeight: '600',
        paddingVertical: 6,
    },
    cellText: {
        fontSize: 13,
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
