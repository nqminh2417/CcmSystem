import {
    List,
    Switch,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import { useAppTheme } from '../context/ThemeContext';
import { useHighContrastTextColors } from '../hooks/useHighContrastTextColors';

export function SettingsScreen() {
    const { primaryText, secondaryText } = useHighContrastTextColors();
    const { isDark, toggleTheme } = useAppTheme();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                <List.Subheader>Giao diện</List.Subheader>

                <TouchableRipple onPress={toggleTheme}>
                    <View style={styles.row}>
                        <Text style={{ color: primaryText }}>
                            Chế độ nền tối
                        </Text>
                        <View pointerEvents="none">
                            <Switch value={isDark} onValueChange={toggleTheme} />
                        </View>
                    </View>
                </TouchableRipple>
            </List.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    row: {
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
