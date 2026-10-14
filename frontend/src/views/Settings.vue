<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { preferenceApi, uploadApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const urlInput = ref('')
const currentWallpaper = ref('')
const opacity = ref(0.35)
const urlLocked = ref(false)
const saving = ref(false)
const savingMsg = ref('')
const uploading = ref(false)
const uploadMsg = ref('')

function applyToDOM(u?: string, o?: number) {
  const root = document.documentElement
  const hasUrl = u && u.length > 0
  const finalUrl = hasUrl ? `url("${u}")` : 'none'
  root.style.setProperty('--wallpaper-url', finalUrl)
  if (typeof o === 'number' && !Number.isNaN(o)) {
    const v = Math.min(1, Math.max(0, o))
    root.style.setProperty('--wallpaper-opacity', String(v))
  }
}

watch([currentWallpaper, opacity], ([u, o]) => {
  applyToDOM(u.trim(), o)
}, { immediate: false })

onMounted(async () => {
  try {
    const pref = await preferenceApi.get()
    opacity.value = pref.opacity ?? 0.35
    currentWallpaper.value = pref.wallpaper || ''
    urlLocked.value = !!(pref.wallpaper && pref.wallpaperHidden)
    urlInput.value = urlLocked.value ? '' : (pref.wallpaper || '')
    applyToDOM(pref.wallpaper || undefined, opacity.value)
  } catch {}
})

async function saveSettings() {
  saving.value = true
  savingMsg.value = ''
  try {
    const payload: Record<string, unknown> = { opacity: opacity.value }
    if (!urlLocked.value) {
      payload.wallpaper = urlInput.value.trim() || null
    }
    const res = await preferenceApi.update(payload) as any
    currentWallpaper.value = res.wallpaper || ''
    urlLocked.value = !!res.wallpaperHidden
    if (urlLocked.value) {
      urlInput.value = ''
    } else {
      urlInput.value = res.wallpaper || ''
    }
    applyToDOM(currentWallpaper.value, opacity.value)
    savingMsg.value = '已保存'
    setTimeout(() => { savingMsg.value = '' }, 2000)
  } catch (err: any) {
    savingMsg.value = err?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function resetSettings() {
  saving.value = true
  savingMsg.value = ''
  try {
    await preferenceApi.update({ wallpaper: null, opacity: 0.35 })
    currentWallpaper.value = ''
    urlInput.value = ''
    opacity.value = 0.35
    urlLocked.value = false
    savingMsg.value = '已重置'
    setTimeout(() => { savingMsg.value = '' }, 2000)
  } catch (err: any) {
    savingMsg.value = err?.message || '重置失败'
  } finally {
    saving.value = false
  }
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  if (!auth.isLoggedIn) {
    uploadMsg.value = '请先登录'
    input.value = ''
    return
  }
  uploading.value = true
  uploadMsg.value = ''
  try {
    const up = await uploadApi.upload(f)
    urlLocked.value = true
    urlInput.value = ''
    currentWallpaper.value = up.url
    await preferenceApi.update({
      wallpaper: up.url,
      opacity: opacity.value,
    })
    uploadMsg.value = '已上传并应用（URL 隐藏以保护隐私）'
    setTimeout(() => { uploadMsg.value = '' }, 3000)
  } catch (err: any) {
    uploadMsg.value = err?.message || '上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function onUrlUnlocked() {
  urlLocked.value = false
  urlInput.value = ''
}
</script>

<template>
  <div class="settings-page">
    <h1 class="page-title">外观设置</h1>

    <div class="card">
      <div class="card-title">壁纸与透明度</div>

      <div class="preview-area">
        <div class="preview-bg"
             :style="{
               backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : undefined,
               opacity: opacity,
             }"></div>
        <div class="preview-label">预览 · {{ (opacity * 100).toFixed(0) }}%</div>
      </div>

      <label class="field">
        <span class="field-label">壁纸 URL</span>
        <input v-if="!urlLocked"
               v-model="urlInput"
               type="url"
               placeholder="https://..."
               class="field-input" />
        <input v-else
               type="text"
               value="（已通过服务器上传，URL 已隐藏）"
               disabled
               class="field-input field-locked" />
        <button v-if="urlLocked" class="unlock-btn" @click="onUrlUnlocked">✎ 改为自定义 URL</button>
      </label>

      <label class="field">
        <span class="field-label">透明度：{{ (opacity * 100).toFixed(0) }}%</span>
        <input v-model="opacity" type="range" min="0" max="1" step="0.01" />
      </label>

      <div class="actions">
        <button class="btn btn-primary" @click="saveSettings" :disabled="saving">保存</button>
        <button class="btn btn-ghost" @click="resetSettings" :disabled="saving">重置</button>
        <span v-if="savingMsg" class="hint">{{ savingMsg }}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">上传壁纸</div>
      <p class="hint" style="margin-bottom: 12px;">
        上传后会自动应用，并将 URL 置灰隐藏以保护隐私。
      </p>
      <input type="file" accept="image/*" @change="onUpload" :disabled="uploading" />
      <div v-if="uploadMsg" class="hint" style="margin-top: 8px;">{{ uploadMsg }}</div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.card {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-title {
  font-weight: 600;
  font-size: 15px;
}
.preview-area {
  position: relative;
  height: 160px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  border: 1px solid var(--border, #e5e7eb);
}
.preview-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
}
.preview-label {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 13px;
  color: var(--text-muted, #6b7280);
}
.field-input {
  padding: 8px 12px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  background: transparent;
  color: var(--text, #111827);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}
.field-input:focus {
  border-color: var(--brand, #5f4dbf);
}
.field-locked {
  background: var(--hover, rgba(0, 0, 0, 0.03));
  color: var(--text-muted, #9ca3af);
  cursor: not-allowed;
}
.unlock-btn {
  align-self: flex-start;
  font-size: 12px;
  color: var(--brand, #5f4dbf);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.unlock-btn:hover {
  text-decoration: underline;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary {
  background: var(--brand, #5f4dbf);
  color: #fff;
}
.btn-primary:hover {
  background: var(--brand-hover, #4a3da8);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
  color: var(--text, #374151);
  border: 1px solid var(--border, #e5e7eb);
}
.btn-ghost:hover {
  background: var(--hover, rgba(0, 0, 0, 0.03));
}
.hint {
  font-size: 12px;
  color: var(--text-muted, #6b7280);
}
input[type="range"] {
  width: 100%;
  accent-color: var(--brand, #5f4dbf);
}
</style>