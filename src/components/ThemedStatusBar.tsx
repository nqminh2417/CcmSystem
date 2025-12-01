import { Platform, StatusBar } from 'react-native';

import React from 'react';
import { usePaperAppTheme } from '../context/ThemeContext';

export const ThemedStatusBar: React.FC = () => {
    const theme = usePaperAppTheme();
    const isDark = theme.dark;
    const headerColor = theme.colors.headerBg;

    return (
        <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={headerColor}
            translucent={false}
        />
    );
};
