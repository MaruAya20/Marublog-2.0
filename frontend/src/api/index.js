import { api, extractError } from './client';
export const postApi = {
    list: async (params) => {
        const res = await api.get('/posts', { params });
        return res.data;
    },
    getBySlug: async (slug) => {
        const res = await api.get(`/posts/${slug}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/posts', data);
        return res.data;
    },
    update: async (slug, data) => {
        const res = await api.patch(`/posts/${slug}`, data);
        return res.data;
    },
    remove: async (slug) => {
        const res = await api.delete(`/posts/${slug}`);
        return res.data;
    },
    toggleLike: async (slug) => {
        const res = await api.post(`/posts/${slug}/like`);
        return res.data;
    },
    toggleFavorite: async (slug) => {
        const res = await api.post(`/posts/${slug}/favorite`);
        return res.data;
    },
    drafts: async () => {
        const res = await api.get('/posts/drafts');
        return res.data;
    }
};
export const commentApi = {
    list: async (postId) => {
        const res = await api.get('/comments', { params: { postId } });
        return res.data;
    },
    tree: async (postId) => {
        const res = await api.get('/comments/tree', { params: { postId } });
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/comments', data);
        return res.data;
    },
    remove: async (id) => {
        const res = await api.delete(`/comments/${id}`);
        return res.data;
    },
};
export const tagApi = {
    list: async () => {
        const res = await api.get('/tags');
        return res.data;
    },
};
export const siteApi = {
    get: async () => {
        const res = await api.get('/site');
        return res.data;
    },
};
export const trackApi = {
    view: async (data) => {
        await api.post('/track/view', data).catch(() => { });
    }
};
export const levelsApi = {
    list: async () => {
        const res = await api.get('/levels');
        return res.data;
    },
};
export const uploadApi = {
    upload: async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload', fd);
        return res.data;
    },
    delete: async (url) => {
        const res = await api.delete('/upload', { params: { url } });
        return res.data;
    },
};
export const notificationApi = {
    async list(type) {
        const res = await api.get('/notifications', { params: type ? { type } : undefined });
        return res.data;
    },
    async unread() {
        const res = await api.get('/notifications/unread');
        return res.data;
    },
    async markRead(id) {
        const res = await api.post(`/notifications/${id}/read`);
        return res.data;
    },
    async markAllRead() {
        const res = await api.post('/notifications/read-all');
        return res.data;
    },
};
export const preferenceApi = {
    get: async () => {
        const res = await api.get('/me/preference');
        return res.data;
    },
    update: async (data) => {
        const res = await api.patch('/me/preference', data);
        return res.data;
    },
};
export { extractError };