<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postApi, tagApi, trackApi } from '@/api'
import type { Post, TagDef } from '@/types'
import ImageViewer from '@/components/ImageViewer.vue'

const route = useRoute()
const router = useRouter()

const LEVEL_NAMES = ['幼丸', '新丸', '小小丸', '小丸', '中丸', '大丸', '大大丸', '超大丸', '巨丸', '饭纲丸', '射命丸']
const LEVEL_COLORS = ['#9e9e9e', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#8bc34a', '#3f51b5', '#245a88', '#ef4045']
const ADMIN_BADGE_NAME = '姬海棠'
const ADMIN_BADGE_COLOR = '#a72aabff'

function getLevelBadge(level: number | undefined, role?: string) {
  if (role === 'ADMIN') return { text: ADMIN_BADGE_NAME, color: ADMIN_BADGE_COLOR, bg: ADMIN_BADGE_COLOR + '26' }
  const lv = Math.max(0, Math.min(10, level || 0))
  return { text: `${LEVEL_NAMES[lv]}`, color: LEVEL_COLORS[lv], bg: LEVEL_COLORS[lv] + '26' }
}

const posts = ref<Post[]>([])
const tags = ref<TagDef[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 15
const activeTag = ref<string | null>(null)
const loading = ref(false)
const viewerOpen = ref(false)
const viewerSrc = ref('')

function openViewer(src: string) {
  viewerSrc.value = src
  viewerOpen.value = true
}

function goUser(name?: string) {
  if (name) router.push(`/user/${encodeURIComponent(name)}`)
}

function onThumbError(e: Event, origUrl?: string) {
  const img = e.target as HTMLImageElement
  if (origUrl && img.src !== origUrl) {
    img.src = origUrl
  } else {
    img.style.visibility = 'hidden'
  }
}

async function load() {
  loading.value = true
  try {
    const params: { page: number; pageSize: number; tag?: string } = { page: page.value, pageSize }
    if (activeTag.value) params.tag = activeTag.value
    const data = await postApi.list(params)
    posts.value = (data.posts || []).filter((p: any) => p.status !== 'draft')
    total.value = data.total
    trackApi.view({ route: '/', tag: activeTag.value || undefined })
  } finally {
    loading.value = false
  }
}

function gotoPage(p: number) {
  page.value = p
  load()
}

onMounted(async () => {
  tags.value = await tagApi.list().catch(() => [])
  await load()
})

watch(activeTag, () => {
  page.value = 1
  load()
})

const totalPages = () => Math.max(1, Math.ceil(total.value / pageSize))
const hasNext = () => page.value < totalPages()
const hasPrev = () => page.value > 1

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function darken(hex: string, factor = 0.55): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = Math.round(rgb[0] * (1 - factor))
  const g = Math.round(rgb[1] * (1 - factor))
  const b = Math.round(rgb[2] * (1 - factor))
  return `rgb(${r}, ${g}, ${b})`
}

function getTagStyle(name: string) {
  const t = tags.value.find(x => x.name === name)
  if (!t) return {}
  const textColor = t.color || '#888'
  const bgColor = darken(textColor, 0.55)
  const borderColor = darken(textColor, 0.4)
  return {
    background: bgColor,
    color: textColor,
    border: `1px solid ${borderColor}`
  }
}
</script>

<template>
  <div>
    <div v-if="tags.length" style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
      <span class="tag" :class="{ active: !activeTag }" @click="activeTag = null">全部</span>
      <span
        v-for="t in tags"
        :key="t.id"
        class="tag"
        :class="{ active: activeTag === t.name }"
        :style="getTagStyle(t.name)"
        @click="activeTag = t.name"
      >{{ t.name }}</span>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="posts.length === 0" class="empty">暂无文章</div>

    <template v-else>
      <div v-for="p in posts" :key="p.id" class="post-card">
        <div class="post-main">
          <div class="title-row">
            <router-link :to="`/post/${p.slug}`" class="post-title">{{ p.title }}</router-link>
          </div>
          <div class="post-meta">
            <router-link
              v-if="p.author"
              class="author-link"
              :to="`/user/${encodeURIComponent(p.author.name || '')}`"
              @click.stop
            >
              <img
                v-if="p.author.avatar"
                :src="p.author.avatar"
                class="mini-avatar"
                alt="头像"
              />
              <span v-else class="mini-avatar mini-avatar-fb">{{ (p.author.name || '?')[0] }}</span>
              <span class="author-name">{{ p.author.name }}</span>
              <span v-if="p.author.role && p.author.role !== 'GUEST'" class="level-badge level-badge-clickable" @click.stop="router.push('/levels')" :style="{ background: getLevelBadge(p.author.level, p.author.role).bg, color: getLevelBadge(p.author.level, p.author.role).color, borderColor: getLevelBadge(p.author.level, p.author.role).color + '40' }">
                {{ getLevelBadge(p.author.level, p.author.role).text }}
              </span>
            </router-link>
            <span v-if="p.author" class="meta-dot">·</span>
            <span v-if="p.publishedAt">{{ new Date(p.publishedAt).toLocaleDateString() }}</span>
            <span class="meta-dot">·</span>
            <span>💬 {{ p.comments ?? 0 }}</span>
            <span class="meta-dot">·</span>
            <span>♡ {{ p.likes ?? 0 }}</span>
          </div>
          <p v-if="p.excerpt" class="post-excerpt">{{ p.excerpt }}</p>
          <div v-if="p.tags?.length" class="post-tags">
            <span v-for="t in p.tags" :key="t" class="tag" :style="getTagStyle(t)">{{ t }}</span>
          </div>
        </div>
        <div
          v-if="p.previewThumbs?.length"
          class="post-thumbs"
        >
          <img
            v-for="(thumb, i) in p.previewThumbs.slice(0, 3)"
            :key="i"
            :src="thumb"
            class="thumb-img"
            @error="onThumbError($event, p.previewImages?.[i])"
            @click="openViewer(p.previewImages?.[i] || thumb)"
          />
        </div>
      </div>
    </template>

    <div v-if="totalPages() > 1" class="pagination">
      <button :disabled="!hasPrev()" @click="gotoPage(page - 1)">◀ 上一页</button>
      <span class="page-info">{{ page }} / {{ totalPages() }} (共 {{ total }} 篇)</span>
      <button :disabled="!hasNext()" @click="gotoPage(page + 1)">下一页 ▶</button>
    </div>

    <ImageViewer :open="viewerOpen" :src="viewerSrc" @close="viewerOpen = false" />
  </div>
</template>

<style scoped>
.post-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  margin-bottom: 14px;
  transition: box-shadow 0.18s, transform 0.18s;
}
.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.post-main { flex: 1; min-width: 0; }
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
  line-height: 1.4;
}
.post-title:hover { color: var(--primary, #4a9eff); }
.draft-badge {
  font-size: 12px;
  color: #e67e22;
  background: #fff3e0;
  padding: 1px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.meta-dot { color: #ccc; }
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
.level-badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  border: 1px solid;
  line-height: 1.4;
  font-weight: 500;
}
.level-badge-clickable {
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.level-badge-clickable:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.post-excerpt {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.post-thumbs {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-self: center;
}
.thumb-img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: zoom-in;
  transition: transform 0.15s box-shadow 0.15s;
  flex-shrink: 0;
}
.thumb-img:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 14px;
}
.pagination button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}
.pagination button:hover:not(:disabled) {
  background: var(--primary, #4a9eff);
  color: #fff;
  border-color: var(--primary, #4a9eff);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-info {
  font-size: 13px;
  color: #666;
}
@media (max-width: 640px) {
  .post-card { flex-direction: column; }
  .post-thumbs { flex-direction: row; justify-content: flex-start; }
  .thumb-img { width: 70px; height: 70px; }
}
</style>