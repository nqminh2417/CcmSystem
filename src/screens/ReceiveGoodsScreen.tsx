// src/screens/ReceiveGoodsScreen.tsx

import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';

type PoRow = {
    poNumber: string;
    col2: string;
    col3: string;
};

export function ReceiveGoodsScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { showInfo } = useDialog();

    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<PoRow[]>([]);

    const handleScanQr = () => {
        // TODO: mở flow scan QR thực tế
        showInfo({
            title: 'QR code',
            message: 'Chức năng quét QR sẽ được tích hợp sau.',
            autoCloseMs: 2000,
        });
    };

    const handleSearch = async () => {
        const q = keyword.trim();
        if (!q) {
            showInfo({
                title: 'Thông báo',
                message: 'Vui lòng nhập hoặc quét mã trước khi tìm.',
            });
            return;
        }

        Keyboard.dismiss();
        setLoading(true);

        try {
            // TODO: sau này gọi BE với q và setResults(response)
            // Tạm thời dùng dữ liệu giả demo
            const all: PoRow[] = [
                { poNumber: 'PO123456', col2: 'Cột 2 demo A', col3: 'Cột 3 demo A' },
                { poNumber: 'PO234567', col2: 'Cột 2 demo B', col3: 'Cột 3 demo B' },
                { poNumber: 'PO345678', col2: 'Cột 2 demo C', col3: 'Cột 3 demo C' },
            ];

            const filtered = all.filter(row =>
                row.poNumber.toLowerCase().includes(q.toLowerCase()),
            );

            setResults(filtered);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
                {/* Tiêu đề nhỏ của màn Nhận hàng */}
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: primaryText,
                        marginBottom: 12,
                    }}
                >
                    Nhập mã PO
                </Text>

                {/* Ô nhập + nút QR */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                    }}
                >
                    <TextInput
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholder="Nhập / quét mã PO hoặc mã QR"
                        placeholderTextColor={theme.colors.outline}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: theme.colors.outline,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            color: primaryText,
                        }}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />

                    <TouchableOpacity
                        onPress={handleScanQr}
                        activeOpacity={0.8}
                        style={{
                            marginLeft: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderRadius: 8,
                            backgroundColor:
                                theme.colors.secondaryContainer ?? theme.colors.surface,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '600',
                                color:
                                    theme.colors.onSecondaryContainer ?? theme.colors.primary,
                            }}
                        >
                            QR
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nút tìm kiếm */}
                <TouchableOpacity
                    onPress={handleSearch}
                    activeOpacity={0.85}
                    style={{
                        marginTop: 4,
                        marginBottom: 12,
                        borderRadius: 999,
                        backgroundColor: theme.colors.primary,
                        paddingVertical: 10,
                        alignItems: 'center',
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.onPrimary} />
                    ) : (
                        <Text
                            style={{
                                color: theme.colors.onPrimary,
                                fontWeight: '700',
                                fontSize: 15,
                            }}
                        >
                            Tìm kiếm PO
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Khu vực bảng data – tạm render list đơn giản */}
                <View style={{ flex: 1, marginTop: 8 }}>
                    {results.length === 0 && !loading ? (
                        <Text style={{ color: secondaryText }}>
                            Chưa có dữ liệu. Nhập hoặc quét mã rồi bấm &quot;Tìm kiếm PO&quot;.
                        </Text>
                    ) : (
                        <View>
                            {/* Header bảng (3 cột) */}
                            <View
                                style={[
                                    styles.row,
                                    {
                                        borderBottomWidth: 1,
                                        borderBottomColor:
                                            theme.colors.outlineVariant ??
                                            theme.colors.outline,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { color: primaryText },
                                    ]}
                                >
                                    PO
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { color: primaryText },
                                    ]}
                                >
                                    Cột 2
                                </Text>
                                <Text
                                    style={[
                                        styles.headerCell,
                                        { color: primaryText },
                                    ]}
                                >
                                    Cột 3
                                </Text>
                            </View>

                            {/* Dòng dữ liệu – sau này thay bằng component bảng riêng */}
                            {results.map(row => (
                                <View
                                    key={row.poNumber}
                                    style={[
                                        styles.row,
                                        {
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomColor:
                                                theme.colors.outlineVariant ??
                                                theme.colors.outline,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.cell,
                                            { color: primaryText },
                                        ]}
                                    >
                                        {row.poNumber}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cell,
                                            { color: secondaryText },
                                        ]}
                                    >
                                        {row.col2}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cell,
                                            { color: secondaryText },
                                        ]}
                                    >
                                        {row.col3}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    headerCell: {
        flex: 1,
        fontWeight: '700',
        fontSize: 13,
    },
    cell: {
        flex: 1,
        fontSize: 13,
    },
});
