// src/components/HeaderInfoBar.tsx

import { Text, View } from 'react-native';

import React from 'react';
import { usePaperAppTheme } from '../../context/ThemeContext';
import { useSessionContext } from '../../context/SessionContext';

export const HeaderInfoBar: React.FC = () => {
    const { userName, warehouseCode, plantCode, teamCode } = useSessionContext();
    const theme = usePaperAppTheme();

    const headerTextColor = theme.colors.headerText;

    return (
        <View className=" items-end">
            <Text
                className="text-[10px] font-medium"
                style={{ color: headerTextColor }}
                numberOfLines={1}
            >
                {warehouseCode} · {plantCode} · {teamCode}
            </Text>
            <Text
                className="text-[10px] font-medium"
                style={{ color: headerTextColor }}
                numberOfLines={1}
            >
                {userName}
            </Text>
        </View>
    );
};
