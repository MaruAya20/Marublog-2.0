<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { postApi, commentApi, trackApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'
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

        <div class="post-content" v-html="post.content || ''"></div>

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