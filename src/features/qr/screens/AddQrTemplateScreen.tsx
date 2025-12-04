// src/screens/AddQrTemplateScreen.tsx

import { Button, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import { QrTemplateGrid } from '../components/QrTemplateGrid';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaperAppTheme } from '../../../context/ThemeContext';
import { useRoute } from '@react-navigation/native';

// Nếu bạn có RootStackParamList thì type cho chuẩn;
// ở đây để any cho đỡ vướng TS, bạn có thể chỉnh lại sau.
type AddQrTemplateRouteParams = {
    poCode: string;
};

export function AddQrTemplateScreen() {
    const theme = usePaperAppTheme();
    const route = useRoute<any>();
    const poCode = (route.params as AddQrTemplateRouteParams)?.poCode ?? '';

    const handleSaveTemplate = () => {
        // TODO: sau này gọi API + lưu mmkv
        // Tạm thời log hoặc show dialog
        console.log('Saving QR template for PO: ', poCode);
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['right', 'left', 'bottom']}
        >
            <View style={styles.container}>
                {/* PO Code block */}
                <View style={styles.poBlock}>
                    <Text style={styles.label}>PO Code</Text>
                    <TextInput
                        mode="outlined"
                        value={poCode}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    poBlock: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    poInput: {
        height: 44,
    },
    gridWrapper: {
        flex: 1,
        marginBottom: 16,
    },
    saveButton: {
        alignSelf: 'flex-end', // hoặc 'stretch' nếu muốn full width
    },
});
