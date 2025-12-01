import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Button,
    Dialog,
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
    type GestureResponderEvent,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DIALOG_WIDTH = Math.min(SCREEN_WIDTH * 0.86, 360);
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.45;

// vùng message: mặc định ~3 dòng, tối đa ~8 dòng
const MESSAGE_LINE_HEIGHT = 20;     // 20px một dòng là khá dễ đọc
const MESSAGE_MIN_LINES = 3;        // tối thiểu 3 dòng
const MESSAGE_MAX_LINES = 8;        // tối đa 8 dòng trước khi phải cuộn

type DialogType = 'info' | 'error' | 'success' | 'confirm' | 'bottomSheet';

type DialogBaseOptions = {
    title?: string;
    message?: string;
    autoCloseMs?: number; // auto close sau X ms (optional)
    titleAlign?: 'left' | 'center';
};

type ConfirmOptions = DialogBaseOptions & {
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
};

type DialogInternal = DialogBaseOptions & {
    id: number;
    type: DialogType;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
};

type DialogContextValue = {
    showInfo: (opts: DialogBaseOptions) => void;
    showError: (opts: DialogBaseOptions) => void;
    showSuccess: (opts: DialogBaseOptions) => void;
    showConfirm: (opts: ConfirmOptions) => void;
    showBottomSheet: (opts: DialogBaseOptions) => void;
    hideCurrent: () => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [queue, setQueue] = useState<DialogInternal[]>([]);
    const theme = useTheme();
    const current = queue[0] ?? null;

    const pushDialog = useCallback((dialog: Omit<DialogInternal, 'id'>) => {
        setQueue(prev => [
            ...prev,
            { ...dialog, id: Date.now() + Math.random() },
        ]);
    }, []);

    const popDialog = useCallback(() => {
        setQueue(prev => prev.slice(1));
    }, []);

    // Auto-close: khi current có autoCloseMs
    useEffect(() => {
        if (!current || !current.autoCloseMs) return;

        const timer = setTimeout(() => {
            if (current.onConfirm) {
                current.onConfirm();
            }
            popDialog();
        }, current.autoCloseMs);

        return () => clearTimeout(timer);
    }, [current?.id, current?.autoCloseMs, popDialog]);

    const hideCurrent = useCallback(() => {
        if (!current) return;
        if (current.onCancel) {
            current.onCancel();
        }
        popDialog();
    }, [current, popDialog]);

    const handleConfirm = useCallback(
        async (e?: GestureResponderEvent) => {
            if (!current) return;
            const fn = current.onConfirm;
            popDialog();
            if (fn) {
                await fn();
            }
        },
        [current, popDialog],
    );

    // API cho toàn app
    const showInfo = (opts: DialogBaseOptions) =>
        pushDialog({
            type: 'info',
            title: opts.title ?? 'Thông báo',
            message: opts.message,
            autoCloseMs: opts.autoCloseMs,
            titleAlign: opts.titleAlign,
        });

    const showError = (opts: DialogBaseOptions) =>
        pushDialog({
            type: 'error',
            title: opts.title ?? 'Lỗi',
            message: opts.message,
            autoCloseMs: opts.autoCloseMs,
            titleAlign: opts.titleAlign,
        });

    const showSuccess = (opts: DialogBaseOptions) =>
        pushDialog({
            type: 'success',
            title: opts.title ?? 'Thành công',
            message: opts.message,
            autoCloseMs: opts.autoCloseMs,
            titleAlign: opts.titleAlign,
        });

    const showConfirm = (opts: ConfirmOptions) =>
        pushDialog({
            type: 'confirm',
            title: opts.title ?? 'Xác nhận',
            message: opts.message,
            titleAlign: opts.titleAlign,
            onConfirm: opts.onConfirm,
            onCancel: opts.onCancel,
        });

    const showBottomSheet = (opts: DialogBaseOptions) =>
        pushDialog({
            type: 'bottomSheet',
            title: opts.title,
            message: opts.message,
            autoCloseMs: opts.autoCloseMs,
            titleAlign: opts.titleAlign,
        });

    const value = useMemo<DialogContextValue>(
        () => ({
            showInfo,
            showError,
            showSuccess,
            showConfirm,
            showBottomSheet,
            hideCurrent,
        }),
        [showInfo, showError, showSuccess, showConfirm, showBottomSheet, hideCurrent],
    );

    // Render UI cho dialog hiện tại + bottom sheet
    const isBottomSheet = current?.type === 'bottomSheet';

    const titleAlign = current?.titleAlign ?? 'left';

    return (
        <DialogContext.Provider value={value}>
            {children}

            <Portal>
                {/* Dialog “ở giữa” */}
                {current && !isBottomSheet && (
                    <Dialog
                        visible
                        onDismiss={hideCurrent}
                        style={{ width: DIALOG_WIDTH, alignSelf: 'center', borderRadius: 12, }}
                    >
                        {/* Icon theo type */}
                        {current.type === 'success' && (
                            <Dialog.Icon icon="check-circle" color={theme.colors.primary} />
                        )}
                        {current.type === 'error' && (
                            <Dialog.Icon icon="alert-circle" color={theme.colors.error} />
                        )}
                        {current.type === 'info' && (
                            <Dialog.Icon icon="information" color={theme.colors.primary} />
                        )}
                        {current.type === 'confirm' && (
                            <Dialog.Icon icon="help-circle" color={theme.colors.primary} />
                        )}

                        {current.title && (
                            <Dialog.Title style={[{ fontSize: 24, fontWeight: '700' }, titleAlign === 'center' && { textAlign: 'center' },]}>{current.title}</Dialog.Title>
                        )}

                        {current.message && (
                            <Dialog.Content style={{ paddingBottom: 0 }}>
                                <ScrollView
                                    // max: khoảng 8 dòng rồi bắt đầu cuộn
                                    style={{
                                        maxHeight: MESSAGE_LINE_HEIGHT * MESSAGE_MAX_LINES,
                                    }}
                                    contentContainerStyle={{
                                        // min: luôn đủ cao cho 3 dòng, kể cả message ngắn
                                        minHeight: MESSAGE_LINE_HEIGHT * MESSAGE_MIN_LINES,
                                        justifyContent: 'flex-start',  // hoặc bỏ hẳn, default là flex-start
                                        alignItems: 'flex-start',      // đảm bảo dính góc trên bên trái
                                    }}
                                    showsVerticalScrollIndicator={true}
                                >
                                    <Text variant="bodyMedium" style={{ lineHeight: MESSAGE_LINE_HEIGHT }}>
                                        {current.message}
                                    </Text>
                                </ScrollView>
                                {/* <Text variant="bodyMedium">{current.message}</Text> */}
                            </Dialog.Content>
                        )}

                        <Dialog.Actions style={{
                            marginTop: 4,
                            paddingBottom: 12,
                        }}>
                            {current.type === 'confirm' ? (
                                <>
                                    <Button onPress={hideCurrent}>Huỷ</Button>
                                    <Button onPress={handleConfirm}>Đồng ý</Button>
                                </>
                            ) : (
                                <Button onPress={hideCurrent}>OK</Button>
                            )}
                        </Dialog.Actions>
                    </Dialog>
                )}

                {/* Bottom Sheet đơn giản */}
                {current && isBottomSheet && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                        {/* bấm bên ngoài để đóng */}
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={hideCurrent}
                        />
                        <View pointerEvents="box-none" style={styles.sheetWrapper}>
                            <Surface style={[styles.sheetSurface, { maxHeight: SHEET_MAX_HEIGHT }]} elevation={4}>
                                {current.title && (
                                    <Text variant="bodyMedium"
                                        style={[
                                            styles.sheetTitle,
                                            { color: theme.colors.onSurface },
                                        ]}
                                    >
                                        {current.title}
                                    </Text>
                                )}
                                {current.message && (
                                    <ScrollView
                                        style={styles.sheetMessageScroll}
                                        contentContainerStyle={styles.sheetMessageContent}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        <Text variant="bodyMedium"
                                            style={[
                                                styles.sheetMessageText,
                                                { color: theme.colors.onSurfaceVariant },
                                            ]}
                                        >
                                            {current.message}
                                        </Text>
                                    </ScrollView>
                                )}

                                <View style={styles.sheetActions}>
                                    <Button onPress={hideCurrent}>OK</Button>
                                </View>
                            </Surface>
                        </View>
                    </View>
                )}
            </Portal>
        </DialogContext.Provider >
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
    },
    sheetTitle: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
        marginBottom: 2,
        paddingBottom: 8,
    },
    sheetMessageScroll: {
        marginBottom: 8,
        flexShrink: 1,
    },
    sheetMessageContent: {
        paddingBottom: 4,
    },
    sheetMessageText: {
        fontSize: 14,
        lineHeight: 20,   // 3 dòng ≈ 60px
    },
    sheetActions: {
        // marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

// Hook dùng trong screens
export const useDialog = () => {
    const ctx = useContext(DialogContext);
    if (!ctx) {
        throw new Error('useDialog must be used within DialogProvider');
    }
    return ctx;
};
