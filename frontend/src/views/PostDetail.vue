<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { postApi, commentApi, trackApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { renderMarkdown } from '@/utils/markdown'
import type { Post, Comment } from '@/types'

const route = useRoute()
const auth = useAuthStore()
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(false)
const error = ref('')
const commentContent = ref('')
const guestName = ref('')
const submitting = ref(false)

const slug = computed(() => route.params.slug as string)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return renderMarkdown(post.value.content)
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    post.value = await postApi.getBySlug(slug.value)
    comments.value = await commentApi.list(post.value.id)
    trackApi.view({ route: `/post/${slug.value}`, slug: slug.value, postId: post.value.id })
  } catch (err) {
    error.value = extractError(err)
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!commentContent.value.trim()) return
  submitting.value = true
  try {
    const data: { postId: number; content: string; guestName?: string } = {
      postId: post.value!.id,
      content: commentContent.value.trim(),
    }
    if (!auth.isLoggedIn) {
      if (!guestName.value.trim()) {
        alert('访客请填昵称')
        submitting.value = false
        return
      }
      data.guestName = guestName.value.trim()
    }
    await commentApi.create(data)
    commentContent.value = ''
    guestName.value = ''
    comments.value = await commentApi.list(post.value!.id)
  } catch (err) {
    alert(extractError(err))
  } finally {
    submitting.value = false
  }
}

async function toggleLike() {
  if (!auth.isLoggedIn) { alert('请先登录'); return }
  const res = await postApi.toggleLike(slug.value)
  if (post.value) {
    post.value.likedByMe = res.liked
    post.value.likes = res.count
  }
}

async function toggleFavorite() {
  if (!auth.isLoggedIn) { alert('请先登录'); return }
  const res = await postApi.toggleFavorite(slug.value)
  if (post.value) {
    post.value.favoritedByMe = res.favorited
    post.value.favorites = res.count
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else-if="post">
      <article class="card" style="margin-bottom: 20px;">
        <h1 style="font-size: 26px; margin-bottom: 10px;">{{ post.title }}</h1>
        <div class="post-meta" style="margin-bottom: 20px;">
          <span v-if="post.publishedAt">{{ new Date(post.publishedAt).toLocaleString() }}</span>
          <span v-if="post.author"> · {{ post.author.name }}</span>
        </div>

        <div v-if="post.tags?.length" class="post-tags" style="margin-bottom: 20px;">
          <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
        </div>

        <div class="post-content markdown-body" v-html="renderedContent"></div>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
          <button class="btn-ghost" :class="{ active: post.likedByMe }" @click="toggleLike">
            {{ post.likedByMe ? '❤️ 已赞' : '🤍 点赞' }} {{ post.likes || 0 }}
          </button>
          <button class="btn-ghost" @click="toggleFavorite">
            {{ post.favoritedByMe ? '⭐ 已收藏' : '☆ 收藏' }} {{ post.favorites || 0 }}
          </button>
        </div>
      </article>

      <div class="card">
        <h3 style="margin-bottom: 16px;">评论 ({{ comments.length }})</h3>

        <div class="form-row" v-if="!auth.isLoggedIn">
          <label>昵称（访客）</label>
          <input v-model="guestName" placeholder="请输入昵称" maxlength="16" />
        </div>

        <div class="form-row">
          <textarea v-model="commentContent" placeholder="写下你的评论..." maxlength="500"></textarea>
        </div>
        <div class="form-actions">
          <button class="btn-primary" :disabled="submitting" @click="submitComment">
            {{ submitting ? '发送中...' : '发表评论' }}
          </button>
        </div>

        <div style="margin-top: 24px;">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <div class="comment-meta">
              <strong>{{ c.user?.name || c.guestName || '匿名' }}</strong>
              <span v-if="c.createdAt"> · {{ new Date(c.createdAt).toLocaleString() }}</span>
            </div>
            <div style="font-size: 14px;">{{ c.content }}</div>
          </div>
          <div v-if="comments.length === 0" class="empty" style="padding: 20px;">
            暂无评论，来抢沙发吧~
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 20px 0 10px;
  line-height: 1.4;
}
.markdown-body :deep(h1) { font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
.markdown-body :deep(h2) { font-size: 19px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
.markdown-body :deep(h3) { font-size: 17px; }
.markdown-body :deep(p) { margin: 10px 0; line-height: 1.7; }
.markdown-body :deep(img) {
  max-width: 70%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 12px auto;
  cursor: zoom-in;
}
.markdown-body :deep(pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 14px 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 14px 0;
}
.markdown-body :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
}
.markdown-body :deep(:not(pre) > code) {
  background: #f0f0f0;
  color: #c7254e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--primary, #4a9eff);
  padding: 8px 16px;
  margin: 14px 0;
  color: #666;
  background: #f9f9f9;
  border-radius: 0 6px 6px 0;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 24px;
  margin: 10px 0;
}
.markdown-body :deep(li) { margin: 4px 0; line-height: 1.6; }
.markdown-body :deep(a) {
  color: var(--primary, #4a9eff);
  text-decoration: none;
}
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(hr) {
  border: none;
  height: 1px;
  background: #e0e0e0;
  margin: 24px 0;
}
.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 14px 0;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: left;
}
.markdown-body :deep(th) { background: #f5f5f5; }

.markdown-body :deep(.audio-card) {
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 14px;
  margin: 14px 0;
}
.markdown-body :deep(.audio-title) {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}
.markdown-body :deep(.audio-card audio) {
  width: 100%;
  max-width: 480px;
}
</style>