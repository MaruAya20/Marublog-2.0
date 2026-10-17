<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { postApi, commentApi, tagApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { renderMarkdown } from '@/utils/markdown'
import ImageViewer from '@/components/ImageViewer.vue'
import type { Post, TagDef } from '@/types'

const props = defineProps<{ slug: string }>()
const router = useRouter()
const auth = useAuthStore()

const post = ref<Post | null>(null)
const comments = ref<any[]>([])
const commentTotal = ref(0)
const tags = ref<TagDef[]>([])
const loading = ref(true)
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
  if (target.tagName === 'IMG' && target.src) openViewer(target.src)
}
function goUser(name?: string) {
  if (name) router.push(`/user/${encodeURIComponent(name)}`)
}

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

function goDetail() {
  if (post.value?.slug) router.push(`/post/${encodeURIComponent(post.value.slug)}`)
}
function goEdit() {
  if (post.value?.slug) router.push(`/edit/${post.value.slug}`)
}

function startReply(c: any) {
  replyTo.value = {
    id: c.id,
    name: c.user?.name || c.guestName || '匿名',
    parentId: c.parentId ?? c.id,
    mentionUserId: c.userId
  }
  commentContent.value = ''
  setTimeout(() => (document.querySelector('.pc-comment-input textarea') as HTMLElement)?.focus(), 50)
}
function cancelReply() { replyTo.value = null }

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (tags.value.length === 0) tags.value = await tagApi.list().catch(() => [])
    post.value = await postApi.getBySlug(props.slug)
    if (post.value?.id) {
      const tree = await commentApi.tree(post.value.id)
      comments.value = tree.roots || []
      commentTotal.value = tree.total || 0
    }
  } catch (err) {
    error.value = extractError(err)
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!commentContent.value.trim() || !post.value) return
  submitting.value = true
  try {
    const data: any = { postId: post.value.id, content: commentContent.value.trim() }
    if (replyTo.value) {
      data.parentId = replyTo.value.parentId
      if (replyTo.value.mentionUserId) data.mentionUserId = replyTo.value.mentionUserId
    }
    if (!auth.isLoggedIn) {
      if (!guestName.value.trim()) { alert('访客请填昵称'); submitting.value = false; return }
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
  const res = await postApi.toggleLike(props.slug)
  if (post.value) { post.value.likedByMe = res.liked; post.value.likes = res.count }
}
async function toggleFavorite() {
  if (!auth.isLoggedIn) { alert('请先登录'); return }
  const res = await postApi.toggleFavorite(props.slug)
  if (post.value) { post.value.favoritedByMe = res.favorited; post.value.favorites = res.count }
}

onMounted(load)
watch(() => props.slug, load)
</script>

<template>
  <div class="post-card-wrap">
    <div v-if="loading" class="pc-hint">加载中...</div>
    <div v-else-if="error" class="pc-hint pc-error">{{ error }}</div>
    <template v-else-if="post">
      <article class="card post-card">
        <header class="pc-header">
          <h2 class="pc-title" @click="goDetail">{{ post.title }}</h2>
          <div class="pc-meta">
            <span v-if="post.publishedAt">{{ new Date(post.publishedAt).toLocaleString() }}</span>
            <template v-if="post.author">
              <span v-if="post.publishedAt">·</span>
              <button class="pc-author" @click="goUser(post.author?.name)">
                <img v-if="post.author.avatar" :src="post.author.avatar" class="pc-avatar" alt="" />
                <span v-else class="pc-avatar pc-avatar-fb">{{ (post.author.name || '?')[0] }}</span>
                <span>{{ post.author.name }}</span>
              </button>
            </template>
            <template v-if="isOwner">
              <span>·</span>
              <button class="pc-ghost-btn" @click.stop="goEdit">✏️ 编辑</button>
            </template>
            <span>·</span>
            <button class="pc-ghost-btn" @click.stop="goDetail">🔗 详情</button>
          </div>
          <div v-if="post.excerpt" class="pc-excerpt">{{ post.excerpt }}</div>
          <div v-if="post.tags?.length" class="pc-tags">
            <span v-for="t in post.tags" :key="t" class="pc-tag" :style="getTagStyle(t)"># {{ t }}</span>
          </div>
        </header>

        <div class="pc-content markdown-body" v-html="renderedContent" @click="onContentClick"></div>

        <div class="pc-actions">
          <button class="btn-ghost" :class="{ active: post.likedByMe }" @click="toggleLike">
            {{ post.likedByMe ? '❤️' : '🤍' }} {{ post.likes || 0 }}
          </button>
          <button class="btn-ghost" :class="{ active: post.favoritedByMe }" @click="toggleFavorite">
            {{ post.favoritedByMe ? '⭐' : '☆' }} {{ post.favorites || 0 }}
          </button>
          <span class="btn-ghost pc-views">👁 {{ post.views ?? 0 }}</span>
          <button class="btn-ghost" @click="goDetail">💬 {{ commentTotal }}</button>
        </div>

        <div class="pc-comments">
          <h4 class="pc-comments-title">评论 ({{ commentTotal }})</h4>
          <div v-if="replyTo" class="pc-reply-hint">
            <span>回复 <strong>@{{ replyTo.name }}</strong></span>
            <button class="pc-ghost-btn" @click="cancelReply">取消</button>
          </div>
          <div v-if="!auth.isLoggedIn" class="pc-form-row">
            <label>昵称（访客）</label>
            <input v-model="guestName" placeholder="请输入昵称" maxlength="16" />
          </div>
          <div class="pc-form-row pc-comment-input">
            <textarea v-model="commentContent" placeholder="写下你的评论..." maxlength="500" rows="3"></textarea>
          </div>
          <div class="pc-form-actions">
            <button class="btn-primary" :disabled="submitting" @click="submitComment">
              {{ submitting ? '发送中...' : (replyTo ? '发表回复' : '发表评论') }}
            </button>
          </div>

          <div class="pc-comment-list" v-if="comments.length">
            <template v-for="c in comments" :key="c.id">
              <div class="pc-comment-item">
                <div class="pc-comment-meta">
                  <strong>{{ c.user?.name || c.guestName || '匿名' }}</strong>
                  <span v-if="c.createdAt"> · {{ new Date(c.createdAt).toLocaleString() }}</span>
                  <button class="pc-reply-btn" @click="startReply(c)">回复</button>
                </div>
                <div class="pc-comment-text">{{ c.content }}</div>
                <div v-if="c.replies?.length" class="pc-comment-replies">
                  <div v-for="r in c.replies" :key="r.id" class="pc-comment-item pc-comment-item-reply">
                    <div class="pc-comment-meta">
                      <strong>{{ r.user?.name || r.guestName || '匿名' }}</strong>
                      <span v-if="r.createdAt"> · {{ new Date(r.createdAt).toLocaleString() }}</span>
                      <button class="pc-reply-btn" @click="startReply(r)">回复</button>
                    </div>
                    <div class="pc-comment-text">{{ r.content }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="pc-hint pc-empty">暂无评论，来抢沙发吧~</div>
        </div>
      </article>
    </template>
    <ImageViewer :open="viewerOpen" :src="viewerSrc" @close="viewerOpen = false" />
  </div>
</template>

<style scoped>
.post-card-wrap { margin-bottom: 16px; }
.card {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  padding: 16px;
}
.pc-hint { text-align: center; padding: 24px; color: var(--muted, #6b7280); font-size: 14px; }
.pc-error { color: #dc2626; }
.pc-header { margin-bottom: 12px; }
.pc-title {
  margin: 0 0 6px; font-size: 20px; font-weight: 600;
  cursor: pointer; color: var(--text, #111);
}
.pc-title:hover { color: var(--brand, #5f4dbf); }
.pc-meta {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--muted, #6b7280); flex-wrap: wrap;
}
.pc-author {
  display: inline-flex; align-items: center; gap: 4px;
  background: none; border: none; cursor: pointer; padding: 0; font-size: 12px;
}
.pc-author:hover { color: var(--brand, #5f4dbf); }
.pc-avatar {
  width: 18px; height: 18px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
  border: 1px solid #eee;
}
.pc-avatar-fb {
  background: #e8eaed; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600;
}
.pc-ghost-btn {
  font-size: 12px; background: none; border: none; cursor: pointer;
  color: var(--muted, #6b7280); padding: 0;
}
.pc-ghost-btn:hover { color: var(--brand, #5f4dbf); }
.pc-excerpt {
  margin-top: 4px; font-size: 13px; color: var(--muted, #6b7280);
  line-height: 1.5;
}
.pc-tags { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; }
.pc-tag {
  font-size: 12px; padding: 2px 8px; border-radius: 10px;
  border: 1px solid;
}
.pc-content {
  margin-top: 12px; padding-top: 12px;
  border-top: 1px dashed var(--border, #e5e7eb);
}
.pc-actions {
  display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
  padding-top: 12px; border-top: 1px solid var(--border, #e5e7eb);
}
.btn-ghost {
  padding: 4px 12px; border-radius: 6px; border: 1px solid var(--border, #e5e7eb);
  background: transparent; cursor: pointer; font-size: 13px; color: var(--text, #374151);
  transition: background 0.1s;
}
.btn-ghost:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.btn-ghost.active { color: var(--brand, #5f4dbf); border-color: var(--brand, #5f4dbf); }
.pc-comments { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border, #e5e7eb); }
.pc-comments-title { margin: 0 0 12px; font-size: 15px; }
.pc-reply-hint {
  margin-bottom: 10px; padding: 8px 12px; background: #f0f7ff; border-radius: 6px;
  font-size: 13px; display: flex; justify-content: space-between; align-items: center;
}
.pc-form-row { display: grid; gap: 4px; margin-bottom: 8px; }
.pc-form-row label { font-size: 12px; color: var(--muted, #6b7280); }
.pc-form-row input, .pc-form-row textarea {
  padding: 8px 10px; border: 1px solid var(--border, #e5e7eb); border-radius: 6px;
  background: transparent; color: var(--text, #111); font-size: 14px; outline: none;
  transition: border-color 0.15s; font-family: inherit;
}
.pc-form-row input:focus, .pc-form-row textarea:focus { border-color: var(--brand, #5f4dbf); }
.pc-comment-input textarea { resize: vertical; min-height: 60px; }
.pc-form-actions { display: flex; justify-content: flex-end; }
.btn-primary {
  padding: 6px 16px; border-radius: 6px; border: none;
  background: var(--brand, #5f4dbf); color: #fff; cursor: pointer;
  font-size: 14px; font-weight: 500;
}
.btn-primary:hover:not(:disabled) { background: var(--brand-hover, #4a3da8); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.pc-comment-list { margin-top: 12px; }
.pc-comment-item { padding: 10px 0; border-bottom: 1px solid var(--border, #e5e7eb); }
.pc-comment-meta {
  display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;
  font-size: 13px;
}
.pc-reply-btn {
  margin-left: auto; font-size: 12px; color: var(--muted, #888);
  background: none; border: none; cursor: pointer; padding: 2px 8px; border-radius: 4px;
}
.pc-reply-btn:hover { color: var(--brand, #5f4dbf); background: #f0f7ff; }
.pc-comment-text { font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
.pc-comment-replies {
  margin-top: 8px; padding-left: 12px; border-left: 2px solid var(--border, #eee);
}
.pc-comment-item-reply { border-bottom: none; padding: 6px 0; }
.pc-empty { padding: 16px; }

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3), .markdown-body :deep(h4) { margin: 16px 0 8px; line-height: 1.4; }
.markdown-body :deep(h1) { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
.markdown-body :deep(h2) { font-size: 17px; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
.markdown-body :deep(h3) { font-size: 15px; }
.markdown-body :deep(p) { margin: 8px 0; line-height: 1.7; }
.markdown-body :deep(img) {
  max-width: 80%; height: auto; border-radius: 8px;
  display: block; margin: 12px auto; cursor: zoom-in;
}
.markdown-body :deep(pre) {
  background: #2d2d2d; color: #f8f8f2; padding: 12px 14px; border-radius: 8px;
  overflow-x: auto; font-size: 13px; line-height: 1.5; margin: 12px 0;
}
.markdown-body :deep(code) { font-family: Consolas, Monaco, monospace; }
.markdown-body :deep(:not(pre) > code) {
  background: #f0f0f0; color: #c7254e; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;
}
.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--brand, #5f4dbf); padding: 8px 14px;
  margin: 12px 0; color: #666; background: #f9f9f9; border-radius: 0 6px 6px 0;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 22px; margin: 8px 0; }
.markdown-body :deep(li) { margin: 3px 0; line-height: 1.6; }
.markdown-body :deep(a) { color: var(--brand, #5f4dbf); text-decoration: none; }
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(hr) { border: none; height: 1px; background: #e0e0e0; margin: 20px 0; }
</style>