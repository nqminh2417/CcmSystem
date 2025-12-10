// src/components/QrTemplateGrid.tsx

import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useCallback, useState } from 'react';

import { Checkbox } from 'react-native-paper';
import { useHighContrastTextColors } from '../../../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../../../context/ThemeContext';
import { useSelection } from '../../../context/SelectionContext';

type QrTemplateKeyType = 'item' | 'mfgdt' | 'expdt';

export type QrTemplateRow = {
    id: string;
    readKey: string;
    value: string;
    format: string;
    required: boolean;
    keyType: QrTemplateKeyType;
};

type Props = {
    initialRows?: QrTemplateRow[];
    onChangeRows?: (rows: QrTemplateRow[]) => void;
};

// options cho Key Type
const KEY_TYPE_OPTIONS: { id: QrTemplateKeyType; label: string }[] = [
    { id: 'item', label: 'Item' },
    { id: 'mfgdt', label: 'Mfg.dt' },
    { id: 'expdt', label: 'Exp.dt' },
];

const getKeyTypeLabel = (id: QrTemplateKeyType): string => {
    return KEY_TYPE_OPTIONS.find(opt => opt.id === id)?.label ?? id;
};

const ROW_HORIZONTAL_PADDING = 8;
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
    COL_WIDTH.keyType +
    ROW_HORIZONTAL_PADDING * 2;

// Read Key cố định như bạn nói
const DEFAULT_ROWS: QrTemplateRow[] = [
    {
        id: 'supplierName',
        readKey: 'Supplier Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'item',
    },
    {
        id: 'factoryName',
        readKey: 'Factory Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'item',
    },
    {
        id: 'partNo',
        readKey: 'Part No.',
        value: '',
        format: 'string',
        required: true,
        keyType: 'item',
    },
    {
        id: 'chemicalName',
        readKey: 'Chemical Name',
        value: '',
        format: 'string',
        required: true,
        keyType: 'item',
    },
    {
        id: 'batchLotNo',
        readKey: 'Batch/Lot No.',
        value: '',
        format: 'string',
        required: true,
        keyType: 'item',
    },
    {
        id: 'prodDate',
        readKey: 'Production Date',
        value: '',
        format: 'date',
        required: false,
        keyType: 'mfgdt',
    },
    {
        id: 'expDate',
        readKey: 'Expiry Date',
        value: '',
        format: 'date',
        required: false,
        keyType: 'expdt',
    },
    {
        id: 'capacity',
        readKey: 'Capacity',
        value: '',
        format: 'number',
        required: false,
        keyType: 'item',
    },
    {
        id: 'unit',
        readKey: 'Unit',
        value: '',
        format: 'string',
        required: false,
        keyType: 'item',
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

    const handlePressKeyType = (id: string, current: QrTemplateKeyType) => {
        openSelection({
            title: 'Key Type',
            subtitle: 'Chọn loại key cho dòng này',
            variant: 'dialog',
            mode: 'single',
            items: KEY_TYPE_OPTIONS.map(opt => ({
                id: opt.id,
                label: opt.label,
            })),
            initialSelectedIds: [current],
            confirmLabel: 'OK',
            cancelLabel: 'Hủy',
            onConfirm: selectedIds => {
                const nextId =
                    (selectedIds[0] as QrTemplateKeyType | undefined) ?? current;
                updateRows(prev =>
                    prev.map(r =>
                        r.id === id ? { ...r, keyType: nextId } : r,
                    ),
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
            <Text
                style={[
                    styles.cellText,
                    {
                        width: COL_WIDTH.value,
                        color: item.value ? primaryText : secondaryText,
                    },
                ]}
                numberOfLines={1}
            >
                {item.value || '-'}
            </Text>

            {/* Key Type */}
            <TouchableOpacity
                style={[
                    styles.pillCell,
                    {
                        width: COL_WIDTH.keyType,
                        borderColor:
                            theme.colors.outlineVariant ?? theme.colors.outline,
                        backgroundColor:
                            theme.colors.surfaceVariant ?? theme.colors.surface,
                    },
                ]}
                activeOpacity={0.7}
                onPress={() => handlePressKeyType(item.id, item.keyType)}
            >
                <Text
                    style={[
                        styles.pillText,
                        { color: primaryText },
                    ]}
                    numberOfLines={1}
                >
                    {getKeyTypeLabel(item.keyType)}
                </Text>
            </TouchableOpacity>

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
            <View
                style={{
                    width: COL_WIDTH.required,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Checkbox
                    status={item.required ? 'checked' : 'unchecked'}
                    onPress={() =>
                        updateRows(prev =>
                            prev.map(r =>
                                r.id === item.id ? { ...r, required: !r.required } : r,
                            ),
                        )
                    }
                    color={theme.colors.primary}
                />
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, marginTop: 16 }}>
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
                keyboardShouldPersistTaps="handled"
                style={{
                    flex: 1,
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
                                { width: COL_WIDTH.keyType, color: primaryText },
                            ]}
                            numberOfLines={1}
                        >
                            Key Type
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
                    </View>

                    {/* Rows – FlatList cuộn dọc */}
                    <FlatList
                        data={rows}
                        keyExtractor={item => item.id}
                        renderItem={renderRow}
                        keyboardShouldPersistTaps="handled"
                        style={{ flex: 1 }}
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
        paddingHorizontal: ROW_HORIZONTAL_PADDING,
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
    pillCell: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 999,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
    },
    // valueInput: {
    //     borderWidth: 1,
    //     borderRadius: 6,
    //     paddingHorizontal: 6,
    //     paddingVertical: 4,
    //     fontSize: 12,
    // },
    // requiredCell: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     paddingVertical: 2,
    // },
});
