<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postApi, extractError } from '@/api'
import type { Post } from '@/types'

const router = useRouter()
const drafts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    drafts.value = await postApi.drafts()
  } catch (err) {
    error.value = extractError(err)
  } finally {
    loading.value = false
  }
}

onMounted(load)

function goEdit(slug: string) {
  router.push(`/edit/${slug}`)
}

function formatDate(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  const now = new Date()
  const diff = (now.getTime() - dt.getTime()) / 1000
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  return dt.toLocaleDateString()
}

async function publishDirect(slug: string) {
  if (!confirm('确定要直接发布这篇草稿吗？')) return
  try {
    await postApi.update(slug, { status: 'published' })
    load()
  } catch (err) {
    alert(extractError(err))
  }
}
</script>

<template>
  <div>
    <h1 style="margin-bottom: 20px;">📝 我的草稿</h1>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="drafts.length === 0" class="empty">
      <p>还没有草稿</p>
      <router-link to="/new" class="btn-primary">开始写新文章</router-link>
    </div>

    <div v-else class="draft-list">
      <div v-for="d in drafts" :key="d.id" class="draft-card">
        <div class="draft-info">
          <div class="draft-title" @click="goEdit(d.slug)">{{ d.title || '(未命名草稿)' }}</div>
          <div class="draft-meta">
            <span class="draft-badge">·未发布</span>
            <span>保存于 {{ formatDate(d.publishedAt) }}</span>
            <span v-if="d.tags?.length" class="draft-tags">{{ d.tags.join(' ') }}</span>
          </div>
          <p v-if="d.excerpt" class="draft-excerpt">{{ d.excerpt }}</p>
        </div>
        <div class="draft-actions">
          <button class="btn-ghost" @click="goEdit(d.slug)">继续编辑</button>
          <button class="btn-primary" @click="publishDirect(d.slug)">直接发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.draft-list { display: flex; flex-direction: column; gap: 12px; }
.draft-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  gap: 16px;
}
.draft-info { flex: 1; min-width: 0; }
.draft-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  margin-bottom: 6px;
}
.draft-title:hover { color: var(--primary, #4a9eff); }
.draft-meta {
  font-size: 12px;
  color: #888;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
}
.draft-badge {
  color: #e67e22;
  background: #fff3e0;
  padding: 1px 6px;
  border-radius: 3px;
}
.draft-tags { color: #aaa; font-style: italic; }
.draft-excerpt {
  font-size: 13px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.draft-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.draft-actions button { padding: 5px 12px; font-size: 13px; }
.loading, .error, .empty {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}
.empty { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.btn-primary {
  padding: 6px 14px;
  background: var(--primary, #4a9eff);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-primary:hover { opacity: 0.9; }
.btn-ghost {
  padding: 6px 14px;
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-ghost:hover { background: #f5f5f5; }
</style>