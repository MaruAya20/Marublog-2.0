import { api, unwrap, extractError } from './client'
import type { Post, Comment, TagDef, SiteSettings, PostListResponse, UserPreference } from '@/types'

export const postApi = {
  list: async (params?: { tag?: string; page?: number; pageSize?: number; q?: string; authorId?: number }) => {
    const res = await api.get<PostListResponse>('/posts', { params })
    return unwrap(res)
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<Post>(`/posts/${slug}`)
    return unwrap(res)
  },
  create: async (data: { title: string; content: string; excerpt?: string; tags?: string[]; status?: string; scheduledAt?: string }) => {
    const res = await api.post<Post>('/posts', data)
    return unwrap(res)
  },
  update: async (slug: string, data: { title?: string; content?: string; excerpt?: string; tags?: string[]; status?: string; scheduledAt?: string }) => {
    const res = await api.patch<Post>(`/posts/${slug}`, data)
    return unwrap(res)
  },
  remove: async (slug: string) => {
    const res = await api.delete(`/posts/${slug}`)
    return unwrap(res)
  },
  toggleLike: async (slug: string) => {
    const res = await api.post(`/posts/${slug}/like`)
    return unwrap(res)
  },
  toggleFavorite: async (slug: string) => {
    const res = await api.post(`/posts/${slug}/favorite`)
    return unwrap(res)
  },
  drafts: async () => {
    const res = await api.get<Post[]>('/posts/drafts')
    return unwrap(res)
  }
}

export const commentApi = {
  list: async (postId: number) => {
    const res = await api.get<Comment[]>('/comments', { params: { postId } })
    return unwrap(res)
  },
  tree: async (postId: number) => {
    const res = await api.get<any>('/comments/tree', { params: { postId } })
    return unwrap(res)
  },
  create: async (data: { postId: number; content: string; guestName?: string; parentId?: number; mentionUserId?: number }) => {
    const res = await api.post<Comment>('/comments', data)
    return unwrap(res)
  },
  remove: async (id: number) => {
    const res = await api.delete(`/comments/${id}`)
    return unwrap(res)
  },
}

export const tagApi = {
  list: async () => {
    const res = await api.get<TagDef[]>('/tags')
    return unwrap(res)
  },
}

export const siteApi = {
  get: async () => {
    const res = await api.get<SiteSettings>('/site')
    return unwrap(res)
  },
}

export const trackApi = {
  view: async (data: { route: string; slug?: string; postId?: number; tag?: string }) => {
    await api.post('/track/view', data).catch(() => {})
  }
}

export const levelsApi = {
  list: async () => {
    const res = await api.get('/levels')
    return unwrap(res)
  },
}

export const uploadApi = {
  upload: async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post<{ url: string; name: string; size: number; mime: string }>('/upload', fd)
    return unwrap(res)
  },
  delete: async (url: string) => {
    const res = await api.delete('/upload', { params: { url } })
    return unwrap(res)
  },
}

export const notificationApi = {
  async list(type?: string) {
    const res = await api.get<any>('/notifications', { params: type ? { type } : undefined })
    return unwrap(res)
  },
  async unread() {
    const res = await api.get<{ count: number }>('/notifications/unread')
    return unwrap(res)
  },
  async markRead(id: number) {
    const res = await api.post(`/notifications/${id}/read`)
    return unwrap(res)
  },
  async markAllRead() {
    const res = await api.post('/notifications/read-all')
    return unwrap(res)
  },
}

export const preferenceApi = {
  get: async () => {
    const res = await api.get<UserPreference>('/me/preference')
    return unwrap(res)
  },
  update: async (data: Partial<Omit<UserPreference, 'opacity'>> & { opacity?: number }) => {
    const res = await api.patch('/me/preference', data)
    return unwrap(res)
  },
}

export const adminApi = {
  status: async () => {
    const res = await api.get('/admin/status')
    return unwrap(res) as { isAdmin: boolean; userId: number | null; role: string | null }
  },
  stats: async () => {
    const res = await api.get('/admin/stats')
    return unwrap(res) as Record<string, number | string>
  },
  listUsers: async (params?: { keyword?: string; page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/users', { params })
    return unwrap(res)
  },
  listBans: async (params?: { page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/bans', { params })
    return unwrap(res)
  },
  listLogs: async (params?: { page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/logs', { params })
    return unwrap(res)
  },
  banUser: async (data: { userId: number; minutes: number; reason: string; opCode: string }) => {
    const res = await api.post('/admin/ban-user', data)
    return unwrap(res)
  },
  unbanUser: async (data: { userId: number; reason: string; opCode: string }) => {
    const res = await api.post('/admin/unban-user', data)
    return unwrap(res)
  },
  promote: async (data: { userId: number; opCode: string }) => {
    const res = await api.post('/admin/promote', data)
    return unwrap(res)
  }
}

export { extractError }

export { unwrap } from './client';
