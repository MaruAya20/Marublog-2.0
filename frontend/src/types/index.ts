export type Role = 'ADMIN' | 'AUTHOR' | 'MEMBER' | 'GUEST'

export interface User {
  id: number
  name?: string
  email?: string
  role: Role
  avatar?: string
  signature?: string
  xp?: number
  level?: number
  createdAt?: string
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt?: string
  content?: string
  tags?: string[]
  publishedAt?: string
  authorId?: number
  author?: User
  likes?: number
  favorites?: number
  likedByMe?: boolean
  favoritedByMe?: boolean
}

export interface PostListResponse {
  posts: Post[]
  total: number
}

export interface Comment {
  id: number
  content: string
  createdAt?: string
  userId?: number
  guestName?: string
  user?: User
}

export interface TagDef {
  id: number
  name: string
  color?: string
  bg?: string
}

export interface SiteSettings {
  title: string
  subtitle?: string
  seoDescription?: string
  announcement?: string
  allowGuestComment: boolean
  allowRegistration: boolean
}

export interface ApiError {
  code?: string
  message: string
}

export interface SessionResponse {
  token?: string
  user?: User
  message?: string
}