import axios from 'axios';
export const api = axios.create({
    baseURL: '/api',
    timeout: 60000,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((res) => {
    const body = res.data;
    if (body && typeof body === 'object' && 'ok' in body) {
        if (!body.ok) {
            const data = body.data || {};
            const err = new Error(data.message || body.message || '请求失败');
            err.code = data.error || body.error;
            return Promise.reject(err);
        }
        if ('data' in body) {
            res.data = body.data;
        }
    }
    return res;
}, (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return Promise.reject(err);
});
export function unwrap(res) {
    const body = res.data;
    if (body && typeof body === 'object' && 'ok' in body) {
        if (!body.ok) {
            const err = new Error(body.message || '请求失败');
            err.code = body.error;
            throw err;
        }
        return body.data;
    }
    return body;
}
export function extractError(err) {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.message)
            return data.message;
        return err.message || '请求失败';
    }
    if (err instanceof Error)
        return err.message;
    return String(err);
}
