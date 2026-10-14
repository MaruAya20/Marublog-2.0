<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { tagApi } from '@/api'
import type { TagDef } from '@/types'

const tags = ref<TagDef[]>([])

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').trim()
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  }
}

function darken(rgb: { r: number; g: number; b: number }, factor: number) {
  return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`
}

function getTagStyle(name: string) {
  const t = tags.value.find(x => x.name === name)
  if (!t || !t.color) return {}
  const rgb = hexToRgb(t.color)
  if (!rgb) return { color: t.color }
  return {
    color: t.color,
    background: darken(rgb, 0.45),
    border: `1px solid ${darken(rgb, 0.6)}`,
  }
}

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
        :style="getTagStyle(t.name)"
      >{{ t.name }}</router-link>
    </div>
  </div>
</template>