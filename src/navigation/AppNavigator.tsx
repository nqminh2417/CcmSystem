// src/navigation/AppNavigator.tsx
// https://reactnavigation.org/docs/getting-started

import { NativeStackHeaderProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from './routes';

import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MainAppBar } from '../components/header/MainAppBar';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ReceiveGoodsScreen } from '../screens/ReceiveGoodsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppHeader = (props: NativeStackHeaderProps) => (<MainAppBar {...props} />);

export default function AppNavigator() {
    const { navTheme } = useAppTheme();

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator
                initialRouteName={Routes.Login}
                screenOptions={{
                    header: AppHeader,
                    animation: 'none',
                }}
            >
                <Stack.Screen name={Routes.Login} component={LoginScreen} options={{ headerShown: false, }} />
                <Stack.Screen name={Routes.Home} component={HomeScreen} options={{ title: 'Trang chủ' }} />
                <Stack.Screen name={Routes.Settings} component={SettingsScreen} options={{ title: 'Settings' }} />
                <Stack.Screen name={Routes.ReceiveGoods} component={ReceiveGoodsScreen} options={{ title: 'Nhận hàng' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
