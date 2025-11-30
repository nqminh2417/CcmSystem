import {
    Button,
    Dialog,
    Portal,
    Text,
    useTheme,
} from 'react-native-paper';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import {
    SelectionItem,
    SelectionMode,
} from '../../context/SelectionContext';

import React from 'react';
import { SelectionListItem } from './SelectionListItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DIALOG_WIDTH = Math.min(SCREEN_WIDTH * 0.86, 360);

// vùng list: min khoảng 3 dòng, tối đa vài dòng rồi cuộn
const ITEM_HEIGHT = 48
const LIST_MIN_ITEMS = 3;
const LIST_MAX_HEIGHT = ITEM_HEIGHT * 8;

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
    cancelLabel: string;
};

export const SelectionDialog: React.FC<Props> = ({
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
}) => {
    const theme = useTheme();

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onCancel}
                style={{
                    width: DIALOG_WIDTH,
                    alignSelf: 'center',
                    borderRadius: 12,
                }}
            >
                <Dialog.Content style={{ paddingBottom: 0 }}>
                    {title && (
                        <Text
                            style={[
                                styles.dialogTitle,
                                { color: theme.colors.onSurface },
                            ]}
                        >
                            {title}
                        </Text>
                    )}

                    {subtitle && (
                        <Text
                            style={[
                                styles.dialogSubtitle,
                                { color: theme.colors.onSurfaceVariant },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}

                    <ScrollView
                        style={{ maxHeight: LIST_MAX_HEIGHT }}
                        contentContainerStyle={{
                            minHeight: ITEM_HEIGHT * LIST_MIN_ITEMS,
                        }}
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
                </Dialog.Content>

                <Dialog.Actions
                    style={{
                        marginTop: 4,
                        paddingHorizontal: 16,
                        paddingBottom: 8,
                    }}
                >
                    <Button onPress={onCancel}>{cancelLabel}</Button>
                    <Button onPress={onConfirm}>{confirmLabel}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    emptyWrapper: {
        flex: 1,
        minHeight: ITEM_HEIGHT * 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogTitle: {
        fontSize: 17,
        fontWeight: '700',
        lineHeight: 22,
        marginBottom: 4,
    },
    dialogSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
});
