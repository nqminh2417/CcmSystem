import { Appbar, List, Portal, Surface } from 'react-native-paper';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Routes } from '../../navigation/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../assets/images/logo-ism.png';
import { useDialog } from '../../context/DialogContext';
import { usePaperAppTheme } from '../../context/ThemeContext';
import { useSelection } from '../../context/SelectionContext';
import { useSessionContext } from '../../context/SessionContext';

const APPBAR_HEIGHT = 52;
const MENU_TOP_OFFSET = 55;

export function MainAppBar({
    navigation,
    route,
    options,
    back,
}: NativeStackHeaderProps) {
    const { userName, warehouseCode, plantCode, teamCode, setWarehouseCode, } = useSessionContext();
    const theme = usePaperAppTheme();
    const {
        showInfo,
    } = useDialog();
    const { openSelection } = useSelection();
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

    const handleSelectWarehouse = () => {
        openSelection({
            title: 'Chọn warehouse',
            subtitle: 'Vui lòng chọn kho làm việc',
            items: [
                { id: 'H100', label: 'H100', subLabel: 'Kho H100 (fake data)' },
                { id: 'R200', label: 'R200', subLabel: 'Kho R200 (fake data)' },
            ],
            mode: 'single',
            variant: 'dialog',          // hoặc 'bottomSheet' tuỳ bạn thích
            initialSelectedIds: warehouseCode ? [warehouseCode] : [],
            confirmLabel: 'Chọn',
            cancelLabel: 'Huỷ',
            onConfirm: (selectedIds) => {
                const selectedId = selectedIds[0];
                if (!selectedId) return;

                // lưu tạm vào SessionContext (sau này thay bằng API + MMKV)
                setWarehouseCode(selectedId);

                // đóng cái account-card nếu bạn muốn
                closeMenu?.();

                // show info 2s tự tắt
                showInfo({
                    title: 'Thông báo',
                    message: `Đã chọn warehouse: ${selectedId}`,
                    autoCloseMs: 2000,
                });
            },
        });
    };

    const handleLogout = () => {
        closeMenu();
        navigation.reset({
            index: 0,
            routes: [{ name: Routes.Login as never }],
        });
    };

    const title = options.title ?? route.name;
    const showBack = !!back && route.name !== Routes.Home;
    const isHome = route.name === Routes.Home;

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
                            ? 'rgba(248, 250, 252, 0.24)'
                            : 'rgba(15, 23, 42, 0.24)',
                    },
                ]}
            >
                {showBack && (
                    <Appbar.BackAction
                        onPress={navigation.goBack}
                        color={headerTextColor}
                    />
                )}

                {!showBack && (
                    <Image
                        source={logo}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                        resizeMode="contain"
                    />
                )}

                <Appbar.Content
                    title={title}
                    titleStyle={{ color: headerTextColor, fontWeight: '700' }}
                />

                <Appbar.Action
                    icon='account-details'
                    size={28}
                    color={headerTextColor}
                    onPress={openMenu}
                />

                {!isHome && (
                    <Appbar.Action
                        icon="home"
                        size={28}
                        color={headerTextColor}
                        onPress={handleGoHome}
                    />
                )}
            </Appbar.Header>


            <Portal>
                {menuVisible && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        {/* bấm ra ngoài để đóng */}
                        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

                        <View pointerEvents="box-none" style={styles.menuWrapper}>
                            <Surface style={styles.accountCard} elevation={4}>
                                <Appbar.Content
                                    title={userName}
                                    titleStyle={{ fontWeight: '700', fontSize: 16 }}
                                    style={{ marginBottom: 12 }}
                                />

                                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)', height: 1 }} />

                                <View style={{}}>
                                    <List.Item
                                        title={`Warehouse: ${warehouseCode}`}
                                        left={() => <List.Icon icon="warehouse" />}
                                        onPress={handleSelectWarehouse}
                                    />
                                    <List.Item
                                        title={`Factory: ${plantCode}`}
                                        left={() => <List.Icon icon="factory" />}
                                    />
                                    <List.Item
                                        title={`Team: ${teamCode}`}
                                        left={() => <List.Icon icon="account-group" />}
                                    />
                                </View>

                                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)', height: 1 }} />

                                <View style={{ marginTop: 8 }}>
                                    <List.Item
                                        title="Đăng xuất"
                                        left={() => <List.Icon icon="logout" />}
                                        onPress={handleLogout}
                                    />
                                </View>
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
    accountCard: {
        minWidth: 220,
        borderRadius: 8,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});
