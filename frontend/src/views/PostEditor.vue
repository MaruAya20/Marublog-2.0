<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, tagApi, uploadApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const slug = computed(() => route.params.slug as string | undefined)
const isEdit = computed(() => !!slug.value)

const MAX_IMAGES = 3
const MAX_AUDIOS = 2
const MAX_SIZE = 50 * 1024 * 1024
const AUTOSAVE_INTERVAL = 30000
const DRAFT_LOCAL_KEY = 'marublog_autosave_draft_slug'

interface ImageItem { url: string; name: string; snippet: string }
interface AudioItem { url: string; name: string; snippet: string }

const loading = ref(false)
const title = ref('')
const content = ref('')
const excerpt = ref('')
const tagsInput = ref('')
const status = ref<'published' | 'draft'>('published')
const scheduledAt = ref('')
const presetTags = ref<string[]>([])
const submitting = ref(false)
const error = ref('')
const editorRef = ref<HTMLTextAreaElement | null>(null)

const images = ref<ImageItem[]>([])
const audios = ref<AudioItem[]>([])

const autosaveTimer = ref<number | null>(null)
const debounceTimer = ref<number | null>(null)
const lastSavedSnapshot = ref('')
const draftSlug = ref<string | null>(null)
const autosaveStatus = ref('')

function buildSnapshot() {
  return JSON.stringify({ t: title.value, c: content.value, e: excerpt.value, tags: tagsInput.value })
}

async function autosave() {
  if (!auth.isLoggedIn) return
  const snap = buildSnapshot()
  if (snap === lastSavedSnapshot.value) return
  if (!title.value.trim() && !content.value.trim()) return

  try {
    const payload: any = {
      title: title.value.trim() || '(未命名草稿)',
      content: content.value,
      excerpt: excerpt.value.trim() || undefined,
      tags: parsedTags.value,
      status: 'draft',
    }
    let result
    if (isEdit.value && slug.value) {
      result = await postApi.update(slug.value, payload)
    } else if (draftSlug.value) {
      result = await postApi.update(draftSlug.value, payload)
    } else {
      result = await postApi.create(payload)
      draftSlug.value = result.slug
      localStorage.setItem(DRAFT_LOCAL_KEY, result.slug)
    }
    lastSavedSnapshot.value = snap
    autosaveStatus.value = `自动保存于 ${new Date().toLocaleTimeString()}`
  } catch (err) {
    autosaveStatus.value = '自动保存失败'
  }
}

function triggerDebouncedAutosave() {
  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  debounceTimer.value = window.setTimeout(() => {
    autosave()
  }, 3000)
}

function parseMdMedia(md: string) {
  const imgs: ImageItem[] = []
  const auds: AudioItem[] = []
  if (!md) return { imgs, auds }
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let m: RegExpExecArray | null
  while ((m = imgRegex.exec(md))) {
    const name = m[1] || m[2].split('/').pop() || 'image'
    imgs.push({ url: m[2], name, snippet: m[0] })
  }
  const audRegex = /\[audio:([^\]]*)\]\(([^)]+)\)/g
  while ((m = audRegex.exec(md))) {
    const name = m[1] || m[2].split('/').pop() || 'audio'
    auds.push({ url: m[2], name, snippet: m[0] })
  }
  return { imgs, auds }
}

function clearAll() {
  if (!confirm('确定要清空所有内容吗？（不会删除已上传的文件）')) return
  title.value = ''
  content.value = ''
  excerpt.value = ''
  tagsInput.value = ''
  images.value = []
  audios.value = []
  autosaveStatus.value = ''
  lastSavedSnapshot.value = ''
  draftSlug.value = null
  localStorage.removeItem(DRAFT_LOCAL_KEY)
}

