<template>
  <div class="ai-chat-widget">
    <button
      class="ai-fab"
      :class="{ 'ai-fab-char': persona && isImageAvatar(persona.avatar) }"
      @click="open = !open"
      :title="'AI 助手 ' + (persona?.name || 'Maru')"
    >
      <img
        v-if="persona && isImageAvatar(persona.avatar)"
        :src="open ? getExprAvatar() : persona.avatar"
        class="fab-char-img"
        :key="exprFlipKey"
      />
      <span v-else class="fab-icon">{{ persona?.avatar || '🤖' }}</span>
      <span v-if="unread > 0" class="fab-badge">{{ unread > 9 ? '9+' : unread }}</span>
      <span class="fab-hint" v-if="persona && isImageAvatar(persona.avatar) && !open">{{ persona?.name || 'Maru' }}</span>
    </button>

    <div v-if="open" class="ai-panel">
      <div class="ai-header">
        <div class="ai-header-left">
          <div class="ai-avatar">
            <img v-if="persona && isImageAvatar(persona.chatAvatar)" :src="persona.chatAvatar" class="ai-avatar-img" />
            <img v-else-if="persona && isImageAvatar(persona.avatar)" :src="persona.avatar" class="ai-avatar-img" />
            <span v-else>{{ persona?.avatar || '🤖' }}</span>
          </div>
          <div class="ai-title-group">
            <div class="ai-title">{{ persona?.name || 'Maru' }} <span class="ai-title-tag">AI 助手</span></div>
            <div class="ai-subtitle">你好，我是 {{ persona?.name || 'Maru' }} ~</div>
          </div>
        </div>
        <button class="header-tts-toggle" :class="{ on: autoTTS }" @click="toggleAutoTTS" :title="autoTTS ? '自动朗读：开' : '自动朗读：关'">
          <span class="tts-icon">🔊</span>
          <span class="tts-label">{{ autoTTS ? 'ON' : 'OFF' }}</span>
        </button>
        <button class="ai-close" @click="open = false">✕</button>
      </div>

      <div class="ai-body">
        <div class="ai-sidebar">
          <button class="sidebar-new" @click="newSession">＋ 新对话</button>
          <div class="session-list">
            <div
              v-for="s in sessions"
              :key="s.id"
              class="session-item"
              :class="{ active: s.id === currentSessionId }"
              @click="selectSession(s)"
            >
              <span class="session-title">{{ s.title }}</span>
              <button class="session-del" @click.stop="deleteSession(s.id)" title="删除">🗑</button>
            </div>
            <div v-if="sessions.length === 0" class="session-empty">暂无对话记录</div>
          </div>
        </div>

        <div class="ai-chat-area">
          <div class="messages-wrap" ref="messagesWrap">
            <div v-if="messages.length === 0 && !loading" class="welcome">
              <div class="welcome-emoji">🌸</div>
              <div class="welcome-text">有什么想聊的吗？我可以帮你解答博客相关的问题~</div>
              <div class="quick-prompts">
                <button v-for="p in quickPrompts" :key="p" @click="sendMessage(p)">{{ p }}</button>
              </div>
            </div>
            <div v-for="m in messages" :key="m.id" class="msg-row" :class="m.role === 'USER' ? 'user' : 'ai'">
              <div class="msg-bubble" :class="m.role === 'USER' ? 'user' : 'ai'">
                <div v-if="m.role === 'ASSISTANT'" class="msg-avatar">
                  <img v-if="persona && isImageAvatar(persona.chatAvatar)" :src="persona.chatAvatar" class="msg-avatar-img" />
                  <img v-else-if="persona && isImageAvatar(persona.avatar)" :src="persona.avatar" class="msg-avatar-img" />
                  <span v-else>{{ persona?.avatar || '🤖' }}</span>
                </div>
                <div class="msg-body">
                  <div class="msg-content" v-html="formatMsg(m.content)"></div>
                  <div v-if="m.role === 'ASSISTANT' && m.ja" class="msg-actions">
                    <button
                      class="msg-action-btn"
                      :class="{ playing: ttsPlayingId === m.id, loading: ttsLoading && ttsPlayingId === m.id }"
                      :disabled="ttsLoading"
                      @click="ttsPlayingId === m.id ? stopTTS() : speakJa(m.ja, m.id)"
                      :title="ttsPlayingId === m.id ? '停止朗读' : '朗读日文'"
                    >
                      <span v-if="ttsPlayingId === m.id">⏹</span>
                      <span v-else-if="ttsLoading && !ttsReady">⏳</span>
                      <span v-else>🔊</span>
                    </button>
                    <span class="msg-ja-preview" @click="speakJa(m.ja, m.id)" :title="m.ja">{{ m.ja }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loading" class="msg-row ai">
              <div class="msg-bubble ai">
                <div class="msg-avatar">
                  <img v-if="persona && isImageAvatar(persona.chatAvatar)" :src="persona.chatAvatar" class="msg-avatar-img" />
                  <img v-else-if="persona && isImageAvatar(persona.avatar)" :src="persona.avatar" class="msg-avatar-img" />
                  <span v-else>{{ persona?.avatar || '🤖' }}</span>
                </div>
                <div class="typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>

          <div class="input-area">
            <textarea
              v-model="input"
              rows="1"
              :placeholder="auth.isLoggedIn ? '输入消息... (Enter 发送, Shift+Enter 换行)' : '登录后即可与 Maru 对话'"
              :disabled="!auth.isLoggedIn || loading"
              @keydown.enter.exact.prevent="sendMessage()"
              @input="autoResize"
              ref="inputRef"
            ></textarea>
            <button class="send-btn" :disabled="!input.trim() || !auth.isLoggedIn || loading" @click="sendMessage()">
              ➤
            </button>
          </div>
          <div v-if="!auth.isLoggedIn" class="login-hint" @click="goLogin">登录后即可与 Maru 对话 →</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { api, unwrap } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const open = ref(false)
const sessions = ref<any[]>([])
const currentSessionId = ref<number | null>(null)
const messages = ref<any[]>([])
const input = ref('')
const loading = ref(false)
const messagesWrap = ref<HTMLDivElement>()
const inputRef = ref<HTMLTextAreaElement>()
const unread = ref(0)
const persona = ref<any>(null)
const currentEmotion = ref<string>('neutral')
const exprFlipKey = ref(0)

function setEmotion(e: string) {
  if (!e) return
  if (e === 'neutral' && currentEmotion.value !== 'neutral') return
  if (e === currentEmotion.value) return
  currentEmotion.value = e
  exprFlipKey.value++
}

function getExprAvatar(): string {
  if (!persona.value) return ''
  const m: Record<string, string | undefined> = {
    neutral: persona.value.exprNeutral,
    happy: persona.value.exprHappy,
    thinking: persona.value.exprThinking,
    shy: persona.value.exprShy,
    excited: persona.value.exprExcited,
    sad: persona.value.exprSad,
    angry: persona.value.exprAngry,
    sleepy: persona.value.exprSleepy,
  }
  return m[currentEmotion.value] || persona.value.avatar || ''
}

watch(open, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) {
    currentEmotion.value = 'neutral'
  }
})

