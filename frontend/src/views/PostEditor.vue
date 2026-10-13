<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, tagApi, extractError } from '@/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const slug = computed(() => route.params.slug as string | undefined)
const isEdit = computed(() => !!slug.value)

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

const parsedTags = computed(() =>
  tagsInput.value.split(',').map(s => s.trim()).filter(Boolean)
)

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
      tagsInput.value = (post.tags || []).join(', ')
      status.value = (post.status as any) === 'draft' ? 'draft' : 'published'
    } catch (err) {
      error.value = extractError(err)
    } finally {
      loading.value = false
    }
  }
})

function insertTag(tag: string) {
  const current = parsedTags.value
  if (current.includes(tag)) return
  tagsInput.value = current.length ? current.join(', ') + ', ' + tag : tag
}

async function handleSubmit(asDraft = false) {
  if (!title.value.trim()) { alert('标题不能为空'); return }
  if (!content.value.trim()) { alert('内容不能为空'); return }

  submitting.value = true
  error.value = ''
  try {
    const payload: any = {
      title: title.value.trim(),
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
    } else {
      result = await postApi.create(payload)
    }
    router.push(`/post/${result.slug}`)
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
        <label>标签（逗号分隔）</label>
        <input v-model="tagsInput" placeholder="如: Vue, Spring Boot, 技术" />
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
        <textarea
          v-model="content"
          placeholder="支持 Markdown 格式..."
          rows="18"
          style="font-family: monospace;"
        ></textarea>
      </div>

      <div class="form-row">
        <label>定时发布（可选）</label>
        <input type="datetime-local" v-model="scheduledAt" />
      </div>

      <div class="form-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn-primary" :disabled="submitting" @click="handleSubmit(false)">
          {{ submitting ? '发布中...' : (isEdit ? '保存修改' : '发布') }}
        </button>
        <button class="btn-ghost" :disabled="submitting" @click="handleSubmit(true)">
          存为草稿
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
.danger { color: #e74c3c; border-color: #e74c3c; }
.tag.active { background: var(--primary, #4a9eff); color: #fff; }
</style>