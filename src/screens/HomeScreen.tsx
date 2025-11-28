import { Text, View } from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';
import { usePaperAppTheme } from '../context/ThemeContext';

export function HomeScreen() {
    const theme = usePaperAppTheme();
    const { primaryText, secondaryText } = useHighContrastTextColors();

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={['top', 'right', 'left', 'bottom']}
        >
            <View className="flex-1 items-center justify-center px-4">
                <Text
                    className="text-xl font-extrabold"
                    style={{ color: primaryText }}
                >
                    Hello NativeWind v4
                </Text>

                <Text
                    className="mt-3 text-base text-center"
                    style={{ color: secondaryText }}
                >
                    Đây là màn hình Home. Chữ đã tăng độ tương phản cho dễ đọc.
                </Text>
            </View>
        </SafeAreaView>
    );
}
