<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const notif = useNotificationStore()
const auth = useAuthStore()

const toasts = ref<{ id: number; fromName?: string; type: string; postSlug?: string; content?: string; timeout: any }[]>([])

let lastUnread = 0
let checkTimer: ReturnType<typeof setInterval> | null = null

function showNewNotifications(diff: number) {
  const recent = notif.recent || []
  const fresh = recent.slice(0, diff)
  fresh.forEach((n: any) => {
    if (!toasts.value.find(t => t.id === n.id)) {
      addToast(n)
    }
  })
}

function addToast(n: any) {
  const t = { ...n, timeout: null as any }
  toasts.value.push(t)
  t.timeout = setTimeout(() => {
    dismiss(t.id)
  }, 4000)
}

function dismiss(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx >= 0) {
    if (toasts.value[idx].timeout) clearTimeout(toasts.value[idx].timeout)
    toasts.value.splice(idx, 1)
  }
}

function clickToast(t: any) {
  dismiss(t.id)
  if (t.postSlug) router.push(`/post/${t.postSlug}`)
  else router.push('/notifications')
  if (!t.isRead) notif.markRead(t.id)
}

function typeIcon(t: string) {
  return { COMMENT: '💬', REPLY: '↩️', LIKE: '❤️', SYSTEM: '🔔' }[t] || '🔔'
}

onMounted(() => {
  if (!auth.isLoggedIn) return
  lastUnread = notif.unreadCount
  checkTimer = setInterval(async () => {
    if (!auth.isLoggedIn) return
    const before = notif.unreadCount
    await notif.fetchUnread()
    await notif.fetchRecent()
    if (notif.unreadCount > before) {
      showNewNotifications(notif.unreadCount - before)
    }
    lastUnread = notif.unreadCount
  }, 25000)
})

onUnmounted(() => {
  if (checkTimer) clearInterval(checkTimer)
  toasts.value.forEach(t => t.timeout && clearTimeout(t.timeout))
})
</script>

<template>
  <div class="toast-stack">
    <transition-group name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-item"
        @click="clickToast(t)"
      >
        <span class="icon">{{ typeIcon(t.type) }}</span>
        <div class="body">
          <div class="title">
            <strong>{{ t.fromName || '有人' }}</strong>
            <span>
              {{ t.type === 'COMMENT' ? '评论了你' : t.type === 'REPLY' ? '回复了你' : t.type === 'LIKE' ? '点赞了你' : '通知你' }}
            </span>
          </div>
          <div class="preview">{{ t.content || t.postTitle || '' }}</div>
        </div>
        <button class="close" @click.stop="dismiss(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}
.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg-card, white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 14px 16px;
  min-width: 280px;
  max-width: 360px;
  cursor: pointer;
  border-left: 4px solid var(--accent, #ff6b9d);
  transition: transform 0.2s;
}
.toast-item:hover {
  transform: translateX(4px);
}
.icon {
  font-size: 22px;
  flex-shrink: 0;
}
.body {
  flex: 1;
  min-width: 0;
}
.title {
  font-size: 14px;
  margin-bottom: 2px;
}
.preview {
  font-size: 12px;
  color: var(--text-muted, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.close {
  background: transparent;
  border: none;
  color: var(--text-muted, #888);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
}
.close:hover {
  background: rgba(128, 128, 128, 0.2);
  color: var(--text, #333);
}
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>