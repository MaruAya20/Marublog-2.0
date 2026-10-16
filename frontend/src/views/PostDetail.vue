<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, commentApi, tagApi, trackApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { renderMarkdown } from '@/utils/markdown'
import type { Post, Comment, TagDef } from '@/types'
import ImageViewer from '@/components/ImageViewer.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const post = ref<Post | null>(null)
const comments = ref<any[]>([])
const commentTotal = ref(0)
const tags = ref<TagDef[]>([])
const loading = ref(false)
const error = ref('')
const commentContent = ref('')
const guestName = ref('')
const submitting = ref(false)
const replyTo = ref<{ id: number; name: string; parentId?: number; mentionUserId?: number } | null>(null)

const viewerOpen = ref(false)
const viewerSrc = ref('')

function openViewer(src: string) {
  viewerSrc.value = src
  viewerOpen.value = true
}

function onContentClick(e: MouseEvent) {
  const target = e.target as HTMLImageElement
  if (target.tagName === 'IMG' && target.src) {
    openViewer(target.src)
  }
}

function goUser(name?: string) {
  if (name) router.push(`/user/${encodeURIComponent(name)}`)
}

const slug = computed(() => route.params.slug as string)

const isOwner = computed(() => {
  if (!post.value || !auth.user) return false
  return auth.user.name === post.value.author?.name || auth.user.role === 'ADMIN'
})

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return renderMarkdown(post.value.content)
})

function getTagStyle(name: string) {
  const t = tags.value.find(x => x.name === name)
  if (!t) return {}
  const textColor = t.color || '#888'
  const h = textColor.replace('#', '')
  const rgb = h.length === 6
    ? [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
    : null
  if (!rgb) return { background: '#f0f0f0', color: textColor }
  const bg = `rgb(${Math.round(rgb[0] * 0.45)}, ${Math.round(rgb[1] * 0.45)}, ${Math.round(rgb[2] * 0.45)})`
  const bd = `rgb(${Math.round(rgb[0] * 0.6)}, ${Math.round(rgb[1] * 0.6)}, ${Math.round(rgb[2] * 0.6)})`
  return { background: bg, color: textColor, border: `1px solid ${bd}` }
}

function goEdit() {
  router.push(`/edit/${slug.value}`)
}

function startReply(c: any) {
  replyTo.value = {
    id: c.id,
    name: c.user?.name || c.guestName || '匿名',
    parentId: c.parentId ?? c.id,
    mentionUserId: c.userId,
  }
  commentContent.value = ''
  setTimeout(() => (document.querySelector('.comment-input textarea') as HTMLElement)?.focus(), 50)
}

function cancelReply() {
  replyTo.value = null
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    tags.value = await tagApi.list().catch(() => [])
    post.value = await postApi.getBySlug(slug.value)
    const tree = await commentApi.tree(post.value.id)
    comments.value = tree.roots || []
    commentTotal.value = tree.total || 0
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
    const data: any = {
      postId: post.value!.id,
      content: commentContent.value.trim(),
    }
    if (replyTo.value) {
      data.parentId = replyTo.value.parentId
      if (replyTo.value.mentionUserId) data.mentionUserId = replyTo.value.mentionUserId
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
    replyTo.value = null
    const tree = await commentApi.tree(post.value!.id)
    comments.value = tree.roots || []
    commentTotal.value = tree.total || 0
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
        <div class="post-meta" style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span v-if="post.publishedAt">{{ new Date(post.publishedAt).toLocaleString() }}</span>
          <span v-if="post.publishedAt && post.author">·</span>
          <router-link
            v-if="post.author"
            class="author-link"
            :to="`/user/${encodeURIComponent(post.author.name || '')}`"
            @click.stop
          >
            <img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              class="mini-avatar"
              alt="头像"
            />
            <span v-else class="mini-avatar mini-avatar-fb">{{ (post.author.name || '?')[0] }}</span>
            <span class="author-name">{{ post.author.name }}</span>
          </router-link>
          <template v-if="isOwner">
            <span style="color:#ccc;">·</span>
            <button class="btn-ghost" style="padding: 2px 10px; font-size: 12px;" @click="goEdit">✏️ 编辑</button>
          </template>
        </div>

        <div v-if="post.tags?.length" class="post-tags" style="margin-bottom: 20px;">
          <span v-for="t in post.tags" :key="t" class="tag" :style="getTagStyle(t)">{{ t }}</span>
        </div>

        <div class="post-content markdown-body" v-html="renderedContent" @click="onContentClick"></div>

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
        <h3 style="margin-bottom: 16px;">评论 ({{ commentTotal }})</h3>

        <div v-if="replyTo" style="margin-bottom: 10px; padding: 8px 12px; background: #f0f7ff; border-radius: 6px; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
          <span>正在回复 <strong>@{{ replyTo.name }}</strong></span>
          <button class="btn-ghost" style="padding: 2px 8px; font-size: 12px;" @click="cancelReply">取消</button>
        </div>

        <div class="form-row" v-if="!auth.isLoggedIn">
          <label>昵称（访客）</label>
          <input v-model="guestName" placeholder="请输入昵称" maxlength="16" />
        </div>

        <div class="form-row comment-input">
          <textarea v-model="commentContent" placeholder="写下你的评论..." maxlength="500"></textarea>
        </div>
        <div class="form-actions">
          <button class="btn-primary" :disabled="submitting" @click="submitComment">
            {{ submitting ? '发送中...' : (replyTo ? '发表回复' : '发表评论') }}
          </button>
        </div>

        <div style="margin-top: 24px;">
          <template v-for="c in comments" :key="c.id">
            <div class="comment-item">
              <div class="comment-meta">
                <strong>{{ c.user?.name || c.guestName || '匿名' }}</strong>
                <span v-if="c.createdAt"> · {{ new Date(c.createdAt).toLocaleString() }}</span>
                <button class="reply-btn" @click="startReply(c)">回复</button>
              </div>
              <div style="font-size: 14px;">{{ c.content }}</div>

              <div v-if="c.replies?.length" class="comment-replies">
                <div v-for="r in c.replies" :key="r.id" class="comment-item comment-item-reply">
                  <div class="comment-meta">
                    <strong>{{ r.user?.name || r.guestName || '匿名' }}</strong>
                    <span v-if="r.createdAt"> · {{ new Date(r.createdAt).toLocaleString() }}</span>
                    <button class="reply-btn" @click="startReply(r)">回复</button>
                  </div>
                  <div style="font-size: 14px;">{{ r.content }}</div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="comments.length === 0" class="empty" style="padding: 20px;">
            暂无评论，来抢沙发吧~
          </div>
        </div>
      </div>

      <ImageViewer :open="viewerOpen" :src="viewerSrc" @close="viewerOpen = false" />
    </template>
  </div>
</template>

<style scoped>
.author-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #555;
  transition: color 0.15s;
}
.author-link:hover { color: var(--primary, #4a9eff); }
.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
  flex-shrink: 0;
}
.mini-avatar-fb {
  background: #e8eaed;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}
.author-name { font-size: 13px; }

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
.comment-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.reply-btn {
  margin-left: auto;
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
}
.reply-btn:hover { color: var(--primary, #4a9eff); background: #f0f7ff; }
.comment-replies {
  margin-top: 10px;
  padding-left: 14px;
  border-left: 2px solid #eee;
}
.comment-item-reply {
  padding: 8px 0;
  border-bottom: none;
}
</style>