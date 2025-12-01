import React, { createContext, useContext, useMemo, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import {
    DarkTheme as NavDark,
    DefaultTheme as NavLight,
    Theme,
} from '@react-navigation/native';
import { lightTheme, darkTheme, type AppTheme } from '../theme/appTheme';

type AppThemeContextValue = {
    isDark: boolean;
    toggleTheme: () => void;
    paperTheme: AppTheme;
    navTheme: Theme;
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const paperTheme = useMemo<AppTheme>(
        () => (isDark ? darkTheme : lightTheme),
        [isDark],
    );

    const navTheme = useMemo<Theme>(
        () =>
            isDark
                ? {
                    ...NavDark,
                    colors: {
                        ...NavDark.colors,
                        background: paperTheme.colors.background,
                        card: paperTheme.colors.headerBg,
                    },
                }
                : {
                    ...NavLight,
                    colors: {
                        ...NavLight.colors,
                        background: paperTheme.colors.background,
                        card: paperTheme.colors.headerBg,
                    },
                },
        [isDark, paperTheme],
    );

    const toggleTheme = () => setIsDark(prev => !prev);

    const value: AppThemeContextValue = {
        isDark,
        toggleTheme,
        paperTheme,
        navTheme,
    };

    return (
        <AppThemeContext.Provider value={value}>
            <PaperProvider theme={paperTheme}>{children}</PaperProvider>
        </AppThemeContext.Provider>
    );
};

export const useAppTheme = () => {
    const ctx = useContext(AppThemeContext);
    if (!ctx) {
        throw new Error('useAppTheme must be used within ThemeProvider');
    }
    return ctx;
};

import { useTheme as usePaperTheme } from 'react-native-paper';

export const usePaperAppTheme = () => usePaperTheme<AppTheme>();
