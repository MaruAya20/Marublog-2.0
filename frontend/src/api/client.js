import axios from 'axios';
export const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((res) => res, (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return Promise.reject(err);
});
export function extractError(err) {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.message)
            return data.message;
        return err.message || '请求失败';
    }
    return String(err);
}
