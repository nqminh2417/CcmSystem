// src/api/client.ts

import Config from 'react-native-config';
import { mmkv } from '../utils/mmkv';

const API_BASE_URL = Config.API_BASE_URL ?? '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchErr extends Error {
    status?: number;
    data?: unknown;
}

export async function fetchWrapper<
    TRes = unknown,
    TBody extends Record<string, any> = Record<string, any>,
>(
    path: string,
    method: HttpMethod,
    body?: TBody,
    headers?: Record<string, string>,
): Promise<TRes> {
    // Ưu tiên ipserver trong mmkv, không có thì dùng env
    const baseUrl = mmkv.appStorage.getString('ipserver') || API_BASE_URL;

    // Body gốc (không mutate tham số)
    const baseBody: Record<string, any> = body ?? {};

    // Thêm các field chung vào body theo "sách vở"
    const finalBody = {
        ...baseBody,
        USRID: mmkv.appStorage.getString('user_id') ?? '',
        FAC_CD: mmkv.appStorage.getString('fac_cd') ?? '',
        VERSION: mmkv.appStorage.getString('currentVersion') ?? '',
    };

    const defaultHeaders: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const finalHeaders = {
        ...defaultHeaders,
        ...(headers ?? {}),
    };

    const res = await fetch(baseUrl + path, {
        method,
        headers: finalHeaders,
        body: JSON.stringify(finalBody),
    });

    const text = await res.text();
    let json: any = null;

    if (text) {
        try {
            json = JSON.parse(text);
        } catch {
            // Response không phải JSON thì thôi
        }
    }

    if (!res.ok) {
        const message =
            json?.message ||
            json?.error ||
            `Request failed with status ${res.status}`;

        const err: FetchErr = new Error(message);
        err.status = res.status;
        err.data = json;
        throw err;
    }

    if (!text) {
        // Ví dụ 204 No Content
        return undefined as TRes;
    }

    return json as TRes;
}

export default fetchWrapper;
