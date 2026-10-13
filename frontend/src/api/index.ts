import { api, extractError } from './client'
import type { Post, Comment, TagDef, SiteSettings, PostListResponse } from '@/types'

export const postApi = {
  list: async (params?: { tag?: string; page?: number; pageSize?: number; q?: string }) => {
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
}

export const commentApi = {
  list: async (postId: number) => {
    const res = await api.get<Comment[]>('/comments', { params: { postId } })
    return res.data
  },
  create: async (data: { postId: number; content: string; guestName?: string }) => {
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
  view: async (data: { route: string; slug?: string; postId?: number }) => {
    await api.post('/track/view', data).catch(() => {})
  },
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
    const res = await api.post<{ url: string; name: string; size: number; mime: string }>('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export { extractError }