const ttsPlayingId = ref<number | null>(null)
const ttsReady = ref(false)
const ttsLoading = ref(false)
const autoTTS = ref(localStorage.getItem('maru_autotts') === '1')
let aqInstance: any = null
let k2kInstance: any = null
let currentAudio: HTMLAudioElement | null = null

async function initAquesTalk() {
  if (ttsReady.value || ttsLoading.value) return
  ttsLoading.value = true
  try {
    const { load: loadAq } = await import('aquestalk.js')
    const { load: loadK2K } = await import('kanji2koe-openjtalk')
    const origin = window.location.origin
    k2kInstance = await loadK2K({ wasmPath: `${origin}/kanji2koe/aqkanji2koe_wasm_bg.wasm` })
    aqInstance = await loadAq('f1', { baseUrl: `${origin}/aquestalk/`, wasmPath: `${origin}/aquestalk/v86.wasm` })
    ttsReady.value = true
    console.log('[AquesTalk] ready (voice=f1)')
  } catch (e) {
    console.warn('[AquesTalk] init failed:', e)
  } finally {
    ttsLoading.value = false
  }
}
onMounted(() => initAquesTalk())

function toggleAutoTTS() {
  autoTTS.value = !autoTTS.value
  localStorage.setItem('maru_autotts', autoTTS.value ? '1' : '0')
  if (autoTTS.value && !ttsReady.value && !ttsLoading.value) initAquesTalk()
}

