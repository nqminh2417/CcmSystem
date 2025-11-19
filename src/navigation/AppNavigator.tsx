import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Khai báo type cho các màn hình trong stack
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false, // ẩn header mặc định, tùy bạn
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}
