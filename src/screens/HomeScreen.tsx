// src/screens/HomeScreen.tsx

import { StyleSheet, Text } from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
    return (
        <SafeAreaView
            style={styles.container}
            // AppBar đang dùng header của React Navigation ở trên,
            // nên ở đây mình chỉ cần safe area cho 3 cạnh dưới / trái / phải
            edges={['left', 'right', 'bottom']}
        >
            <Text style={styles.title}>Home Screen</Text>
            <Text>Chào mừng bạn đã login thành công 👋</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', marginVertical: 16 },
});
