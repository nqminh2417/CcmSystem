// src/components/header/MainAppBar.tsx

import { Appbar, List, Portal, Surface } from 'react-native-paper';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
    const {
        userName,
        warehouseCode,
        plantCode,
        teamCode,
        setWarehouseCode,
        resetSession,
    } = useSessionContext();
    const theme = usePaperAppTheme();
    const { showInfo } = useDialog();
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

    const handleGoSettings = () => {
        closeMenu();
        if (route.name === Routes.Settings) return;
        navigation.navigate(Routes.Settings as never);
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
            variant: 'dialog',
            initialSelectedIds: warehouseCode ? [warehouseCode] : [],
            confirmLabel: 'Chọn',
            cancelLabel: 'Huỷ',
            onConfirm: selectedIds => {
                const selectedId = selectedIds[0];
                if (!selectedId) return;

                setWarehouseCode(selectedId);

                closeMenu();

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

        resetSession();

        navigation.reset({
            index: 0,
            routes: [{ name: Routes.Login as never }],
        });
    };

    const title = options.title ?? route.name;
    const showBack = !!back && route.name !== Routes.Home;
    const isHome = route.name === Routes.Home;

    const shortName =
        userName && userName.trim().length > 0
            ? userName.trim().split(' ').slice(-1)[0]
            : 'Nguyễn Thị Thanh Tuyền';

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
                    titleStyle={{
                        color: headerTextColor,
                        fontWeight: '700',
                        fontSize: 17,
                    }}
                />

                <Appbar.Action
                    icon="account-details"
                    size={26}
                    color={headerTextColor}
                    onPress={openMenu}
                />

                {!isHome && (
                    <Appbar.Action
                        icon="home"
                        size={24}
                        color={headerTextColor}
                        onPress={handleGoHome}
                    />
                )}
            </Appbar.Header>

            <Portal>
                {menuVisible && (
                    <View
                        style={StyleSheet.absoluteFill}
                        pointerEvents="box-none"
                    >
                        {/* overlay tối nhẹ + bấm ngoài để đóng */}
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={closeMenu}
                        />

                        <View
                            pointerEvents="box-none"
                            style={styles.menuWrapper}
                        >
                            <Surface
                                style={[
                                    styles.accountCard,
                                    { backgroundColor: theme.colors.surface },
                                ]}
                                elevation={4}
                            >
                                {/* Header user */}
                                <View style={styles.accountHeaderRow}>
                                    <View
                                        style={[
                                            styles.avatarCircle,
                                            {
                                                backgroundColor: theme.colors.primaryContainer,
                                                marginLeft: 6,
                                            },
                                        ]}
                                    >
                                        <List.Icon
                                            icon="account"
                                            color={theme.colors.primary}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <List.Subheader
                                            style={[
                                                styles.userName,
                                                {
                                                    color: theme.colors.onSurface,
                                                },
                                            ]}
                                        >
                                            {shortName}
                                        </List.Subheader>
                                        {/* <Text
                                            style={{
                                                fontSize: 11,
                                                color: theme.colors
                                                    .onSurfaceVariant,
                                            }}
                                        >
                                            {warehouseCode
                                                ? `Warehouse: ${warehouseCode}`
                                                : 'Chưa chọn warehouse'}
                                        </Text> */}
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.divider,
                                        {
                                            backgroundColor: theme.colors.outlineVariant,
                                        },
                                    ]}
                                />

                                {/* Thông tin hiện tại */}
                                <View style={styles.section}>
                                    <List.Item
                                        title={
                                            warehouseCode
                                                ? `Warehouse: ${warehouseCode}`
                                                : 'Chọn warehouse'
                                        }
                                        description="Kho làm việc"
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="warehouse"
                                            />
                                        )}
                                        onPress={handleSelectWarehouse}
                                        style={styles.menuItem}
                                        titleStyle={styles.menuTitle}
                                        descriptionStyle={
                                            styles.menuDescription
                                        }
                                    />
                                    <List.Item
                                        title={
                                            plantCode
                                                ? `Factory: ${plantCode}`
                                                : 'Factory: -'
                                        }
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="factory"
                                            />
                                        )}
                                        style={styles.menuItem}
                                        titleStyle={styles.menuTitle}
                                    />
                                    <List.Item
                                        title={
                                            teamCode
                                                ? `Team: ${teamCode}`
                                                : 'Team: -'
                                        }
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="account-group"
                                            />
                                        )}
                                        style={styles.menuItem}
                                        titleStyle={styles.menuTitle}
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.divider,
                                        {
                                            backgroundColor: theme.colors.outlineVariant,
                                        },
                                    ]}
                                />

                                {/* Điều hướng cài đặt / đăng xuất */}
                                <View style={styles.section}>
                                    <List.Item
                                        title="Cài đặt"
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="cog-outline"
                                            />
                                        )}
                                        onPress={handleGoSettings}
                                        style={styles.menuItem}
                                        titleStyle={styles.menuTitle}
                                    />
                                    <List.Item
                                        title="Đăng xuất"
                                        left={props => (
                                            <List.Icon
                                                {...props}
                                                icon="logout"
                                                color={theme.colors.error}
                                            />
                                        )}
                                        onPress={handleLogout}
                                        style={styles.menuItem}
                                        titleStyle={[
                                            styles.menuTitle,
                                            { color: theme.colors.error },
                                        ]}
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
        right: 12,
    },
    accountCard: {
        minWidth: 230,
        borderRadius: 8,
        overflow: 'hidden',
        paddingHorizontal: 2,
        paddingVertical: 8,
    },
    accountHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 2,
        paddingLeft: 0,
        paddingRight: 0,
        paddingVertical: 0,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: 4,
    },
    section: {
        paddingVertical: 2,
    },
    menuItem: {
        paddingVertical: 2,
        minHeight: 36,
    },
    menuTitle: {
        fontSize: 13,
    },
    menuDescription: {
        fontSize: 11,
    },
});
