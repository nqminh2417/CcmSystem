// src/utils/mmkv.ts
// https://github.com/mrousavy/react-native-mmkv

import { createMMKV } from 'react-native-mmkv';

/**
 * Tạo 2 kho:
 * - appStorage: config/app settings (ip server, version, fac_cd,…)
 * - userStorage: thông tin user (token, profile,…)
 */

const appStorage = createMMKV({ id: 'app' });
const userStorage = createMMKV({ id: 'user' });

// Nếu sau này bạn cần thêm storage riêng, có thể tạo thêm:
// const temp = createMMKV({ id: 'temp' });

export const mmkv = {
    appStorage,
    userStorage,
};

/**
 * Chỉ cần phía trên là đủ.
 * Dưới đây là ví dụ helper để thao tác với 1 số key cụ thể.
 * ✅ Thêm helper cho warehouseCode
 */

const APP_KEYS = {
    warehouseCode: 'warehouseCode',
    // sau này thêm: serverIp, language, v.v…
} as const;

export const warehouseStorage = {
    getWarehouseCode(): string | null {
        const value = appStorage.getString(APP_KEYS.warehouseCode);
        return value ?? null;
    },
    setWarehouseCode(code: string) {
        appStorage.set(APP_KEYS.warehouseCode, code);
    },
    clearWarehouseCode() {
        appStorage.remove(APP_KEYS.warehouseCode);
    },
};

// ---- Utils dùng chung cho logout, reset app, v.v. ----

export const storageUtils = {
    /** Xoá toàn bộ key trong tất cả các MMKV đã tạo ở đây */
    clearAll() {
        appStorage.clearAll();
        userStorage.clearAll();
        // nếu có thêm storage khác thì clearAll ở đây luôn
    },
};