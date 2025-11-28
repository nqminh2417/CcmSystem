// src/components/HeaderInfoBar.tsx

import { Text, View } from 'react-native';

import React from 'react';
import { useSessionContext } from '../context/SessionContext';

export const HeaderInfoBar: React.FC = () => {
    const { userName, warehouseCode, plantCode, teamCode } = useSessionContext();

    return (
        <View className="flex-row items-center mr-1">
            <View className="mr-2">
                <Text className="text-[10px] text-emerald-100">
                    {warehouseCode} · {plantCode}
                </Text>
                <Text className="text-[10px] text-emerald-100" numberOfLines={1}>
                    {teamCode} · {userName}
                </Text>
            </View>
        </View>
    );
};
