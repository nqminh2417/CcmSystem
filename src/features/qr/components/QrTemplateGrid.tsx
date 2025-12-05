// src/components/QrTemplateGrid.tsx

import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useCallback, useState } from 'react';

import { useHighContrastTextColors } from '../../../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../../../context/ThemeContext';
import { useSelection } from '../../../context/SelectionContext';

export type QrTemplateRow = {
    id: string;
    readKey: string;
    value: string;
    format: string;
    required: boolean;
    keyType: string;
};

type Props = {
    initialRows?: QrTemplateRow[];
    onChangeRows?: (rows: QrTemplateRow[]) => void;
};

// width cố định cho từng cột
const COL_WIDTH = {
    readKey: 120,
    value: 200,
    format: 100,
    required: 100,
    keyType: 100,
};

const TABLE_WIDTH =
    COL_WIDTH.readKey +
    COL_WIDTH.value +
    COL_WIDTH.format +
    COL_WIDTH.required +
    COL_WIDTH.keyType;

// Read Key cố định như bạn nói
const DEFAULT_ROWS: QrTemplateRow[] = [
    {
        id: 'supplierName',
        readKey: 'Supplier Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'Header',
    },
    {
        id: 'factoryName',
        readKey: 'Factory Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'Header',
    },
    {
        id: 'partNo',
        readKey: 'Part No.',
        value: '',
        format: 'string',
        required: true,
        keyType: 'Detail',
    },
    {
        id: 'chemicalName',
        readKey: 'Chemical Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'Detail',
    },
    {
        id: 'batchLotNo',
        readKey: 'Batch/Lot No.',
        value: '',
        format: 'string',
        required: true,
        keyType: 'Detail',
    },
    {
        id: 'prodDate',
        readKey: 'Production Date',
        value: '',
        format: 'date',
        required: false,
        keyType: 'Detail',
    },
    {
        id: 'expDate',
        readKey: 'Expiry Date',
        value: '',
        format: 'date',
        required: false,
        keyType: 'Detail',
    },
    {
        id: 'capacity',
        readKey: 'Capacity',
        value: '',
        format: 'number',
        required: false,
        keyType: 'Detail',
    },
    {
        id: 'unit',
        readKey: 'Unit',
        value: '',
        format: 'string',
        required: false,
        keyType: 'Detail',
    },
];

export const QrTemplateGrid: React.FC<Props> = ({
    initialRows = DEFAULT_ROWS,
    onChangeRows,
}) => {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { openSelection } = useSelection();

    const [rows, setRows] = useState<QrTemplateRow[]>(initialRows);

    const updateRows = useCallback(
        (updater: (prev: QrTemplateRow[]) => QrTemplateRow[]) => {
            setRows(prev => {
                const next = updater(prev);
                onChangeRows?.(next);
                return next;
            });
        },
        [onChangeRows],
    );

    const handleChangeValue = (id: string, text: string) => {
        updateRows(prev =>
            prev.map(r => (r.id === id ? { ...r, value: text } : r)),
        );
    };

    const handlePressRequired = (id: string, current: boolean) => {
        openSelection({
            title: 'Required?',
            subtitle: 'Chọn True / False cho dòng này',
            variant: 'dialog',
            mode: 'single',
            items: [
                { id: 'true', label: 'True' },
                { id: 'false', label: 'False' },
            ],
            initialSelectedIds: [current ? 'true' : 'false'],
            confirmLabel: 'OK',
            cancelLabel: 'Hủy',
            onConfirm: selectedIds => {
                const isTrue = selectedIds[0] === 'true';
                updateRows(prev =>
                    prev.map(r => (r.id === id ? { ...r, required: isTrue } : r)),
                );
            },
        });
    };

    const renderRow = ({ item }: { item: QrTemplateRow }) => (
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
            {/* Read Key */}
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.readKey, color: primaryText },
                ]}
                numberOfLines={1}
            >
                {item.readKey}
            </Text>

            {/* Value (TextInput) */}
            <View
                style={{
                    width: COL_WIDTH.value,
                    paddingRight: 4,
                }}
            >
                <TextInput
                    value={item.value}
                    onChangeText={text => handleChangeValue(item.id, text)}
                    placeholder="Nhập value"
                    placeholderTextColor={theme.colors.outline}
                    keyboardType={item.id === 'capacity' ? 'numeric' : 'default'}
                    style={[
                        styles.valueInput,
                        {
                            borderColor:
                                theme.colors.outlineVariant ?? theme.colors.outline,
                            color: primaryText,
                            backgroundColor: theme.colors.surface,
                        },
                    ]}
                />
            </View>

            {/* Format */}
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.format, color: secondaryText },
                ]}
                numberOfLines={1}
            >
                {item.format}
            </Text>

            {/* Required (bấm mở selection) */}
            <TouchableOpacity
                style={[
                    styles.requiredCell,
                    { width: COL_WIDTH.required },
                ]}
                activeOpacity={0.7}
                onPress={() => handlePressRequired(item.id, item.required)}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: item.required
                            ? theme.colors.primary
                            : secondaryText,
                    }}
                >
                    {item.required ? 'True' : 'False'}
                </Text>
            </TouchableOpacity>

            {/* Key Type */}
            <Text
                style={[
                    styles.cellText,
                    { width: COL_WIDTH.keyType, color: secondaryText },
                ]}
                numberOfLines={1}
            >
                {item.keyType}
            </Text>
        </View>
    );

    return (
        <View style={{ marginTop: 16 }}>
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: primaryText,
                    marginBottom: 4,
                }}
            >
                Mẫu nội dung QR
            </Text>

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
                {/* width tổng cố định → tràn sang phải thì kéo được */}
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
                                { width: COL_WIDTH.readKey, color: primaryText },
                            ]}
                            numberOfLines={1}
                        >
                            Read Key
                        </Text>
                        <Text
                            style={[
                                styles.headerCell,
                                { width: COL_WIDTH.value, color: primaryText },
                            ]}
                            numberOfLines={1}
                        >
                            Value
                        </Text>
                        <Text
                            style={[
                                styles.headerCell,
                                { width: COL_WIDTH.format, color: primaryText },
                            ]}
                            numberOfLines={1}
                        >
                            Format
                        </Text>
                        <Text
                            style={[
                                styles.headerCell,
                                {
                                    width: COL_WIDTH.required,
                                    textAlign: 'center',
                                    color: primaryText,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            Required
                        </Text>
                        <Text
                            style={[
                                styles.headerCell,
                                { width: COL_WIDTH.keyType, color: primaryText },
                            ]}
                            numberOfLines={1}
                        >
                            Key Type
                        </Text>
                    </View>

                    {/* Rows – FlatList cuộn dọc */}
                    <FlatList
                        data={rows}
                        keyExtractor={item => item.id}
                        renderItem={renderRow}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 16 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    headerCell: {
        fontSize: 16,
        fontWeight: '700',
        paddingRight: 4,
    },
    cellText: {
        fontSize: 12,
        paddingRight: 4,
    },
    valueInput: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 4,
        fontSize: 11,
    },
    requiredCell: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 2,
    },
});
