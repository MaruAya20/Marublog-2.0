import { api, unwrap, extractError } from './client';
export const postApi = {
    list: async (params) => {
        const res = await api.get('/posts', { params });
        return unwrap(res);
    },
    getBySlug: async (slug) => {
        const res = await api.get(`/posts/${slug}`);
        return unwrap(res);
    },
    create: async (data) => {
        const res = await api.post('/posts', data);
        return unwrap(res);
    },
    update: async (slug, data) => {
        const res = await api.patch(`/posts/${slug}`, data);
        return unwrap(res);
    },
    remove: async (slug) => {
        const res = await api.delete(`/posts/${slug}`);
        return unwrap(res);
    },
    toggleLike: async (slug) => {
        const res = await api.post(`/posts/${slug}/like`);
        return unwrap(res);
    },
    toggleFavorite: async (slug) => {
        const res = await api.post(`/posts/${slug}/favorite`);
        return unwrap(res);
    },
    drafts: async () => {
        const res = await api.get('/posts/drafts');
        return unwrap(res);
    }
};
export const commentApi = {
    list: async (postId) => {
        const res = await api.get('/comments', { params: { postId } });
        return unwrap(res);
    },
    tree: async (postId) => {
        const res = await api.get('/comments/tree', { params: { postId } });
        return unwrap(res);
    },
    create: async (data) => {
        const res = await api.post('/comments', data);
        return unwrap(res);
    },
    remove: async (id) => {
        const res = await api.delete(`/comments/${id}`);
        return unwrap(res);
    },
};
export const tagApi = {
    list: async () => {
        const res = await api.get('/tags');
        return unwrap(res);
    },
};
export const siteApi = {
    get: async () => {
        const res = await api.get('/site');
        return unwrap(res);
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
        return unwrap(res);
    },
};
export const uploadApi = {
    upload: async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload', fd);
        return unwrap(res);
    },
    delete: async (url) => {
        const res = await api.delete('/upload', { params: { url } });
        return unwrap(res);
    },
};
export const notificationApi = {
    async list(type) {
        const res = await api.get('/notifications', { params: type ? { type } : undefined });
        return unwrap(res);
    },
    async unread() {
        const res = await api.get('/notifications/unread');
        return unwrap(res);
    },
    async markRead(id) {
        const res = await api.post(`/notifications/${id}/read`);
        return unwrap(res);
    },
    async markAllRead() {
        const res = await api.post('/notifications/read-all');
        return unwrap(res);
    },
};
export const preferenceApi = {
    get: async () => {
        const res = await api.get('/me/preference');
        return unwrap(res);
    },
    update: async (data) => {
        const res = await api.patch('/me/preference', data);
        return unwrap(res);
    },
};
export const adminApi = {
    status: async () => {
        const res = await api.get('/admin/status');
        return unwrap(res);
    },
    stats: async () => {
        const res = await api.get('/admin/stats');
        return unwrap(res);
    },
    listUsers: async (params) => {
        const res = await api.get('/admin/users', { params });
        return unwrap(res);
    },
    listBans: async (params) => {
        const res = await api.get('/admin/bans', { params });
        return unwrap(res);
    },
    listLogs: async (params) => {
        const res = await api.get('/admin/logs', { params });
        return unwrap(res);
    },
    banUser: async (data) => {
        const res = await api.post('/admin/ban-user', data);
        return unwrap(res);
    },
    unbanUser: async (data) => {
        const res = await api.post('/admin/unban-user', data);
        return unwrap(res);
    },
    promote: async (data) => {
        const res = await api.post('/admin/promote', data);
        return unwrap(res);
    }
};
export { extractError };
export const aiApi = {
    getPersona: async () => {
        const res = await api.get('/ai/persona');
        return unwrap(res);
    },
    listPersonas: async () => {
        const res = await api.get('/ai/personas');
        return unwrap(res);
    },
    updatePersona: async (data) => {
        const res = await api.put('/ai/admin/persona', data);
        return unwrap(res);
    },
    createPersona: async (data) => {
        const res = await api.post('/ai/admin/persona', data);
        return unwrap(res);
    },
    setDefaultPersona: async (id) => {
        const res = await api.post('/ai/admin/persona/' + id + '/set-default');
        return unwrap(res);
    },
    deletePersona: async (id) => {
        const res = await api.delete('/ai/admin/persona/' + id);
        return unwrap(res);
    },
    chat: async (data) => {
        const res = await api.post('/ai/chat', data);
        return unwrap(res);
    },
    reindexAll: async () => {
        const res = await api.post('/ai/admin/reindex');
        return unwrap(res);
    },
    reindexOne: async (postId) => {
        const res = await api.post('/ai/admin/reindex/' + postId);
        return unwrap(res);
    },
    ragStats: async () => {
        const res = await api.get('/ai/admin/stats');
        return unwrap(res);
    }
};
export { unwrap } from './client';
