<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { postApi, tagApi, trackApi } from '@/api'
import type { Post, TagDef } from '@/types'

const route = useRoute()
const posts = ref<Post[]>([])
const tags = ref<TagDef[]>([])
const total = ref(0)
const activeTag = ref<string | null>(null)
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const params: { page: number; pageSize: number; tag?: string } = { page: 1, pageSize: 10 }
    if (activeTag.value) params.tag = activeTag.value
    const data = await postApi.list(params)
    posts.value = data.posts
    total.value = data.total
    trackApi.view({ route: '/', tag: activeTag.value || undefined })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  tags.value = await tagApi.list().catch(() => [])
  await load()
})

watch(activeTag, () => load())
</script>

<template>
  <div>
    <div v-if="tags.length" style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
      <span
        class="tag"
        :class="{ active: !activeTag }"
        @click="activeTag = null"
      >全部</span>
      <span
        v-for="t in tags"
        :key="t.id"
        class="tag"
        :class="{ active: activeTag === t.name }"
        @click="activeTag = t.name"
      >{{ t.name }}</span>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="posts.length === 0" class="empty">
      暂无文章
    </div>

    <template v-else>
      <div v-for="p in posts" :key="p.id" class="post-item">
        <router-link :to="`/post/${p.slug}`" class="post-title">
          {{ p.title }}
        </router-link>
        <div class="post-meta">
          <span v-if="p.publishedAt">{{ new Date(p.publishedAt).toLocaleDateString() }}</span>
          <span v-if="p.author"> · {{ p.author.name }}</span>
          <span v-if="p.likes !== undefined"> · ❤️ {{ p.likes }}</span>
        </div>
        <p v-if="p.excerpt" class="post-excerpt">{{ p.excerpt }}</p>
        <div v-if="p.tags?.length" class="post-tags">
          <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>
    </template>
  </div>
</template>