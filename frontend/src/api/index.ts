import { api, extractError } from './client'
import type { Post, Comment, TagDef, SiteSettings, PostListResponse, UserPreference } from '@/types'

export const postApi = {
  list: async (params?: { tag?: string; page?: number; pageSize?: number; q?: string; authorId?: number }) => {
    const res = await api.get<PostListResponse>('/posts', { params })
    return res.data
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<Post>(`/posts/${slug}`)
    return res.data
  },
  create: async (data: { title: string; content: string; excerpt?: string; tags?: string[]; status?: string; scheduledAt?: string }) => {
    const res = await api.post<Post>('/posts', data)
    return res.data
  },
  update: async (slug: string, data: { title?: string; content?: string; excerpt?: string; tags?: string[]; status?: string; scheduledAt?: string }) => {
    const res = await api.patch<Post>(`/posts/${slug}`, data)
    return res.data
  },
  remove: async (slug: string) => {
    const res = await api.delete(`/posts/${slug}`)
    return res.data
  },
  toggleLike: async (slug: string) => {
    const res = await api.post(`/posts/${slug}/like`)
    return res.data
  },
  toggleFavorite: async (slug: string) => {
    const res = await api.post(`/posts/${slug}/favorite`)
    return res.data
  },
  drafts: async () => {
    const res = await api.get<Post[]>('/posts/drafts')
    return res.data
  }
}

export const commentApi = {
  list: async (postId: number) => {
    const res = await api.get<Comment[]>('/comments', { params: { postId } })
    return res.data
  },
  tree: async (postId: number) => {
    const res = await api.get<any>('/comments/tree', { params: { postId } })
    return res.data
  },
  create: async (data: { postId: number; content: string; guestName?: string; parentId?: number; mentionUserId?: number }) => {
    const res = await api.post<Comment>('/comments', data)
    return res.data
  },
  remove: async (id: number) => {
    const res = await api.delete(`/comments/${id}`)
    return res.data
  },
}

export const tagApi = {
  list: async () => {
    const res = await api.get<TagDef[]>('/tags')
    return res.data
  },
}

export const siteApi = {
  get: async () => {
    const res = await api.get<SiteSettings>('/site')
    return res.data
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
    return res.data
  },
}

export const uploadApi = {
  upload: async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post<{ url: string; name: string; size: number; mime: string }>('/upload', fd)
    return res.data
  },
  delete: async (url: string) => {
    const res = await api.delete('/upload', { params: { url } })
    return res.data
  },
}

export const notificationApi = {
  async list(type?: string) {
    const res = await api.get<any>('/notifications', { params: type ? { type } : undefined })
    return res.data
  },
  async unread() {
    const res = await api.get<{ count: number }>('/notifications/unread')
    return res.data
  },
  async markRead(id: number) {
    const res = await api.post(`/notifications/${id}/read`)
    return res.data
  },
  async markAllRead() {
    const res = await api.post('/notifications/read-all')
    return res.data
  },
}

export const preferenceApi = {
  get: async () => {
    const res = await api.get<UserPreference>('/me/preference')
    return res.data
  },
  update: async (data: Partial<Omit<UserPreference, 'opacity'>> & { opacity?: number }) => {
    const res = await api.patch('/me/preference', data)
    return res.data
  },
}

export const adminApi = {
  status: async () => {
    const res = await api.get('/admin/status')
    return res.data as { isAdmin: boolean; userId: number | null; role: string | null }
  },
  stats: async () => {
    const res = await api.get('/admin/stats')
    return res.data as Record<string, number | string>
  },
  listUsers: async (params?: { keyword?: string; page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/users', { params })
    return res.data
  },
  listBans: async (params?: { page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/bans', { params })
    return res.data
  },
  listLogs: async (params?: { page?: number; pageSize?: number }) => {
    const res = await api.get('/admin/logs', { params })
    return res.data
  },
  banUser: async (data: { userId: number; minutes: number; reason: string; opCode: string }) => {
    const res = await api.post('/admin/ban-user', data)
    return res.data
  },
  unbanUser: async (data: { userId: number; reason: string; opCode: string }) => {
    const res = await api.post('/admin/unban-user', data)
    return res.data
  },
  promote: async (data: { userId: number; opCode: string }) => {
    const res = await api.post('/admin/promote', data)
    return res.data
  }
}

export { extractError }