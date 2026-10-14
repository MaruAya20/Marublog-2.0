<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
const props = defineProps<{
  open: boolean
  src: string
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)
const dragStart = { x: 0, y: 0, ox: 0, oy: 0 }

function reset() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

watch(() => props.open, (v) => { if (v) reset() })

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY < 0 ? 0.15 : -0.15
  scale.value = Math.max(0.3, Math.min(scale.value + delta, 5))
}

function onMouseDown(e: MouseEvent) {
  if (scale.value <= 1) return
  dragging.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.ox = offsetX.value
  dragStart.oy = offsetY.value
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  offsetX.value = dragStart.ox + (e.clientX - dragStart.x)
  offsetY.value = dragStart.oy + (e.clientY - dragStart.y)
}

function onMouseUp() {
  dragging.value = false
}

function onDblClick(e: MouseEvent) {
  e.preventDefault()
  if (scale.value > 1) reset()
  else { scale.value = 2; offsetX.value = 0; offsetY.value = 0 }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === '+' || e.key === '=') scale.value = Math.min(scale.value + 0.2, 5)
  if (e.key === '-') scale.value = Math.max(scale.value - 0.2, 0.3)
  if (e.key === '0') reset()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.open && props.src"
      class="viewer-mask"
      @click.self="emit('close')"
      @wheel="onWheel"
    >
      <button class="viewer-close" @click="emit('close')">×</button>
      <div class="viewer-zoom-hint">滚轮缩放 · 双击放大 · 拖拽平移 · 0 重置</div>
      <img
        class="viewer-img"
        :src="props.src"
        :style="{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in'
        }"
        @mousedown="onMouseDown"
        @dblclick="onDblClick"
        alt="大图"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.viewer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
  overflow: hidden;
}
.viewer-img {
  max-width: 92vw;
  max-height: 92vh;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  user-select: none;
  transition: transform 0.08s ease-out;
  transform-origin: center center;
}
.viewer-close {
  position: absolute;
  top: 16px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s;
  z-index: 100;
}
.viewer-close:hover { background: rgba(255, 255, 255, 0.3); }
.viewer-zoom-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  pointer-events: none;
  font-family: sans-serif;
}
</style>