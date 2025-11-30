import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import { SelectionBottomSheet } from '../components/selection/SelectionBottomSheet';
import { SelectionDialog } from '../components/selection/SelectionDialog';

export type SelectionItem = {
    id: string;
    label: string;
    subLabel?: string;
};

export type SelectionMode = 'single' | 'multiple';
export type SelectionVariant = 'dialog' | 'bottomSheet';

export type SelectionConfig = {
    title?: string;
    subtitle?: string;
    items: SelectionItem[];

    mode?: SelectionMode;           // default: 'single'
    variant?: SelectionVariant;     // default: 'dialog'

    initialSelectedIds?: string[];  // default: []

    confirmLabel?: string;          // default: 'OK'
    cancelLabel?: string;           // default: 'Cancel'

    // Nhận kết quả đã chọn
    onConfirm?: (selectedIds: string[]) => void | Promise<void>;
    onCancel?: () => void;
};

type InternalState = {
    visible: boolean;
    title?: string;
    subtitle?: string;
    items: SelectionItem[];
    mode: SelectionMode;
    variant: SelectionVariant;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm?: (selectedIds: string[]) => void | Promise<void>;
    onCancel?: () => void;
};

type SelectionContextValue = {
    openSelection: (config: SelectionConfig) => void;
    closeSelection: () => void;
};

const SelectionContext = createContext<SelectionContextValue | undefined>(
    undefined,
);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, setState] = useState<InternalState | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const closeSelection = useCallback(() => {
        setState(prev => {
            if (prev && prev.onCancel) {
                prev.onCancel();
            }
            return null;
        });
        setSelectedIds([]);
    }, []);

    const handleConfirm = useCallback(async () => {
        setState(prev => {
            if (prev && prev.onConfirm) {
                prev.onConfirm(selectedIds);
            }
            return null;
        });
        setSelectedIds([]);
    }, [selectedIds]);

    const openSelection = useCallback((config: SelectionConfig) => {
        const {
            title,
            subtitle,
            items,
            mode = 'single',
            variant = 'dialog',
            confirmLabel = 'OK',
            cancelLabel = 'Cancel',
            initialSelectedIds,
            onConfirm,
            onCancel,
        } = config;

        const initial =
            initialSelectedIds && initialSelectedIds.length > 0
                ? initialSelectedIds
                : [];

        setSelectedIds(initial);
        setState({
            visible: true,
            title,
            subtitle,
            items,
            mode,
            variant,
            confirmLabel,
            cancelLabel,
            onConfirm,
            onCancel,
        });
    }, []);

    const toggleItem = useCallback(
        (id: string) => {
            if (!state) return;

            setSelectedIds(prev => {
                if (state.mode === 'single') {
                    // chọn 1: luôn chỉ giữ 1 id
                    if (prev[0] === id) return prev; // giữ nguyên nếu chọn lại cùng item
                    return [id];
                }

                // multiple: toggle
                if (prev.includes(id)) {
                    return prev.filter(itemId => itemId !== id);
                }
                return [...prev, id];
            });
        },
        [state],
    );

    const ctxValue = useMemo<SelectionContextValue>(
        () => ({
            openSelection,
            closeSelection,
        }),
        [openSelection, closeSelection],
    );

    const visible = !!state?.visible;

    return (
        <SelectionContext.Provider value={ctxValue}>
            {children}

            {/* Dialog giữa màn hình */}
            {state && state.variant === 'dialog' && (
                <SelectionDialog
                    visible={visible}
                    title={state.title}
                    subtitle={state.subtitle}
                    items={state.items}
                    mode={state.mode}
                    selectedIds={selectedIds}
                    onToggleItem={toggleItem}
                    onConfirm={handleConfirm}
                    onCancel={closeSelection}
                    confirmLabel={state.confirmLabel}
                    cancelLabel={state.cancelLabel}
                />
            )}

            {/* Bottom sheet */}
            {state && state.variant === 'bottomSheet' && (
                <SelectionBottomSheet
                    visible={visible}
                    title={state.title}
                    subtitle={state.subtitle}
                    items={state.items}
                    mode={state.mode}
                    selectedIds={selectedIds}
                    onToggleItem={toggleItem}
                    onConfirm={handleConfirm}
                    onCancel={closeSelection}
                    confirmLabel={state.confirmLabel}
                    cancelLabel={state.cancelLabel}
                />
            )}
        </SelectionContext.Provider>
    );
};

export const useSelection = () => {
    const ctx = useContext(SelectionContext);
    if (!ctx) {
        throw new Error('useSelection must be used within SelectionProvider');
    }
    return ctx;
};
