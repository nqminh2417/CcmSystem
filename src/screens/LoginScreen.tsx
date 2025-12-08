import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { RootStackParamList, Routes } from '../navigation/routes';

import Icon from '@react-native-vector-icons/fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAppVersionInfo } from '../utils/appInfo';
import logo from '../assets/images/logo-ism.png';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Login>;

export function LoginScreen({ navigation }: Props) {
    const { displayShort } = getAppVersionInfo();

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        navigation.replace(Routes.Home);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-100"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View className="flex-1 px-6 pt-10 pb-3">
                {/* Logo + title */}
                <View className="items-center mt-4 mb-8">
                    <Image source={logo} className="w-24 h-24 mb-3" resizeMode="contain" />
                    <Text className="text-lg font-bold text-slate-900">
                        Chemical Consumption
                    </Text>
                    <Text className="text-base font-semibold text-emerald-700">
                        Management
                    </Text>
                </View>

                {/* Form */}
                <View className="flex-1 gap-4">
                    {/* Username */}
                    <View className="flex-row items-center rounded-xl border border-slate-300 bg-white px-3">
                        <Icon name="user-o" size={22} color="#0f766e" />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#9ca3af"
                            className="flex-1 px-2 py-3 text-base text-slate-900"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View className="flex-row items-center rounded-xl border border-slate-300 bg-white px-3">
                        <Icon name="lock" size={22} color="#0f766e" />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#9ca3af"
                            className="flex-1 px-2 py-3 text-base text-slate-900"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                            <Icon
                                name={showPassword ? 'eye-slash' : 'eye'}
                                size={22}
                                color="#0f766e"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="mt-6 items-center justify-center rounded-xl bg-emerald-700 py-3"
                        onPress={handleLogin}
                    >
                        <Text className="text-base font-semibold text-white">
                            Đăng nhập
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Version */}
                <View className="items-center mt-4">
                    <Text className="text-xs text-slate-400">{displayShort}</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
