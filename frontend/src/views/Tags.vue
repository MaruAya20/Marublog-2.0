<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { tagApi } from '@/api'
import type { TagDef } from '@/types'

const tags = ref<TagDef[]>([])

onMounted(async () => {
  tags.value = await tagApi.list().catch(() => [])
})
</script>

<template>
  <div>
    <h1 class="page-title">所有标签</h1>
    <div v-if="tags.length === 0" class="empty">暂无标签</div>
    <div v-else style="display: flex; gap: 10px; flex-wrap: wrap;">
      <router-link
        v-for="t in tags"
        :key="t.id"
        :to="`/?tag=${encodeURIComponent(t.name)}`"
        class="tag"
        :style="{ background: (t.bg || '#f3f3f3'), color: (t.color || '#555') }"
      >{{ t.name }}</router-link>
    </div>
  </div>
</template>