// src/screens/ReceiveGoodsScreen.tsx

import React from 'react';
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';

import { Routes, type RootStackParamList } from '../navigation/routes';
import { usePaperAppTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ReceiveGoods'>;

type PoItem = {
    poNo: string;
    itemName?: string | null;
    itemCode?: string | null;
    supplierName?: string | null;
};

// Demo data – sau này thay bằng data từ API
const MOCK_POS: PoItem[] = [
    { poNo: '4500515618', itemName: 'PR-415 (HCV)', itemCode: 'EB04026447', supplierName: 'CTY TNHH HWASEUNG CHEMICAL VIET NAM', },
    { poNo: '2200000205', itemName: 'FLUORESCENT VIOLETISH-631', itemCode: 'EB04025018', supplierName: 'CTY TNHH SEUNGJI', },
    { poNo: '4500516992', itemName: 'KEO CHUP CAO 3D One Pot (LEO XL3D)', itemCode: 'EB04026301', supplierName: 'CTY TNHH PTCN IN HOANG NGUYEN', },
];

// width cho từng cột – header & row dùng CHUNG
const COL_WIDTH = {
    poNo: 100,
    itemName: 180,
    itemCode: 100,
    supplierName: 240,
};

const TABLE_WIDTH = COL_WIDTH.poNo + COL_WIDTH.itemName + COL_WIDTH.itemCode + COL_WIDTH.supplierName;

export const ReceiveGoodsScreen: React.FC<Props> = ({ navigation }) => {
    const theme = usePaperAppTheme();

    const [keyword, setKeyword] = React.useState('');
    const [data, setData] = React.useState<PoItem[]>([]);
    const [selectedPoNo, setSelectedPoNo] = React.useState<string | null>(null);

    const handleSearch = () => {
        const kw = keyword.trim();
        if (!kw) {
            setData([]);
            setSelectedPoNo(null);
            return;
        }

        // TODO: sau này gọi API BE với kw (PO No hoặc text quét được)
        // Ví dụ:
        // const res = await api.searchPo({ keyword: kw });
        // setData(res.items);

        // Hiện tại: fake API bằng cách filter MOCK_POS theo PO No chứa kw
        const lower = kw.toLowerCase();
        const results = MOCK_POS.filter(item =>
            item.poNo.toLowerCase().includes(lower),
        );

        setData(results);
        setSelectedPoNo(null);
    };

    const handleGoScan = () => {
        if (!selectedPoNo) return;
        navigation.navigate(Routes.ScanQrReceive, { poNo: selectedPoNo });
    };

    const renderRow = ({ item }: { item: PoItem }) => {
        const selected = item.poNo === selectedPoNo;

        return (
            <TouchableOpacity
                onPress={() => setSelectedPoNo(item.poNo)}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.row,
                        {
                            backgroundColor: selected
                                ? theme.colors.secondaryContainer
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
                            { width: COL_WIDTH.poNo, color: theme.colors.onSurface },
                        ]}
                        numberOfLines={1}
                    >
                        {item.poNo}
                    </Text>
                    <Text
                        style={[
                            styles.cellText,
                            { width: COL_WIDTH.supplierName, color: theme.colors.onSurfaceVariant },
                        ]}
                        numberOfLines={2}
                    >
                        {item.supplierName ?? ''}
                    </Text>
                    <Text
                        style={[
                            styles.cellText,
                            { width: COL_WIDTH.itemCode, color: theme.colors.onSurfaceVariant },
                        ]}
                        numberOfLines={1}
                    >
                        {item.itemCode ?? ''}
                    </Text>
                    <Text
                        style={[
                            styles.cellText,
                            { width: COL_WIDTH.itemName, color: theme.colors.onSurfaceVariant },
                        ]}
                        numberOfLines={2}
                    >
                        {item.itemName ?? ''}
                    </Text>
                </View>
            </TouchableOpacity>
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
                    {/* Scroll ngang khi bảng rộng, FlatList cuộn dọc khi nhiều dòng */}
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
                        {/* Header + rows nằm chung trong width = TABLE_WIDTH */}
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
                                        { width: COL_WIDTH.poNo, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    PO No.
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        {
                                            width: COL_WIDTH.supplierName,
                                            color: theme.colors.onSurface,
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Supplier Name
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.itemCode, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Item Code
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { width: COL_WIDTH.itemName, color: theme.colors.onSurface },
                                    ]}
                                    numberOfLines={1}
                                >
                                    Item Name
                                </Text>
                            </View>

                            {/* Danh sách kết quả – cuộn dọc */}
                            <FlatList
                                data={data}
                                keyExtractor={item => item.poNo}
                                renderItem={renderRow}
                                style={{}}
                                contentContainerStyle={{}}
                                ListEmptyComponent={
                                    <View style={styles.emptyWrapper}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: theme.colors.onSurfaceVariant,
                                            }}
                                        >
                                            Chưa có dữ liệu. Nhập từ khóa và bấm "Tìm".
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    </ScrollView>
                </View>

                {/* Nút Scan QR Code */}
                <Button
                    mode="contained"
                    onPress={handleGoScan}
                    disabled={!selectedPoNo}
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
        fontSize: 16,
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
        paddingVertical: 8,
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
    emptyWrapper: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        alignSelf: 'flex-end', // đổi thành 'stretch' nếu muốn full width
    },
});
