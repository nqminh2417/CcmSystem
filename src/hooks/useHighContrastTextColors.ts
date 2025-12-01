// src/hooks/useHighContrastTextColors.ts

import { usePaperAppTheme } from '../context/ThemeContext';

export const useHighContrastTextColors = () => {
    const theme = usePaperAppTheme();

    return {
        primaryText: theme.colors.onBackground,      // dùng cho text chính
        secondaryText: theme.colors.onSurfaceVariant // dùng cho text phụ/mô tả
    };
};
