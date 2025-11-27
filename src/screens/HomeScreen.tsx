// src/screens/HomeScreen.tsx

import { Text, View } from 'react-native';

import React from 'react';

export function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-slate-100">
            <Text className="text-lg font-bold text-emerald-700">
                Hello NativeWind v4
            </Text>
            <Text className="mt-2 text-slate-600">
                Đây là màn hình Home dùng Tailwind.
            </Text>
        </View>
    );
}
