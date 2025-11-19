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
