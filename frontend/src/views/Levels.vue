<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { levelsApi } from '@/api'

interface Level {
  level: number
  name: string
  color: string
  threshold: number
}

const levels = ref<Level[]>([])

onMounted(async () => {
  levels.value = await levelsApi.list().catch(() => [])
})
</script>

<template>
  <div>
    <h1 class="page-title">等级系统</h1>
    <p style="margin-bottom: 20px; color: var(--text-muted); font-size: 14px;">
      等级公式：threshold(L) = round(1,000,000 × (L/10)²)
    </p>
    <div class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border); text-align: left;">
            <th style="padding: 8px;">等级</th>
            <th style="padding: 8px;">名称</th>
            <th style="padding: 8px;">颜色</th>
            <th style="padding: 8px;">所需 XP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in levels" :key="l.level" style="border-bottom: 1px solid var(--border);">
            <td style="padding: 10px;">Lv.{{ l.level }}</td>
            <td style="padding: 10px;">{{ l.name }}</td>
            <td style="padding: 10px;">
              <span class="level-badge" :style="{ background: l.color }">{{ l.color }}</span>
            </td>
            <td style="padding: 10px;">{{ l.threshold.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>