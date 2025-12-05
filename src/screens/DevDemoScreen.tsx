// src/screens/DevDemoScreen.tsx

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDialog } from '../context/DialogContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';

export const DevDemoScreen: React.FC = () => {
    const theme = usePaperAppTheme();
    const { primaryText } = useHighContrastTextColors();
    const { showSuccess, showError } = useDialog();

    // Demo dữ liệu kho
    const warehouseItems = React.useMemo(
        () => [
            { id: 'H100', label: 'H100', subLabel: 'Kho H100' },
            { id: 'R200', label: 'R200', subLabel: 'Kho H100' },
            { id: 'R300', label: 'R300', subLabel: 'Kho H100' },
            { id: 'R400', label: 'R400', subLabel: 'Kho R300' },
            { id: 'R500', label: 'R500', subLabel: 'Kho R300' },
            { id: 'R600', label: 'R600', subLabel: 'Kho R300' },
            { id: 'R700', label: 'R700', subLabel: 'Kho R300' },
            { id: 'R800', label: 'R800', subLabel: 'Kho R300' },
            { id: 'R900', label: 'R900', subLabel: 'Kho R300' },
            { id: 'H200', label: 'H200', subLabel: 'Kho R300' },
        ],
        [],
    );

    // const warehouseItems = React.useMemo(
    //     () => [
    //         { id: 'H100', label: 'H100', },
    //         { id: 'R200', label: 'R200', },
    //         { id: 'R300', label: 'R300', },
    //         { id: 'R400', label: 'R400', },
    //         { id: 'R500', label: 'R500', },
    //         { id: 'R700', label: 'R700', },
    //         { id: 'R800', label: 'R800', },
    //         { id: 'R900', label: 'R900', },
    //         { id: 'H200', label: 'H200', },
    //     ],
    //     [],
    // );

    const handleTestSuccess = () => {
        showSuccess({
            title: 'Thành công',
            message: 'Test success có bật âm thanh.',
            autoCloseMs: 1500,
            playSound: true,
        });
    };

    const handleTestErrorNoSound = () => {
        showError({
            title: 'Lỗi',
            message: 'Test error KHÔNG phát âm thanh.',
            autoCloseMs: 1500,
            playSound: false,
        });
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[styles.title, { color: theme.colors.primary }]}>
                    Dev Demo / Playground
                </Text>

                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                    Dialog + Sound
                </Text>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[
                            styles.demoButton,
                            { backgroundColor: theme.colors.surfaceVariant },
                        ]}
                        activeOpacity={0.85}
                        onPress={handleTestSuccess}
                    >
                        <Text
                            style={[
                                styles.demoButtonText,
                                { color: primaryText },
                            ]}
                        >
                            Test Success (có âm thanh)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.demoButton,
                            { backgroundColor: theme.colors.surfaceVariant },
                        ]}
                        activeOpacity={0.85}
                        onPress={handleTestErrorNoSound}
                    >
                        <Text
                            style={[
                                styles.demoButtonText,
                                { color: primaryText },
                            ]}
                        >
                            Test Error (không âm thanh)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sau này muốn demo thêm gì cứ add section mới phía dưới */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    buttonGroup: {
        gap: 8,
        marginBottom: 24,
    },
    demoButton: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    demoButtonText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
});
