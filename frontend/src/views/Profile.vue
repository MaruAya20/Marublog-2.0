<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, extractError } from '@/api/client'
import type { User } from '@/types'

const route = useRoute()
const auth = useAuthStore()
const profile = ref<User | null>(null)
const editing = ref(false)
const editName = ref('')
const editBio = ref('')
const editAvatar = ref('')
const saving = ref(false)
const error = ref('')

const isMe = computed(() => {
  const name = route.params.name as string
  return auth.user?.name === name || (route.path === '/me')
})

async function loadProfile() {
  error.value = ''
  try {
    if (isMe.value) {
      await auth.fetchMe()
      profile.value = auth.user
    } else {
      const name = route.params.name as string
      const res = await api.get(`/users/${encodeURIComponent(name)}`)
      profile.value = res.data.user || res.data
    }
  } catch (err) {
    error.value = extractError(err)
  }
}

function startEdit() {
  if (!profile.value) return
  editName.value = profile.value.name || ''
  editBio.value = profile.value.signature || ''
  editAvatar.value = profile.value.avatar || ''
  editing.value = true
}

async function saveEdit() {
  saving.value = true
  error.value = ''
  try {
    const patch: Record<string, unknown> = {}
    if (editName.value !== profile.value?.name) patch.name = editName.value.trim()
    if (editBio.value !== profile.value?.signature) patch.signature = editBio.value.trim()
    if (editAvatar.value !== profile.value?.avatar) patch.avatar = editAvatar.value.trim()
    if (Object.keys(patch).length === 0) { editing.value = false; return }
    const res = await api.patch('/me/profile', patch)
    profile.value = res.data.user || res.data
    auth.user = profile.value
    localStorage.setItem('user', JSON.stringify(profile.value))
    editing.value = false
  } catch (err) {
    error.value = extractError(err)
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="!profile" class="loading">加载中...</div>

    <div v-else class="card">
      <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
        <div
          v-if="profile.avatar"
          style="width: 72px; height: 72px; border-radius: 50%; background-size: cover; background-position: center;"
          :style="{ backgroundImage: `url(${profile.avatar})` }"
        ></div>
        <div v-else style="width: 72px; height: 72px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 28px;">
          {{ (profile.name || '?')[0] }}
        </div>

        <div style="flex: 1;">
          <h2>{{ profile.name || '未命名' }}</h2>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
            {{ profile.role }}
            <span v-if="profile.xp !== undefined"> · XP {{ profile.xp }}</span>
          </div>
        </div>

        <button v-if="isMe && !editing" class="btn-ghost" @click="startEdit">编辑资料</button>
      </div>

      <div v-if="profile.signature" style="border-top: 1px solid var(--border); padding-top: 14px; font-size: 14px; color: #444;">
        {{ profile.signature }}
      </div>

      <template v-if="editing">
        <hr style="margin: 20px 0; border-color: var(--border);">
        <h3 style="margin-bottom: 14px;">编辑资料</h3>
        <div class="form-row">
          <label>昵称</label>
          <input v-model="editName" maxlength="16" />
        </div>
        <div class="form-row">
          <label>个性签名</label>
          <textarea v-model="editBio" maxlength="120" />
        </div>
        <div class="form-row">
          <label>头像 URL</label>
          <input v-model="editAvatar" placeholder="https://..." />
        </div>
        <div class="form-actions">
          <button class="btn-primary" :disabled="saving" @click="saveEdit">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button class="btn-ghost" @click="editing = false">取消</button>
        </div>
      </template>
    </div>
  </div>
</template>