onMounted(async () => {
  if (!auth.isLoggedIn) {
    alert('请先登录')
    router.push('/login')
    return
  }
  try {
    const tagRes = await tagApi.list()
    presetTags.value = Array.isArray(tagRes) ? tagRes.map((t: any) => t.name || t).filter(Boolean) : []
  } catch {}

  if (isEdit.value && slug.value) {
    loading.value = true
    try {
      const post = await postApi.getBySlug(slug.value)
      title.value = post.title
      content.value = post.content || ''
      excerpt.value = post.excerpt || ''
      tagsInput.value = (post.tags || []).join(' ')
      status.value = (post.status as any) === 'draft' ? 'draft' : 'published'
      const { imgs, auds } = parseMdMedia(content.value)
      images.value = imgs.slice(0, MAX_IMAGES)
      audios.value = auds.slice(0, MAX_AUDIOS)
      lastSavedSnapshot.value = buildSnapshot()
    } catch (err) {
      error.value = extractError(err)
    } finally {
      loading.value = false
    }
  } else {
    const savedSlug = localStorage.getItem(DRAFT_LOCAL_KEY)
    if (savedSlug) {
      try {
        const post = await postApi.getBySlug(savedSlug)
        if (post.status === 'draft' && post.authorId === auth.user?.id) {
          draftSlug.value = savedSlug
          title.value = post.title === '(未命名草稿)' ? '' : post.title
          content.value = post.content || ''
          excerpt.value = post.excerpt || ''
          tagsInput.value = (post.tags || []).join(' ')
          status.value = 'draft'
          const { imgs, auds } = parseMdMedia(content.value)
          images.value = imgs.slice(0, MAX_IMAGES)
          audios.value = auds.slice(0, MAX_AUDIOS)
          lastSavedSnapshot.value = buildSnapshot()
          autosaveStatus.value = '已恢复上次的草稿'
        }
      } catch {}
    }
  }

  autosaveTimer.value = window.setInterval(autosave, AUTOSAVE_INTERVAL)

  window.addEventListener('beforeunload', handleBeforeUnload)
})

function handleBeforeUnload() {
  if (lastSavedSnapshot.value !== buildSnapshot() && (title.value.trim() || content.value.trim())) {
    autosave()
    return '有未保存的内容，确定要离开吗？'
  }
  return undefined
}

