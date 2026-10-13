import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, extractError } from '@/api/client'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  async function sendCode(email: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/send-code', { email })
      return res.data
    } catch (err) {
      throw new Error(extractError(err))
    } finally {
      loading.value = false
    }
  }

  async function loginWithCode(email: string, code: string, name?: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/login', { email, code, name })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data
    } catch (err) {
      throw new Error(extractError(err))
    } finally {
      loading.value = false
    }
  }

  async function guestLogin(name: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/guest', { name })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data
    } catch (err) {
      throw new Error(extractError(err))
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return null
    loading.value = true
    try {
      const res = await api.get('/me')
      user.value = res.data.user || res.data
      localStorage.setItem('user', JSON.stringify(user.value))
      return user.value
    } catch (err) {
      logout()
      return null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await api.post('/auth/logout').catch(() => {})
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      loading.value = false
    }
  }

  function initFromStorage() {
    const saved = localStorage.getItem('user')
    if (saved) {
      try { user.value = JSON.parse(saved) } catch {}
    }
  }

  return {
    user, token, loading, isLoggedIn, isAdmin,
    sendCode, loginWithCode, guestLogin, fetchMe, logout, initFromStorage
  }
})