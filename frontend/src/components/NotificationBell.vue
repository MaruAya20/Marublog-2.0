<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const notif = useNotificationStore()
const auth = useAuthStore()
const open = ref(false)

const hasUnread = computed(() => notif.unreadCount > 0)

function goNotifications() {
  open.value = false
  router.push('/notifications')
}

function goPost(n: any) {
  open.value = false
  if (n.id && !n.isRead) notif.markRead(n.id)
  if (n.postSlug) router.push(`/post/${n.postSlug}`)
  else router.push('/notifications')
}

function typeLabel(t: string) {
  return { COMMENT: '评论了你', REPLY: '回复了你', LIKE: '点赞了你', SYSTEM: '系统通知' }[t] || t
}

function typeIcon(t: string) {
  return { COMMENT: '💬', REPLY: '↩️', LIKE: '❤️', SYSTEM: '🔔' }[t] || '🔔'
}
</script>

<template>
  <div class="notif-bell" v-if="auth.isLoggedIn">
    <button class="bell-btn" @click="open = !open" :class="{ active: hasUnread }">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
      <span v-if="hasUnread" class="badge">{{ notif.unreadCount > 99 ? '99+' : notif.unreadCount }}</span>
    </button>

    <div v-if="open" class="notif-panel" @click.stop>
      <div class="notif-header">
        <span>通知</span>
        <button v-if="hasUnread" class="mark-all" @click="notif.markAllRead()">全部已读</button>
      </div>
      <div class="notif-list" v-if="notif.recent.length">
        <div
          v-for="n in notif.recent"
          :key="n.id"
          class="notif-item"
          :class="{ unread: !n.isRead }"
          @click="goPost(n)"
        >
          <span class="icon">{{ typeIcon(n.type) }}</span>
          <div class="body">
            <div class="title">
              <strong v-if="n.fromName">{{ n.fromName }}</strong>
              <span>{{ typeLabel(n.type) }}</span>
            </div>
            <div class="preview">{{ n.content || n.postTitle || '' }}</div>
          </div>
        </div>
      </div>
      <div v-else class="notif-empty">暂无通知</div>
      <div class="notif-footer" @click="goNotifications">查看全部 →</div>
    </div>
  </div>
</template>

<style scoped>
.notif-bell {
  position: relative;
}
.bell-btn {
  background: transparent;
  border: none;
  color: var(--text, #333);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
}
.bell-btn:hover {
  background: rgba(128, 128, 128, 0.15);
}
.bell-btn.active {
  color: var(--accent, #ff6b9d);
}
.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--accent, #ff6b9d);
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.notif-panel {
  position: absolute;
  top: 40px;
  right: 0;
  width: 320px;
  max-height: 400px;
  background: var(--bg-card, white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  border: 1px solid rgba(128, 128, 128, 0.2);
}
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}
.mark-all {
  font-size: 12px;
  color: var(--accent, #ff6b9d);
  background: none;
  border: none;
  cursor: pointer;
}
.notif-list {
  overflow-y: auto;
  max-height: 300px;
}
.notif-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.1s;
}
.notif-item:hover {
  background: rgba(128, 128, 128, 0.1);
}
.notif-item.unread {
  background: rgba(255, 107, 157, 0.08);
}
.icon {
  font-size: 18px;
  flex-shrink: 0;
}
.body {
  flex: 1;
  min-width: 0;
}
.title {
  font-size: 13px;
}
.preview {
  font-size: 12px;
  color: var(--text-muted, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.notif-empty {
  padding: 40px;
  text-align: center;
  color: var(--text-muted, #888);
  font-size: 14px;
}
.notif-footer {
  padding: 10px;
  text-align: center;
  font-size: 13px;
  color: var(--accent, #ff6b9d);
  cursor: pointer;
  border-top: 1px solid rgba(128, 128, 128, 0.15);
}
.notif-footer:hover {
  background: rgba(128, 128, 128, 0.08);
}
</style>