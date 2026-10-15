import { ref } from 'vue'
import { preferenceApi } from '@/api'

const currentWallpaper = ref('')
const opacity = ref(0.35)
const initialized = ref(false)

export function useWallpaper() {
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

  async function loadFromServer() {
    try {
      const pref = await preferenceApi.get()
      currentWallpaper.value = pref.wallpaper || ''
      opacity.value = pref.opacity ?? 0.35
      applyToDOM(currentWallpaper.value, opacity.value)
      initialized.value = true
      return pref
    } catch {
      applyToDOM('', 0.35)
      initialized.value = true
      return null
    }
  }

  function apply(u: string, o: number) {
    currentWallpaper.value = u
    opacity.value = o
    applyToDOM(u, o)
  }

  function reset() {
    currentWallpaper.value = ''
    opacity.value = 0.35
    applyToDOM('', 0.35)
  }

  return {
    currentWallpaper,
    opacity,
    initialized,
    applyToDOM,
    loadFromServer,
    apply,
    reset
  }
}