async function speakJa(jaText: string, msgId: number) {
  if (!jaText) return
  if (!ttsReady.value) {
    if (!ttsLoading.value) initAquesTalk()
    return
  }
  stopTTS()
  try {
    let cleaned = jaText
      .replace(/<[^>]+>/g, '')
      .replace(/[\r\n\t]/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!cleaned) return
    let koe = k2kInstance.convert(cleaned)
    koe = koe.replace(/っ(?=[。？！、\s]|$)/g, 'っと')
    koe = koe.replace(/っとと/g, 'っと')
    console.log('[AquesTalk] speakJa input:', cleaned, '→ koe:', JSON.stringify(koe), 'len:', koe.length)
    const wav = aqInstance.run(koe, 100)
    const bytes = new Uint8Array(wav.byteLength)
    bytes.set(wav)
    const blob = new Blob([bytes], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio
    audio.onplay = () => { ttsPlayingId.value = msgId }
    audio.onended = () => { URL.revokeObjectURL(url); ttsPlayingId.value = null }
    audio.onerror = () => { URL.revokeObjectURL(url); ttsPlayingId.value = null }
    await audio.play()
  } catch (e) {
    console.error('[AquesTalk] speak error:', e)
    ttsPlayingId.value = null
  }
}

function stopTTS() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
  ttsPlayingId.value = null
}

function isImageAvatar(val: string | undefined | null): boolean {
  if (!val) return false
  return val.startsWith('/api/uploads/') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')
}

function avatarDisplay(val: string | undefined | null): string {
  if (!val) return '🤖'
  if (isImageAvatar(val)) return ''
  return val
}

async function loadPersona() {
  try {
    const res = await api.get('/ai/persona')
    persona.value = unwrap(res)
  } catch {}
}

const quickPrompts = ['介绍一下 MaruBlog', '怎么写文章？', '如何评论？']

async function loadSessions() {
  if (!auth.isLoggedIn) {
    sessions.value = []
    return
  }
  try {
    const res = await api.get('/ai/sessions')
    sessions.value = unwrap(res) || []
    if (sessions.value.length > 0 && !currentSessionId.value) {
      currentSessionId.value = sessions.value[0].id
      await loadMessages(currentSessionId.value)
    }
  } catch {}
}

async function loadMessages(sessionId: number) {
  try {
    const res = await api.get(`/ai/sessions/${sessionId}/messages`)
    messages.value = unwrap(res) || []
    await nextTick()
    scrollToBottom()
  } catch {}
}

async function selectSession(s: any) {
  currentSessionId.value = s.id
  await loadMessages(s.id)
}

async function newSession() {
  try {
    const res = await api.post('/ai/sessions', {})
    const session = unwrap(res)
    sessions.value.unshift(session)
    currentSessionId.value = session.id
    messages.value = []
    await nextTick()
    inputRef.value?.focus()
  } catch {}
}

async function deleteSession(id: number) {
  if (!confirm('确定删除此对话？')) return
  try {
    await api.delete(`/ai/sessions/${id}`)
    sessions.value = sessions.value.filter(s => s.id !== id)
    if (currentSessionId.value === id) {
      currentSessionId.value = sessions.value[0]?.id || null
      if (currentSessionId.value) await loadMessages(currentSessionId.value)
      else messages.value = []
    }
  } catch {}
}

