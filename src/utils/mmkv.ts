// src/utils/mmkv.ts
// https://github.com/mrousavy/react-native-mmkv

import { createMMKV } from 'react-native-mmkv';

// Chỉ dùng 1 storage duy nhất cho toàn app
const storage = createMMKV({ id: 'app' });

// Khóa dùng trong app (đặt hết ở đây cho dễ kiểm soát)
const APP_KEYS = {
    warehouseCode: 'warehouseCode',
    vibrationEnabled: 'settings_vibration_enabled',
    // sau này cần thêm key khác thì bổ sung ở đây
} as const;

// Helper chung để dùng trong toàn app
export const storageUtils = {
    // Expose ra nếu chỗ nào cần dùng trực tiếp storage (ít thôi)
    raw: storage,

    // --- Warehouse code ---
    getWarehouseCode(): string | null {
        const value = storage.getString(APP_KEYS.warehouseCode);
        return value ?? null;
    },

    setWarehouseCode(code: string) {
        if (!code) {
            storage.remove(APP_KEYS.warehouseCode);
            return;
        }
        storage.set(APP_KEYS.warehouseCode, code);
    },

    clearWarehouseCode() {
        storage.remove(APP_KEYS.warehouseCode);
    },

    // --- Vibration setting ---
    getVibrationEnabled(): boolean {
        const v = storage.getBoolean(APP_KEYS.vibrationEnabled);
        // mặc định: nếu chưa lưu gì thì coi như bật
        return v === undefined ? true : !!v;
    },

    setVibrationEnabled(enabled: boolean) {
        storage.set(APP_KEYS.vibrationEnabled, enabled);
    },

    // --- Clear toàn bộ app storage (dùng khi logout) ---
    clearAll() {
        storage.clearAll();
    },
};
