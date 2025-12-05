import {
    Button,
    Portal,
    Surface,
    Text,
    useTheme,
} from 'react-native-paper';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    SelectionItem,
    SelectionMode,
} from '../../context/SelectionContext';

import React from 'react';
import { SelectionListItem } from './SelectionListItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.45;

type Props = {
    visible: boolean;
    title?: string;
    subtitle?: string;
    items: SelectionItem[];
    mode: SelectionMode;
    selectedIds: string[];
    onToggleItem: (id: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel: string;
    cancelLabel?: string;
    dismissOnBackdropPress?: boolean;
};

export const SelectionBottomSheet: React.FC<Props> = ({
    visible,
    title,
    subtitle,
    items,
    mode,
    selectedIds,
    onToggleItem,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    dismissOnBackdropPress = true,
}) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <Portal>
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                {/* overlay bấm để đóng (nếu được phép) */}
                {dismissOnBackdropPress ? (
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={onCancel}
                    />
                ) : (
                    // vẫn cần một View để giữ dark overlay nếu bạn dùng,
                    // nhưng pointerEvents="none" để không nhận touch
                    <View style={StyleSheet.absoluteFill} pointerEvents="none" />
                )}

                <View pointerEvents="box-none" style={styles.sheetWrapper}>
                    <Surface
                        style={styles.sheetSurface}
                        elevation={4}
                    >
                        {title && (
                            <Text
                                style={[
                                    styles.sheetTitle,
                                    { color: theme.colors.onSurface },
                                ]}
                            >
                                {title}
                            </Text>
                        )}

                        {subtitle && (
                            <Text
                                style={[
                                    styles.sheetSubtitle,
                                    { color: theme.colors.onSurfaceVariant },
                                ]}
                            >
                                {subtitle}
                            </Text>
                        )}

                        {/* Vùng list co giãn, có chiều cao riêng để cuộn */}
                        <View style={styles.sheetListContainer}>
                            <ScrollView
                                style={styles.sheetList}
                                contentContainerStyle={styles.sheetListContent}
                                showsVerticalScrollIndicator={true}
                            >
                                {items.map(item => {
                                    const selected = selectedIds.includes(item.id);
                                    return (
                                        <SelectionListItem
                                            key={item.id}
                                            label={item.label}
                                            subLabel={item.subLabel}
                                            selected={selected}
                                            multiple={mode === 'multiple'}
                                            onPress={() => onToggleItem(item.id)}
                                        />
                                    );
                                })}

                                {items.length === 0 && (
                                    <View style={styles.emptyWrapper}>
                                        <Text style={{ color: theme.colors.onSurfaceVariant }}>
                                            Không có dữ liệu
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.actionsRow}>
                            {cancelLabel && (
                                <Button onPress={onCancel}>{cancelLabel}</Button>
                            )}
                            <Button onPress={onConfirm}>{confirmLabel}</Button>
                        </View>
                    </Surface>
                </View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    sheetWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        padding: 16,
    },
    sheetSurface: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        alignSelf: 'stretch',
        maxHeight: SHEET_MAX_HEIGHT, // sheet tối đa 45% màn hình
    },
    sheetTitle: {
        fontSize: 17,
        fontWeight: '700',
        lineHeight: 22,
        marginBottom: 4,
    },
    sheetSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    // 🔹 vùng list chiếm phần còn lại, co giãn theo nội dung
    sheetListContainer: {
        flexGrow: 1,
        flexShrink: 1,
        marginBottom: 8,
    },
    sheetList: {
        flexGrow: 0,
    },
    sheetListContent: {
        paddingBottom: 4,
    },
    emptyWrapper: {
        flex: 1,
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
