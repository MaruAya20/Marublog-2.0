<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { notificationApi } from '@/api'

const router = useRouter()
const auth = useAuthStore()

type Tab = 'replies' | 'comments' | 'likes'
const activeTab = ref<Tab>('replies')
const loading = ref(false)
const allItems = ref<any[]>([])
const unread = ref(0)

const replies = computed(() => allItems.value.filter(m => m.type === 'reply'))
const comments = computed(() => allItems.value.filter(m => m.type === 'comment'))
const likes = computed(() => allItems.value.filter(m => m.type === 'like'))

const unreadReplies = computed(() => replies.value.filter(r => !r.read).length)
const unreadComments = computed(() => comments.value.filter(r => !r.read).length)
const unreadLikes = computed(() => likes.value.filter(r => !r.read).length)

async function load() {
  if (!auth.isLoggedIn) {
    allItems.value = []
    unread.value = 0
    return
  }
  loading.value = true
  try {
    const res = await notificationApi.list()
    allItems.value = res.items || []
    unread.value = res.unread || 0
  } catch (e) {
    console.error('load notifications error', e)
  } finally {
    loading.value = false
  }
}

async function handleOpenPost(slug: string, id: number) {
  try { await notificationApi.markRead(id) } catch {}
  await load()
  router.push(`/post/${slug}`)
}

async function markAllRead() {
  try { await notificationApi.markAllRead() } catch {}
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="card" style="margin-bottom: 16px;">
      <h2 style="margin-bottom: 12px;">📬 信箱</h2>
      <div v-if="!auth.isLoggedIn" class="empty" style="padding: 20px;">请先登录查看信箱</div>
      <div v-else class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'replies' }"
          @click="activeTab = 'replies'"
        >
          回复我的 <span v-if="unreadReplies" class="badge">{{ unreadReplies }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'comments' }"
          @click="activeTab = 'comments'"
        >
          评论我的 <span v-if="unreadComments" class="badge">{{ unreadComments }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'likes' }"
          @click="activeTab = 'likes'"
        >
          点赞我的 <span v-if="unreadLikes" class="badge">{{ unreadLikes }}</span>
        </button>
        <button class="mark-all" v-if="unread > 0" @click="markAllRead">全部已读</button>
      </div>
    </div>

    <div class="card">
      <div v-if="loading" class="empty">加载中...</div>

      <template v-else-if="activeTab === 'replies'">
        <div v-if="replies.length === 0" class="empty">暂无回复</div>
        <div v-for="m in replies" :key="m.id" class="msg-item" :class="{ unread: !m.read }">
          <div class="msg-header">
            <strong>{{ m.fromName || '有人' }}</strong>
            <span class="msg-time">{{ m.createdAt }}</span>
          </div>
          <div class="msg-content">{{ m.content }}</div>
          <div class="msg-link" @click="handleOpenPost(m.postSlug, m.id)">
            回复了你的评论 · 《{{ m.postTitle }}》 →
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'comments'">
        <div v-if="comments.length === 0" class="empty">暂无评论</div>
        <div v-for="m in comments" :key="m.id" class="msg-item" :class="{ unread: !m.read }">
          <div class="msg-header">
            <strong>{{ m.fromName || '有人' }}</strong>
            <span class="msg-time">{{ m.createdAt }}</span>
          </div>
          <div class="msg-content">{{ m.content }}</div>
          <div class="msg-link" @click="handleOpenPost(m.postSlug, m.id)">
            评论了你的文章 · 《{{ m.postTitle }}》 →
          </div>
        </div>
      </template>

      <template v-else>
        <div v-if="likes.length === 0" class="empty">暂无点赞</div>
        <div v-for="m in likes" :key="m.id" class="msg-item" :class="{ unread: !m.read }">
          <div class="msg-header">
            <strong>{{ m.fromName || '有人' }}</strong>
            <span class="msg-time">{{ m.createdAt }}</span>
          </div>
          <div class="msg-icon">❤️</div>
          <div class="msg-link" @click="handleOpenPost(m.postSlug, m.id)">
            赞了你的文章 · 《{{ m.postTitle }}》 →
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.tab {
  padding: 6px 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.tab.active { background: var(--primary, #4a9eff); color: #fff; border-color: var(--primary, #4a9eff); }
.tab:hover:not(.active) { background: #f5f5f5; }
.badge {
  background: #ff4757;
  color: #fff;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}
.mark-all {
  margin-left: auto;
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
}
.mark-all:hover { color: var(--primary, #4a9eff); }
.msg-item {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}
.msg-item:last-child { border-bottom: none; }
.msg-item.unread { background: #f0f7ff; }
.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.msg-time { font-size: 12px; color: #999; }
.msg-content { font-size: 14px; color: #333; margin-bottom: 6px; line-height: 1.5; }
.msg-icon { font-size: 20px; margin-bottom: 6px; }
.msg-link { font-size: 12px; color: var(--primary, #4a9eff); cursor: pointer; }
.msg-link:hover { text-decoration: underline; }
.empty { padding: 40px; text-align: center; color: #999; }
</style>