async function sendMessage(text?: string) {
  const content = (text ?? input.value).trim()
  if (!content || loading.value) return

  if (auth.isLoggedIn && !currentSessionId.value) {
    try {
      const res = await api.post('/ai/sessions', {})
      currentSessionId.value = unwrap(res).id
      sessions.value.unshift(unwrap(res))
    } catch { return }
  }

  input.value = ''
  loading.value = true

  const userMsg = { id: Date.now(), role: 'USER', content }
  messages.value.push(userMsg)
  await nextTick()
  scrollToBottom()

  try {
    const payload: any = { content }
    if (currentSessionId.value) payload.sessionId = currentSessionId.value
    const res = await api.post('/ai/chat', payload)
    const d: any = unwrap(res)
    if (d && d.sessionId && !currentSessionId.value) {
      currentSessionId.value = d.sessionId
    }
    if (d?.emotion) setEmotion(d.emotion)
    const newMsgId = Date.now() + 1
    messages.value.push({ role: 'ASSISTANT', content: d?.reply || '(无回复)', ja: d?.ja || '', id: newMsgId })
    if (autoTTS.value && d?.ja) {
      setTimeout(() => speakJa(d.ja, newMsgId), 400)
    }
    if (auth.isLoggedIn && Array.isArray(sessions.value)) {
      const s = sessions.value.find((x: any) => x.id === currentSessionId.value)
      if (s && (!s.title || s.title === '新对话')) {
        s.title = content.length > 20 ? content.substring(0, 20) + '...' : content
      }
    }
  } catch (err: any) {
    const msg = err?.message || '发送失败'
    messages.value.push({ id: Date.now() + 1, role: 'ASSISTANT', content: '抱歉，发送失败：' + msg })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (messagesWrap.value) {
    messagesWrap.value.scrollTop = messagesWrap.value.scrollHeight
  }
}

function autoResize() {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function formatMsg(text: string) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function goLogin() {
  router.push('/login')
}

onMounted(() => {
  loadPersona()
  loadSessions()
})
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.ai-fab {
  cursor: pointer;
  position: relative;
  border: none;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s;
}

.ai-fab:not(.ai-fab-char) {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #cd2941, #d36273);
  box-shadow: 0 6px 20px #cd2941;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}
.ai-fab:not(.ai-fab-char):hover {
  transform: scale(1.08);
  box-shadow: 0 8px 28px #cd2941;
}

.ai-fab-char {
  background: transparent;
  padding: 0;
  line-height: 0;
  animation: fabFloat 3.5s ease-in-out infinite;
}
.ai-fab-char:hover {
  transform: scale(1.05) translateY(-4px);
  filter: drop-shadow(0 10px 24px #deabab);
  animation-play-state: paused;
}
.ai-fab-char:active {
  transform: scale(0.97);
}
@keyframes fabFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.fab-char-img {
  width: 300px;
  height: auto;
  max-height: 250px;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px #e1b5bc);
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  animation: flipSwitch 0.5s ease;
}
@keyframes flipSwitch {
  0%   { transform: perspective(500px) rotateY(0deg) scale(1); }
  50%  { transform: perspective(500px) rotateY(90deg) scale(0.92); }
  100% { transform: perspective(500px) rotateY(0deg) scale(1); }
}
.fab-icon {
  font-size: 26px;
}
.fab-hint {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #fff;
  background: linear-gradient(135deg, #cd2941, #d36273);
  padding: 7px 12px;
  border-radius: 14px;
  white-space: nowrap;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  box-shadow: 0 4px 12px #d36273;
}
.fab-hint::before {
  content: '';
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: #cd2941;
}
.ai-fab-char:hover .fab-hint {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}
.fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff6b6b;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.ai-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 16px;
  width: 440px;
  height: 640px;
  max-height: calc(100dvh - 280px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideDown 0.25s ease;
  transform-origin: bottom right;
}

@keyframes slideDown {
  from { transform: translateY(-20px) scale(0.96); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg,  #cd2941, #d36273);
  color: #fff;
}
.ai-header-left { display: flex; align-items: center; gap: 12px; }
.ai-avatar, .msg-avatar {
  font-size: 22px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.msg-avatar {
  width: 28px;
  height: 28px;
  font-size: 16px;
  background: transparent;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 1px;
}
.ai-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.msg-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.ai-title { font-size: 16px; font-weight: 600; }
.ai-title-tag {
  font-size: 11px;
  background: rgba(255,255,255,0.25);
  padding: 1px 7px;
  border-radius: 8px;
  margin-left: 6px;
  font-weight: normal;
}
.ai-subtitle { font-size: 12px; opacity: 0.85; }

.header-tts-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.header-tts-toggle:hover {
  background: rgba(255,255,255,0.25);
  color: #fff;
}
.header-tts-toggle .tts-icon { font-size: 13px; }
.header-tts-toggle .tts-label { letter-spacing: 0.5px; }
.header-tts-toggle.on {
  background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.25));
  border-color: #fff;
  color: #fff;
  box-shadow: 0 0 10px rgba(255,255,255,0.3);
}

.ai-close {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.ai-close:hover { background: rgba(255,255,255,0.2); }

.ai-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.ai-sidebar {
  width: 140px;
  background: #f7f8fc;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}
.sidebar-new {
  margin: 10px;
  padding: 8px;
  background: #cd2941;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.sidebar-new:hover { background: #d36273; }
.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 6px 10px;
}
.session-item {
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  color: #555;
  transition: background 0.1s;
}
.session-item:hover { background: #eef0ff; }
.session-item.active { background: #cd2941; color: #fff; }
.session-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.session-del {
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.15s, transform 0.15s;
  font-size: 13px;
  padding: 2px 4px;
  flex-shrink: 0;
}
.session-del:hover { opacity: 1; transform: scale(1.2); }
.session-item:hover .session-del,
.session-item.active .session-del { opacity: 0.8; }
.session-empty {
  text-align: center;
  color: #aaa;
  font-size: 11px;
  margin-top: 20px;
}

.ai-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.messages-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafbff;
}

.welcome {
  text-align: center;
  padding: 40px 20px;
}
.welcome-emoji { font-size: 42px; margin-bottom: 12px; }
.welcome-text { color: #666; font-size: 14px; margin-bottom: 18px; }
.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.quick-prompts button {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  color: #cd2941;
  transition: all 0.15s;
}
.quick-prompts button:hover {
  border-color: #cd2941;
  background: #f0eeff;
}

.msg-row { margin-bottom: 12px; display: flex; }
.msg-row.user { justify-content: flex-end; }
.msg-row.ai { justify-content: flex-start; }

.msg-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.55;
  word-break: break-word;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.msg-bubble.user {
  background: linear-gradient(135deg, #cd2941, #d36273);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg-bubble.ai {
  background: #fff;
  color: #333;
  border: 1px solid #eee;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.msg-content code {
  background: rgba(108,92,231,0.1);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
}
.msg-bubble.user code {
  background: rgba(255,255,255,0.25);
}

.msg-body { flex: 1; min-width: 0; }

.msg-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #eee;
}

.msg-action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #cd2941, #d36273);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, box-shadow 0.15s;
}
.msg-action-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(205, 41, 65, 0.35);
}
.msg-action-btn:disabled { opacity: 0.5; cursor: wait; }
.msg-action-btn.playing {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  animation: pulseRing 1.2s infinite;
}
@keyframes pulseRing {
  0%, 100% { box-shadow: 0 0 0 0 rgba(108, 92, 231, 0.5); }
  50%      { box-shadow: 0 0 0 6px rgba(108, 92, 231, 0); }
}

.msg-ja-preview {
  font-size: 11px;
  color: #999;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s;
}
.msg-ja-preview:hover { color: #cd2941; }

.typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}
.typing span {
  width: 7px;
  height: 7px;
  background: #bbb;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 14px;
  background: #fff;
  border-top: 1px solid #eee;
}
.input-area textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  resize: none;
  max-height: 120px;
  min-height: 36px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}
.input-area textarea:focus { border-color: #cd2941; }
.input-area textarea:disabled { background: #f5f5f5; color: #aaa; }
.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #cd2941;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.15s;
  flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: #d36273; }
.send-btn:disabled { background: #ccc; cursor: not-allowed; }

.login-hint {
  text-align: center;
  font-size: 12px;
  color: #cd2941;
  padding: 6px;
  cursor: pointer;
  background: #fff;
  border-top: 1px solid #eee;
}
.login-hint:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .ai-panel {
    width: calc(100vw - 16px);
    right: 8px;
    bottom: 8px;
    height: calc(100dvh - 16px);
    max-height: none;
    border-radius: 12px;
  }
  .ai-sidebar { width: 110px; }
}
</style>