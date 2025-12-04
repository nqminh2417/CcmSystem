// src/screens/ReceiveGoodsScreen.tsx

import React from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';

import { Routes, type RootStackParamList } from '../navigation/routes';
import { usePaperAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ReceiveGoods'>;

type PoItem = {
    poCode: string;
    supplier: string;
    extra: string;
};

// Demo data – sau này thay bằng data từ API
const MOCK_POS: PoItem[] = [
    { poCode: 'PO001234', supplier: 'Nhà cung cấp A', extra: 'Cột 3 demo' },
    { poCode: 'PO001235', supplier: 'Nhà cung cấp B', extra: 'Cột 3 demo' },
    { poCode: 'PO001236', supplier: 'Nhà cung cấp C', extra: 'Cột 3 demo' },
];

// width cho từng cột – header & row dùng CHUNG
const COL_WIDTH = {
    poCode: 140,
    supplier: 220,
    extra: 180,
};

const TABLE_WIDTH = COL_WIDTH.poCode + COL_WIDTH.supplier + COL_WIDTH.extra;

export const ReceiveGoodsScreen: React.FC<Props> = ({ navigation }) => {
    const theme = usePaperAppTheme();

    const [keyword, setKeyword] = React.useState('');
    const [data, setData] = React.useState<PoItem[]>(MOCK_POS);
    const [selectedPoCode, setSelectedPoCode] = React.useState<string | null>(null);

    const handleSearch = () => {
        const kw = keyword.trim().toLowerCase();
        if (!kw) {
            setData(MOCK_POS);
            setSelectedPoCode(null);
            return;
        }

        const filtered = MOCK_POS.filter(
            item =>
                item.poCode.toLowerCase().includes(kw) ||
                item.supplier.toLowerCase().includes(kw),
        );
        setData(filtered);

        // Nếu PO đang chọn không còn trong list thì clear selection
        if (selectedPoCode && !filtered.some(x => x.poCode === selectedPoCode)) {
            setSelectedPoCode(null);
        }
    };

    const handleGoScan = () => {
        if (!selectedPoCode) return;
        navigation.navigate(Routes.ScanQrReceive, { poCode: selectedPoCode });
    };

    const renderRow = ({ item }: { item: PoItem }) => {
        const selected = item.poCode === selectedPoCode;

        return (
            <Pressable
                onPress={() => setSelectedPoCode(item.poCode)}
                android_ripple={{ color: theme.colors.surfaceVariant }}
                style={({ pressed }) => [
                    styles.row,
                    {
                        backgroundColor: selected
                            ? theme.colors.secondaryContainer
                            : pressed
                                ? theme.colors.surfaceVariant
                                : theme.colors.surface,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor:
                            theme.colors.outlineVariant ?? theme.colors.outline,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.cellText,
                        { width: COL_WIDTH.poCode, color: theme.colors.onSurface },
                    ]}
                    numberOfLines={1}
                >
                    {item.poCode}
                </Text>
                <Text
                    style={[
                        styles.cellText,
                        { width: COL_WIDTH.supplier, color: theme.colors.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                >
                    {item.supplier}
                </Text>
                <Text
                    style={[
                        styles.cellText,
                        { width: COL_WIDTH.extra, color: theme.colors.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                >
                    {item.extra}
                </Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['left', 'right', 'bottom']}
        >
            <View style={styles.container}>
                {/* Ô nhập / scan PO */}
                <Text style={[styles.label, { color: theme.colors.onBackground }]}>
                    Tìm PO
                </Text>

                <View style={styles.searchRow}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: theme.colors.outline,
                                color: theme.colors.onSurface,
                                backgroundColor: theme.colors.surface,
                            },
                        ]}
                        placeholder="Nhập vài ký tự PO hoặc text quét được."
                        placeholderTextColor={theme.colors.onSurfaceDisabled}
                        value={keyword}
                        onChangeText={setKeyword}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                    <Pressable
                        onPress={handleSearch}
                        style={[
                            styles.searchButton,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        <Text
                            style={[
                                styles.searchButtonText,
                                { color: theme.colors.onPrimary },
                            ]}
                        >
                            Tìm
                        </Text>
                    </Pressable>
                </View>

                {/* Grid PO */}
                <Text
                    style={[
                        styles.resultTitle,
                        { color: theme.colors.onBackground },
                    ]}
                >
                    Kết quả PO
                </Text>

                <View style={styles.gridWrapper}>
                    {/* Scroll ngang để cột thẳng + tràn phải thì kéo */}
                    <View
                        style={{
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor:
                                theme.colors.outlineVariant ?? theme.colors.outline,
                            borderRadius: 8,
                            overflow: 'hidden',
                            flex: 1,
                        }}
                    >
                        {/* Header + FlatList cùng nằm trong View width = TABLE_WIDTH */}
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
                                        { width: COL_WIDTH.poCode, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    PONO
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.supplier, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Supplier
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.extra, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Thông tin khác
                                </Text>
                            </View>

                            {/* FlatList rows – cuộn dọc, cột dùng chung COL_WIDTH với header */}
                            <FlatList
                                data={data}
                                keyExtractor={item => item.poCode}
                                renderItem={renderRow}
                                style={{}}
                                contentContainerStyle={{}}
                            />
                        </View>
                    </View>
                </View>

                {/* Nút Scan QR Code */}
                <Button
                    mode="contained"
                    onPress={handleGoScan}
                    disabled={!selectedPoCode}
                    style={styles.scanButton}
                >
                    Scan QR Code
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
    },
    searchButton: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 4,
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
    scanButton: {
        alignSelf: 'flex-end', // đổi thành 'stretch' nếu muốn full width
    },
});
