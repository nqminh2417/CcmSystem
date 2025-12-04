// src/screens/AddQrTemplateScreen.tsx

import { Button, Text, TextInput } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { QrTemplateGrid } from '../components/QrTemplateGrid';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaperAppTheme } from '../../../context/ThemeContext';
import { useRoute } from '@react-navigation/native';

// Nếu bạn có RootStackParamList thì type cho chuẩn;
// ở đây để any cho đỡ vướng TS, bạn có thể chỉnh lại sau.
type AddQrTemplateRouteParams = {
    poNo: string;
};

export function AddQrTemplateScreen() {
    const theme = usePaperAppTheme();
    const route = useRoute<any>();
    const poNo = (route.params as AddQrTemplateRouteParams)?.poNo ?? '';

    const handleSaveTemplate = () => {
        // TODO: sau này gọi API + lưu mmkv
        // Tạm thời log hoặc show dialog
        console.log('Saving QR template for PO: ', poNo);
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['right', 'left', 'bottom']}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={styles.container}>
                    {/* PO No. */}
                    <View style={styles.poRow}>
                        <Text style={styles.label}>PO No.</Text>
                        <TextInput
                            dense
                            value={poNo}
                            editable={false}
                            selectTextOnFocus={false}
                            style={styles.poInput}
                        />
                    </View>

                    {/* Grid template */}
                    <View style={styles.gridWrapper}>
                        <QrTemplateGrid />
                    </View>

                    {/* Nút lưu */}
                    <Button
                        mode="contained"
                        onPress={handleSaveTemplate}
                        style={styles.saveButton}
                    >
                        Lưu mẫu QR
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
    gridWrapper: {
        flex: 1,
        marginBottom: 16,
    },
    saveButton: {
        alignSelf: 'flex-end', // hoặc 'stretch' nếu muốn full width
    },
});