onUnmounted(() => {
  if (autosaveTimer.value) {
    clearInterval(autosaveTimer.value)
    autosaveTimer.value = null
  }
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
    debounceTimer.value = null
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

watch([title, content, excerpt, tagsInput], () => {
  if (lastSavedSnapshot.value !== buildSnapshot()) {
    autosaveStatus.value = '有未保存的更改...'
    triggerDebouncedAutosave()
  }
})

const parsedTags = computed(() =>
  tagsInput.value.split(' ').map(s => s.trim()).filter(Boolean)
)

function insert(before: string, after = '') {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart ?? content.value.length
  const end = el.selectionEnd ?? content.value.length
  const selected = content.value.slice(start, end)
  content.value =
    content.value.slice(0, start) + before + selected + after + content.value.slice(end)
  setTimeout(() => {
    el.focus()
    el.selectionStart = start + before.length
    el.selectionEnd = start + before.length + selected.length
  }, 0)
}

function insertTag(tag: string) {
  const current = parsedTags.value
  if (current.includes(tag)) return
  tagsInput.value = current.length ? current.join(' ') + ' ' + tag : tag
}

async function handleImageFiles(files: FileList | null) {
  if (!files || !files.length) return
  const remaining = MAX_IMAGES - images.value.length
  if (remaining <= 0) {
    alert(`最多只能上传 ${MAX_IMAGES} 张图片`)
    return
  }
  const toUpload = Array.from(files).slice(0, remaining)
  for (const file of toUpload) {
    if (!file.type.startsWith('image/')) { alert('只能上传图片'); continue }
    if (file.size > MAX_SIZE) { alert(`${file.name} 超过 10MB`); continue }
    try {
      const res = await uploadApi.upload(file)
      const safeName = res.name.replace(/\.[^.]+$/, '')
      const snippet = `\n![${safeName}](${res.url})\n`
      content.value += snippet
      images.value.push({ url: res.url, name: res.name, snippet })
    } catch (err) {
      alert(`上传失败: ${extractError(err)}`)
    }
  }
}

async function handleAudioFile(file: File | null) {
  if (!file) return
  if (audios.value.length >= MAX_AUDIOS) {
    alert(`最多只能上传 ${MAX_AUDIOS} 个音频`)
    return
  }
  if (!file.type.startsWith('audio/')) { alert('只能上传音频'); return }
  if (file.size > MAX_SIZE) { alert('文件超过 10MB'); return }
  try {
    const res = await uploadApi.upload(file)
    const safeName = res.name.replace(/\.[^.]+$/, '')
    const snippet = `\n[audio:${safeName}](${res.url})\n`
    content.value += snippet
    audios.value.push({ url: res.url, name: res.name, snippet })
  } catch (err) {
    alert(`上传失败: ${extractError(err)}`)
  }
}

function removeImage(item: ImageItem) {
  images.value = images.value.filter(x => x.url !== item.url)
  content.value = content.value.replace(item.snippet, '')
}

function removeAudio(item: AudioItem) {
  audios.value = audios.value.filter(x => x.url !== item.url)
  content.value = content.value.replace(item.snippet, '')
}

async function handleSubmit(asDraft = false) {
  if (!asDraft && !title.value.trim()) { alert('标题不能为空'); return }
  if (!asDraft && !content.value.trim()) { alert('内容不能为空'); return }
  submitting.value = true
  error.value = ''
  try {
    const payload: any = {
      title: title.value.trim() || '(未命名草稿)',
      content: content.value,
      excerpt: excerpt.value.trim() || undefined,
      tags: parsedTags.value,
      status: asDraft ? 'draft' : status.value,
    }
    if (scheduledAt.value) {
      payload.scheduledAt = new Date(scheduledAt.value).toISOString()
    }
    let result
    if (isEdit.value && slug.value) {
      result = await postApi.update(slug.value, payload)
    } else if (draftSlug.value) {
      result = await postApi.update(draftSlug.value, payload)
    } else {
      result = await postApi.create(payload)
    }
    localStorage.removeItem(DRAFT_LOCAL_KEY)
    if (!asDraft) {
      draftSlug.value = null
      lastSavedSnapshot.value = ''
      autosaveStatus.value = ''
      router.push(`/post/${result.slug}`)
    } else {
      draftSlug.value = result.slug
      localStorage.setItem(DRAFT_LOCAL_KEY, result.slug)
      lastSavedSnapshot.value = buildSnapshot()
      autosaveStatus.value = `已保存为草稿 ${new Date().toLocaleTimeString()}`
    }
  } catch (err) {
    error.value = extractError(err)
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!isEdit.value || !slug.value) return
  if (!confirm('确定要删除这篇文章吗？')) return
  try {
    await postApi.remove(slug.value)
    router.push('/')
  } catch (err) {
    alert(extractError(err))
  }
}
</script>

<template>
  <div>
    <h1 style="margin-bottom: 20px;">{{ isEdit ? '编辑文章' : '写新文章' }}</h1>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="card">
      <div v-if="error" class="error" style="margin-bottom: 16px;">{{ error }}</div>

      <div class="form-row">
        <label>标题 *</label>
        <input v-model="title" placeholder="给它起个名字..." maxlength="300" />
      </div>

      <div class="form-row">
        <label>标签（空格分隔）</label>
        <input v-model="tagsInput" placeholder="例如 Vue Spring Boot 技术" />
        <div v-if="presetTags.length" style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
          <button
            v-for="t in presetTags"
            :key="t"
            type="button"
            class="tag"
            :class="{ active: parsedTags.includes(t) }"
            @click="insertTag(t)"
            style="cursor: pointer; background: transparent;"
          >
            + {{ t }}
          </button>
        </div>
      </div>

      <div class="form-row">
        <label>摘要（可选）</label>
        <textarea v-model="excerpt" placeholder="留空将自动截取..." maxlength="500" rows="2"></textarea>
      </div>

      <div class="form-row">
        <label>正文 (Markdown) *</label>
        <div class="toolbar">
          <button type="button" @click="insert('**', '**')">加粗</button>
          <button type="button" @click="insert('*', '*')">斜体</button>
          <button type="button" @click="insert('`', '`')">行内代码</button>
          <button type="button" @click="insert('\n```\n', '\n```\n')">代码块</button>
          <button type="button" @click="insert('# ')">标题</button>
          <button type="button" @click="insert('- ')">列表</button>
          <button type="button" @click="insert('[文本](链接)')">链接</button>
          <button type="button" @click="insert('![alt](https://example.com/image.jpg)')">图片占位</button>
        </div>
        <textarea
          ref="editorRef"
          v-model="content"
          placeholder="支持 Markdown 格式...&#10;&#10;图片自动插入: ![name](/api/uploads/xxx.png)&#10;音频自动插入: [audio:name](/api/uploads/xxx.mp3)"
          rows="18"
          style="font-family: monospace;"
        ></textarea>
      </div>

      <div class="form-row">
        <label>图片上传（最多 {{ MAX_IMAGES }} 张，单张最大 10MB）</label>
        <input
          type="file"
          accept="image/*"
          multiple
          :disabled="images.length >= MAX_IMAGES"
          @change="(e) => handleImageFiles((e.target as HTMLInputElement).files)"
        />
        <div v-if="images.length" class="hint">已添加图片：{{ images.length }}/{{ MAX_IMAGES }}</div>
        <div v-if="images.length" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          <div v-for="img in images" :key="img.url" class="thumb-item">
            <img :src="img.url" class="thumb" :alt="img.name" />
            <button type="button" class="thumb-close" @click="removeImage(img)">×</button>
            <div class="thumb-name">{{ img.name }}</div>
          </div>
        </div>
      </div>

      <div class="form-row">
        <label>音频上传（最多 {{ MAX_AUDIOS }} 个，单个最大 10MB）</label>
        <input
          type="file"
          accept="audio/*"
          :disabled="audios.length >= MAX_AUDIOS"
          @change="(e) => handleAudioFile(((e.target as HTMLInputElement).files || null)?.[0] || null)"
        />
        <div v-if="audios.length" class="hint">已添加音频：{{ audios.length }}/{{ MAX_AUDIOS }}</div>
        <div v-if="audios.length" style="margin-top: 8px;">
          <span v-for="a in audios" :key="a.url" style="display: inline-flex; align-items: center; margin-right: 12px; padding: 4px 10px; background: #f5f5f5; border-radius: 6px;">
            🎵 {{ a.name }}
            <button type="button" class="thumb-close" style="position: static; margin-left: 6px;" @click="removeAudio(a)">×</button>
          </span>
        </div>
      </div>

      <div class="form-row">
        <label>定时发布（可选）</label>
        <input type="datetime-local" v-model="scheduledAt" />
      </div>

      <div v-if="autosaveStatus" class="autosave-hint" :class="{ dirty: autosaveStatus.includes('未保存') }">
        💾 {{ autosaveStatus }}
      </div>

      <div class="form-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn-primary" :disabled="submitting" @click="handleSubmit(false)">
          {{ submitting ? '发布中...' : (isEdit ? '保存修改' : '发布') }}
        </button>
        <button class="btn-ghost" :disabled="submitting" @click="handleSubmit(true)">
          存为草稿
        </button>
        <button class="btn-ghost" :disabled="submitting" @click="clearAll">
          清空文章
        </button>
        <button v-if="isEdit" class="btn-ghost danger" :disabled="submitting" @click="handleDelete">
          删除文章
        </button>
        <button class="btn-ghost" @click="router.back()">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autosave-hint {
  font-size: 12px;
  color: #27ae60;
  background: #eafaf1;
  padding: 6px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  border: 1px solid #b8e0cc;
}
.autosave-hint.dirty {
  color: #e67e22;
  background: #fef5e7;
  border-color: #f3c48a;
}
.danger { color: #e74c3c; border-color: #e74c3c; }
.tag.active { background: var(--primary, #4a9eff); color: #fff; }
.toolbar {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
  padding: 6px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}
.toolbar button {
  padding: 4px 10px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.toolbar button:hover { background: var(--primary, #4a9eff); color: #fff; border-color: var(--primary, #4a9eff); }
.hint { font-size: 12px; color: #888; margin-top: 4px; }
.thumb-item {
  position: relative;
  width: 90px;
  text-align: center;
}
.thumb {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}
.thumb-close {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #e74c3c;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
}
.thumb-name {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>