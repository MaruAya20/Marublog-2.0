<script setup lang="ts">
import { computed, onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, extractError } from '@/api/client'
import { postApi } from '@/api'
import PostCard from '@/components/PostCard.vue'
import type { User } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const profile = ref<User | null>(null)
const open = ref(true)
const editing = ref(false)
const editName = ref('')
const editBio = ref('')
const editAvatar = ref('')
const saving = ref(false)
const uploading = ref(false)
const msg = ref('')
const error = ref('')

const isMe = computed(() => {
  return auth.isLoggedIn && auth.user?.name === route.params.name
})

const isGuest = computed(() => profile.value?.role === 'GUEST')
const isAdmin = computed(() => profile.value?.role === 'ADMIN')

const LEVEL_NAMES = ['幼丸', '新丸', '小小丸', '小丸', '中丸', '大丸', '大大丸', '超大丸', '巨丸', '饭纲丸', '射命丸']
const LEVEL_COLORS = ['#9e9e9e', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#8bc34a', '#3f51b5', '#245a88', '#ef4045']

const badge = computed(() => {
  if (!profile.value) return null
  if (profile.value.role === 'GUEST') return null
  if (profile.value.role === 'ADMIN') {
    return { text: '姬海棠 LV.-1', color: '#a72aab', bg: '#a72aab26', extraTag: 'ADMIN' }
  }
  const lv = Math.max(0, Math.min(10, profile.value.level || 0))
  const color = LEVEL_COLORS[lv]
  return { text: `${LEVEL_NAMES[lv]} LV.${lv}`, color, bg: color + '26' }
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

const POST_PAGE_SIZE = 8
const postSlugs = ref<string[]>([])
const postsLoading = ref(false)
const postsHasMore = ref(true)
const postsError = ref('')
const postsEmpty = ref(false)
let postPageRef = 1
let postLoadingRef = false
let postHasMoreRef = true
let postBusyRef = false
let scrollHandlerBound = false

async function loadMorePosts() {
  if (!profile.value?.id) return
  if (postBusyRef || postLoadingRef || !postHasMoreRef) return
  postBusyRef = true
  postsLoading.value = true
  postLoadingRef = true
  postsError.value = ''
  try {
    const page = postPageRef
    const data = await postApi.list({
      page,
      pageSize: POST_PAGE_SIZE,
      authorId: profile.value.id
    })
    const newSlugs = (data.posts || []).map((p: any) => p.slug)
    postSlugs.value = [...postSlugs.value, ...newSlugs.filter(s => !postSlugs.value.includes(s))]
    const more = Boolean(data.hasMore)
    postsHasMore.value = more
    postHasMoreRef = more
    if (more) postPageRef = page + 1
    if (page === 1 && newSlugs.length === 0) postsEmpty.value = true
  } catch (err) {
    postsError.value = extractError(err)
  } finally {
    postBusyRef = false
    postsLoading.value = false
    postLoadingRef = false
  }
}

function onScroll() {
  if (!profile.value?.id) return
  if (!postHasMoreRef || postLoadingRef) return
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
  const vh = window.innerHeight || 0
  const docH = document.documentElement.scrollHeight || 0
  if (scrollTop + vh >= docH - 200) {
    loadMorePosts()
  }
}

function resetPostState() {
  postSlugs.value = []
  postsLoading.value = false
  postsHasMore.value = true
  postsError.value = ''
  postsEmpty.value = false
  postPageRef = 1
  postLoadingRef = false
  postHasMoreRef = true
  postBusyRef = false
}

function bindScroll() {
  if (!scrollHandlerBound) {
    window.addEventListener('scroll', onScroll)
    scrollHandlerBound = true
  }
}
function unbindScroll() {
  if (scrollHandlerBound) {
    window.removeEventListener('scroll', onScroll)
    scrollHandlerBound = false
  }
}

async function loadAllAfterProfile() {
  resetPostState()
  bindScroll()
  await nextTick()
  await loadMorePosts()
}

function startEdit() {
  if (!profile.value) return
  editName.value = profile.value.name || ''
  editBio.value = profile.value.signature || ''
  editAvatar.value = profile.value.avatar || ''
  msg.value = ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  msg.value = ''
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    const tip = '只能上传图片文件（jpg/png/gif/webp）'
    msg.value = tip
    alert(tip)
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    const tip = '文件超过 10MB 限制，请压缩后再试'
    msg.value = tip
    alert(tip)
    return
  }
  uploading.value = true
  msg.value = '上传中...'
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post('/upload?kind=avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    editAvatar.value = res.data.url
    msg.value = '头像已上传'
  } catch (err) {
    const tip = extractError(err) || '上传失败，请重试'
    msg.value = tip
    alert('头像上传失败：' + tip)
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function saveEdit() {
  if (!profile.value) return
  saving.value = true
  error.value = ''
  msg.value = ''
  try {
    const patch: Record<string, unknown> = {}
    if (editName.value !== profile.value.name) patch.name = editName.value.trim()
    if (editBio.value !== (profile.value.signature || '')) patch.signature = editBio.value.trim()
    if (editAvatar.value !== (profile.value.avatar || '')) patch.avatar = editAvatar.value.trim()
    if (Object.keys(patch).length === 0) {
      editing.value = false
      return
    }
    const res = await api.patch('/me/profile', patch)
    const updated = res.data.user || res.data
    profile.value = updated
    auth.user = updated
    localStorage.setItem('user', JSON.stringify(updated))
    editing.value = false
    msg.value = '已保存'
  } catch (err) {
    error.value = extractError(err)
    msg.value = error.value
  } finally {
    saving.value = false
  }
}

async function deleteAccount() {
  if (!profile.value) return
  if (isAdmin.value) {
    msg.value = '管理员账号不能被删除'
    return
  }
  const label = profile.value.name || profile.value.email || `用户#${profile.value.id}`
  const input = window.prompt(`要删除账号「${label}」，请输入该用户名确认：`)
  if (input === null) return
  if ((input || '').trim() !== (profile.value.name || '')) {
    alert('输入的用户名不匹配，已取消删除')
    return
  }
  const ok = window.confirm('再次确认：确定要删除你的账号以及所有相关数据吗？此操作不可恢复！')
  if (!ok) return
  try {
    await api.delete('/me')
    auth.logout()
    router.push('/')
  } catch (err) {
    msg.value = extractError(err)
  }
}

onMounted(async () => {
  await loadProfile()
  if (profile.value?.id) loadAllAfterProfile()
})

watch(() => route.params.name, async () => {
  editing.value = false
  open.value = true
  msg.value = ''
  error.value = ''
  unbindScroll()
  resetPostState()
  profile.value = null
  await loadProfile()
  if (profile.value?.id) loadAllAfterProfile()
})

onBeforeUnmount(unbindScroll)
</script>

<template>
  <div class="profile-page">
    <div v-if="error" class="error-card">{{ error }}</div>
    <div v-else-if="!profile" class="loading-card">加载中...</div>

    <template v-else>
      <div class="card profile-card">
        <div class="profile-main" @click="open = !open">
          <div class="avatar-circle">
            <img v-if="profile.avatar"
                 :src="profile.avatar" alt="头像" class="avatar-img" />
            <span v-else class="avatar-fallback">{{ (profile.name || '?')[0] }}</span>
          </div>
          <div class="profile-info">
            <div class="name-row">
              <span class="user-name">{{ profile.name || '未命名' }}</span>
              <template v-if="badge">
                <span class="level-badge level-badge-clickable" @click="router.push('/levels')"
                      :style="{ borderColor: badge.color, color: badge.color, background: badge.bg }">
                  {{ badge.text }}
                </span>
                <span v-if="badge.extraTag" class="level-badge"
                      :style="{ borderColor: '#a72aab', color: '#a72aab', background: '#a72aab26' }">
                  {{ badge.extraTag }}
                </span>
              </template>
            </div>
            <div class="user-sign">
              {{ isGuest ? (profile.signature || '') : (profile.signature || '你还没有个性签名哦~') }}
            </div>
            <div v-if="profile.xp !== undefined" class="xp-row">
              XP {{ profile.xp }}
            </div>
          </div>
          <div class="chevron" :class="{ open }">▾</div>
        </div>

        <div v-if="open" class="profile-actions">
          <div v-if="!editing" class="action-buttons">
            <button v-if="isMe && !isGuest" class="btn-nav" @click.stop="startEdit">
              ✏️ 编辑个人信息
            </button>
          </div>

          <div v-else class="edit-form" @click.stop>
            <div class="form-row">
              <label>昵称</label>
              <input v-model="editName" maxlength="16" :disabled="isGuest"
                     placeholder="输入昵称" />
            </div>
            <div class="form-row">
              <label>个性签名</label>
              <input v-model="editBio" maxlength="120" :disabled="isGuest"
                     placeholder="个性签名（可选）" />
            </div>
            <div class="form-row">
              <label>头像</label>
              <div class="avatar-edit">
                <div class="avatar-circle small">
                  <img v-if="editAvatar" :src="editAvatar" class="avatar-img" />
                  <span v-else class="avatar-fallback">{{ (editName || '?')[0] }}</span>
                </div>
                <input type="file" accept="image/*" :disabled="isGuest || uploading"
                       @change="onFileChange" />
                <span v-if="uploading" class="hint">上传中...</span>
              </div>
            </div>

            <div class="form-actions">
              <button v-if="!isGuest" class="btn-primary" :disabled="saving" @click="saveEdit">
                {{ saving ? '保存中...' : '💾 保存' }}
              </button>
              <button class="btn-nav" @click="cancelEdit">取消</button>
              <button v-if="isMe && !isAdmin" class="btn-danger" @click="deleteAccount">
                🗑️ 删除账号
              </button>
              <span v-if="msg" class="hint">{{ msg }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="posts-section">
        <h3 class="posts-title">{{ (profile?.name || '用户') }} 的文章</h3>

        <template v-if="postsError">
          <div class="posts-hint posts-error">{{ postsError }}</div>
        </template>
        <template v-else-if="postsEmpty">
          <div class="posts-hint">{{ profile?.name || '该用户' }} 还没有发布文章~</div>
        </template>
        <template v-else-if="postSlugs.length === 0 && postsLoading">
          <div class="posts-hint">加载中...</div>
        </template>
        <template v-else>
          <PostCard v-for="slug in postSlugs" :key="slug" :slug="slug" />
          <div v-if="postsLoading" class="posts-hint">加载更多...</div>
          <div v-else-if="!postsHasMore" class="posts-hint">—— 没有更多了 ——</div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 720px;
  margin: 24px auto;
  padding: 0 16px;
}
.card {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  padding: 16px;
}
.profile-card {
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.profile-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.profile-main {
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
}
.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--border, #e5e7eb);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  flex-shrink: 0;
}
.avatar-circle.small {
  width: 40px;
  height: 40px;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-fallback {
  font-size: 28px;
  font-weight: 600;
  color: #6b7280;
}
.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.user-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text, #111827);
}
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  border-radius: 10px;
  white-space: nowrap;
}
.level-badge-clickable {
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.level-badge-clickable:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.user-sign {
  font-size: 13px;
  color: var(--muted, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.xp-row {
  font-size: 12px;
  color: var(--muted, #9ca3af);
}
.chevron {
  color: var(--muted, #9ca3af);
  font-size: 14px;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron.open {
  transform: rotate(180deg);
}
.profile-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border, #e5e7eb);
  display: grid;
  gap: 12px;
}
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-nav {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--border, #e5e7eb);
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--text, #374151);
  transition: background 0.1s;
}
.btn-nav:hover {
  background: var(--hover, rgba(0,0,0,0.05));
}
.btn-primary {
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  background: var(--brand, #5f4dbf);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.btn-primary:hover:not(:disabled) {
  background: var(--brand-hover, #4a3da8);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-danger {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(248,113,113,0.6);
  background: #7f1d1d;
  color: #fee2e2;
  cursor: pointer;
  font-size: 14px;
}
.btn-danger:hover {
  background: #991b1b;
}
.edit-form {
  display: grid;
  gap: 10px;
}
.form-row {
  display: grid;
  gap: 4px;
}
.form-row label {
  font-size: 12px;
  color: var(--muted, #6b7280);
}
.form-row input[type="text"],
.form-row input:not([type]),
.form-row textarea {
  padding: 8px 10px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px;
  background: transparent;
  color: var(--text, #111827);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}
.form-row input:focus {
  border-color: var(--brand, #5f4dbf);
}
.form-row input:disabled {
  opacity: 0.6;
}
.avatar-edit {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-edit input[type="file"] {
  font-size: 13px;
  color: var(--muted, #6b7280);
}
.form-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 4px;
}
.hint {
  font-size: 12px;
  color: var(--muted, #6b7280);
}
.error-card {
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
}
.loading-card {
  text-align: center;
  padding: 40px;
  color: var(--muted, #6b7280);
}
.posts-section {
  margin-top: 24px;
}
.posts-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text, #111827);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border, #e5e7eb);
}
.posts-hint {
  text-align: center;
  padding: 20px;
  color: var(--muted, #6b7280);
  font-size: 14px;
}
.posts-error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
</style>