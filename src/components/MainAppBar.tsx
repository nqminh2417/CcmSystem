import { Appbar, useTheme } from 'react-native-paper';

import { Image } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Routes } from '../navigation/routes';

type AppBarConfig = {
    showMenuLeft?: boolean;
    showSearch?: boolean;
    showBell?: boolean;
};

// Cấu hình AppBar cho từng màn hình
const APPBAR_CONFIG: Record<string, AppBarConfig> = {
    [Routes.Home]: {
        // Home chỉ có 1 nút Menu (bên trái), không có action nào bên phải
        showMenuLeft: true,
        showSearch: true
    },
    // Các màn khác nếu không khai thì sẽ dùng config rỗng
};

export function MainAppBar({ navigation, route, options, back }: NativeStackHeaderProps) {
    const theme = useTheme();
    const config = APPBAR_CONFIG[route.name] ?? {};

    const title =
        options.title ??
        (route.name === Routes.Home ? 'Trang chủ' : route.name);

    const handleMenu = () => {
        // TODO: open drawer, menu, profile...
        console.log('Menu pressed');
    };

    const handleSearch = () => {
        // TODO: mở màn search, hoặc show search bar
        console.log('Search pressed');
    };

    const handleBell = () => {
        // TODO: navigate tới màn thông báo
        console.log('Notifications pressed');
    };

    return (
        <Appbar.Header
            statusBarHeight={0}
            mode="center-aligned"
            elevated
            style={{ backgroundColor: theme.colors.primary }}
        >
            {/* Bên trái: ưu tiên nút back, nếu không có back thì mới xét menuLeft */}
            {back ? (
                <Appbar.BackAction onPress={navigation.goBack} color="#fff" />
            ) : config.showMenuLeft ? (
                <Appbar.Action icon="camera" onPress={handleMenu} color="#fff" />
            ) : null}

            <Appbar.Content
                title={title}
                titleStyle={{ color: '#fff', fontWeight: '700' }}
            />

            {/* Bên phải: các Appbar.Action tùy màn */}
            {config.showSearch && (
                <Appbar.Action icon="magnify" onPress={handleSearch} color="#fff" />
            )}

            {config.showBell && (
                <Appbar.Action icon="bell-outline" onPress={handleBell} color="#fff" />
            )}
        </Appbar.Header>
    );
}
