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
  comments?: number
  views?: number
  likedByMe?: boolean
  favoritedByMe?: boolean
  previewImages?: string[]
  previewThumbs?: string[]
  status?: string
}
export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
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

export interface UserPreference {
  wallpaper: string | null
  wallpaperHidden?: boolean
  opacity: number
  theme: string | null
  fontSize: string | null
}