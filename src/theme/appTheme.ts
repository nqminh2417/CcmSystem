// src/theme/appTheme.ts
import {
    MD3LightTheme,
    MD3DarkTheme,
    type MD3Theme,
} from 'react-native-paper';

export type AppTheme = MD3Theme & {
    colors: MD3Theme['colors'] & {
        headerBg: string;
        headerText: string;
    };
};

const baseLight = MD3LightTheme;
const baseDark = MD3DarkTheme;

export const lightTheme: AppTheme = {
    ...baseLight,
    colors: {
        ...baseLight.colors,
        background: '#f9fafb',   // SafeAreaView nền sáng
        headerBg: '#e0f2fe',     // header lạnh
        headerText: '#020617',   // text header gần đen

        // chữ rõ trong light
        onBackground: '#020617',
        onSurface: '#020617',
        onSurfaceVariant: '#111827',
    },
};

export const darkTheme: AppTheme = {
    ...baseDark,
    colors: {
        ...baseDark.colors,
        background: '#020617',   // SafeAreaView nền tối
        headerBg: '#0f172a',     // header tối khác nền
        headerText: '#38bdf8',   // neon lạnh cho header

        // chữ rõ trong dark
        onBackground: '#f9fafb',
        onSurface: '#f9fafb',
        onSurfaceVariant: '#e5e7eb',
    },
};
