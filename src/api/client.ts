// src/api/client.ts

import { APP_KEYS, storageUtils } from '../utils/mmkv';

import Config from 'react-native-config';

const FALLBACK_BASE_URL = Config.API_BASE_URL ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchError extends Error {
    status?: number;
    data?: unknown;
}

/**
 * Hàm lõi gọi API.
 * - Base URL ưu tiên lấy từ MMKV (serverBaseUrl), nếu không có thì dùng API_BASE_URL trong .env
 * - Với method có body (POST/PUT/PATCH/DELETE) sẽ tự gắn USRID, FAC_CD, VERSION vào body
 */
async function request<TRes = unknown>(
    path: string,
    method: HttpMethod,
    body?: Record<string, any>,
    headers?: Record<string, string>,
): Promise<TRes> {
    // Lấy baseUrl từ MMKV trước
    const storedBaseUrl = storageUtils.getServerBaseUrl() ?? '';
    const baseUrl = storedBaseUrl.length > 0 ? storedBaseUrl : FALLBACK_BASE_URL;

    if (!baseUrl) {
        console.warn(
            '[fetchWrapper] No base URL configured. Set serverBaseUrl in MMKV or API_BASE_URL in .env.',
        );
    }

    const isBodyMethod = method !== 'GET' && method !== 'DELETE';

    const finalBody = isBodyMethod
        ? {
            ...(body ?? {}),
            USRID: storageUtils.raw.getString(APP_KEYS.userId) ?? '',
            FAC_CD: storageUtils.raw.getString(APP_KEYS.facCd) ?? '',
            VERSION: storageUtils.raw.getString(APP_KEYS.currentVersion) ?? '',
        }
        : undefined;

    const defaultHeaders: Record<string, string> = {
        Accept: 'application/json',
    };

    if (finalBody !== undefined) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const finalHeaders: Record<string, string> = {
        ...defaultHeaders,
        ...(headers ?? {}),
    };

    const response = await fetch(baseUrl + path, {
        method,
        headers: finalHeaders,
        body: finalBody !== undefined ? JSON.stringify(finalBody) : undefined,
    });

    const text = await response.text();
    let data: any = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            // Response không phải JSON, giữ nguyên text
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            (data && (data.message || data.error)) ||
            `Request failed with status ${response.status}`;

        const error: FetchError = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    if (!text) {
        // Ví dụ 204 No Content
        return undefined as TRes;
    }

    return data as TRes;
}

/**
 * fetchWrapper: dùng trong app
 * - fetchWrapper.get('/path')
 * - fetchWrapper.post('/path', body)
 */
export const fetchWrapper = {
    get<TRes = unknown>(path: string, headers?: Record<string, string>) {
        return request<TRes>(path, 'GET', undefined, headers);
    },

    post<TRes = unknown>(
        path: string,
        body?: Record<string, any>,
        headers?: Record<string, string>,
    ) {
        return request<TRes>(path, 'POST', body, headers);
    },

    put<TRes = unknown>(
        path: string,
        body?: Record<string, any>,
        headers?: Record<string, string>,
    ) {
        return request<TRes>(path, 'PUT', body, headers);
    },

    patch<TRes = unknown>(
        path: string,
        body?: Record<string, any>,
        headers?: Record<string, string>,
    ) {
        return request<TRes>(path, 'PATCH', body, headers);
    },

    delete<TRes = unknown>(
        path: string,
        body?: Record<string, any>,
        headers?: Record<string, string>,
    ) {
        return request<TRes>(path, 'DELETE', body, headers);
    },
};

export default fetchWrapper;
