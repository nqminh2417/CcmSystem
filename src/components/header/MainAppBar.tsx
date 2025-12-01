import { Appbar, List, Portal, Surface } from 'react-native-paper';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { HeaderInfoBar } from './HeaderInfoBar';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Routes } from '../../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../assets/images/logo-ism.png';
import { usePaperAppTheme } from '../../context/ThemeContext';

const APPBAR_HEIGHT = 52; // chiều cao Appbar.Header mặc định
const MENU_TOP_OFFSET = 80;

export function MainAppBar({
    navigation,
    route,
    options,
    back,
}: NativeStackHeaderProps) {
    const theme = usePaperAppTheme();
    const headerColor = theme.colors.headerBg;
    const headerTextColor = theme.colors.headerText;

    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleGoHome = () => {
        closeMenu();
        if (route.name === Routes.Home) return;
        navigation.replace(Routes.Home);
    };

    const handleGoSettings = () => {
        closeMenu();
        navigation.replace(Routes.Settings);
    };

    const handleLogout = () => {
        closeMenu();
        navigation.reset({
            index: 0,
            routes: [{ name: Routes.Login as never }],
        });
    };

    const title = options.title ?? route.name;
    const showBack = !!back;

    return (
        <SafeAreaView
            edges={['top']}
            style={{ backgroundColor: headerColor }}
        >
            <Appbar.Header
                statusBarHeight={0}
                mode="small"
                elevated={false}
                style={[
                    {
                        backgroundColor: headerColor,
                        height: APPBAR_HEIGHT,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.dark
                            ? 'rgba(248, 250, 252, 0.24)' // sáng nhẹ trên nền tối
                            : 'rgba(15, 23, 42, 0.24)',   // tối nhẹ trên nền sáng
                    },
                ]}
            >
                {showBack && (
                    <Appbar.BackAction
                        onPress={navigation.goBack}
                        color={headerTextColor}
                    />
                )}

                <Image
                    source={logo}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    resizeMode="contain"
                />

                <Appbar.Content
                    title={title}
                    titleStyle={{ color: headerTextColor, fontWeight: '700' }}
                />

                <HeaderInfoBar />

                <Appbar.Action
                    icon="dots-vertical"
                    size={28}
                    color={headerTextColor}
                    onPress={openMenu}
                />
            </Appbar.Header>

            <Portal>
                {menuVisible && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
                        <View pointerEvents="box-none" style={styles.menuWrapper}>
                            <Surface style={styles.menuSurface} elevation={4}>
                                <List.Item title="Trang chủ" onPress={handleGoHome} />
                                <List.Item title="Settings" onPress={handleGoSettings} />
                                <List.Item title="Đăng xuất" onPress={handleLogout} />
                            </Surface>
                        </View>
                    </View>
                )}
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    menuWrapper: {
        position: 'absolute',
        top: MENU_TOP_OFFSET,
        right: 22,
    },
    menuSurface: {
        minWidth: 140,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
