import { Appbar, List, Portal, Surface, useTheme, } from 'react-native-paper';
import { Image, Pressable, StyleSheet, View, } from 'react-native';

import { HeaderInfoBar } from './HeaderInfoBar';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Routes } from '../navigation/routes';
import logo from '../assets/images/logo-ism.png';

const APPBAR_HEIGHT = 56; // chiều cao Appbar.Header mặc định

export function MainAppBar({
    navigation,
    route,
    options,
    back,
}: NativeStackHeaderProps) {
    const theme = useTheme();
    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleGoHome = () => {
        closeMenu();
        if (route.name === Routes.Home) return;
        navigation.navigate(Routes.Home as never);
    };

    const handleLogout = () => {
        closeMenu();
        // TODO: clear mmkv/token nếu cần
        navigation.reset({
            index: 0,
            routes: [{ name: Routes.Login as never }],
        });
    };

    const title = options.title ?? route.name;
    const showBack = !!back; // có back param là có nút back

    return (
        <>
            <Appbar.Header
                statusBarHeight={0}
                mode="small"
                elevated
                style={{ backgroundColor: theme.colors.primary }}
            >
                {showBack && (
                    <Appbar.BackAction
                        onPress={navigation.goBack}
                        color="#fff"
                    />
                )}

                <Image
                    source={logo}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    resizeMode="contain"
                />

                {/* Giữa: title màn hình */}
                <Appbar.Content
                    title={title}
                    titleStyle={{ color: '#fff', fontWeight: '700' }}
                />

                {/* Phải: info nhỏ + nút menu */}
                <HeaderInfoBar />

                <Appbar.Action
                    icon="dots-vertical"
                    size={28}
                    color="#fff"
                    onPress={openMenu}
                />
            </Appbar.Header>

            {/* Menu custom vẽ bằng Portal + Surface */}
            <Portal>
                {menuVisible && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        {/* layer che toàn màn – bấm ra ngoài để đóng */}
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={closeMenu}
                        />

                        {/* hộp menu ở góc phải dưới AppBar */}
                        <View
                            pointerEvents="box-none"
                            style={styles.menuWrapper}
                        >
                            <Surface style={styles.menuSurface} elevation={4}>
                                <List.Item
                                    title="Trang chủ"
                                    onPress={handleGoHome}
                                />
                                <List.Item
                                    title="Đăng xuất"
                                    onPress={handleLogout}
                                />
                            </Surface>
                        </View>
                    </View>
                )}
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    menuWrapper: {
        position: 'absolute',
        top: APPBAR_HEIGHT, // ngay dưới AppBar
        right: 8,
    },
    menuSurface: {
        minWidth: 150,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
