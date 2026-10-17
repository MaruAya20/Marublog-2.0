<template>
  <div class="ai-chat-widget">
    <button v-if="!open" class="ai-fab" @click="open = true" title="AI 助手 Maru">
      <span class="fab-icon">🤖</span>
      <span v-if="unread > 0" class="fab-badge">{{ unread > 9 ? '9+' : unread }}</span>
    </button>

    <div v-if="open" class="ai-panel">
      <div class="ai-header">
        <div class="ai-header-left">
          <span class="ai-avatar">🤖</span>
          <div class="ai-title-group">
            <div class="ai-title">Maru <span class="ai-title-tag">AI 助手</span></div>
            <div class="ai-subtitle">你好，我是 Maru ~</div>
          </div>
        </div>
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
                <span v-if="m.role === 'ASSISTANT'" class="msg-avatar">🤖</span>
                <div class="msg-content" v-html="formatMsg(m.content)"></div>
              </div>
            </div>
            <div v-if="loading" class="msg-row ai">
              <div class="msg-bubble ai">
                <span class="msg-avatar">🤖</span>
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
import { ref, onMounted, nextTick, computed } from 'vue'
import { api } from '@/api/client'
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

const quickPrompts = ['介绍一下 MaruBlog', '怎么写文章？', '如何评论？']

async function loadSessions() {
  if (!auth.isLoggedIn) {
    sessions.value = []
    return
  }
  try {
    const res = await api.get('/ai/sessions')
    sessions.value = res.data.data || []
    if (sessions.value.length > 0 && !currentSessionId.value) {
      currentSessionId.value = sessions.value[0].id
      await loadMessages(currentSessionId.value)
    }
  } catch {}
}

async function loadMessages(sessionId: number) {
  try {
    const res = await api.get(`/ai/sessions/${sessionId}/messages`)
    messages.value = res.data.data || []
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
    const session = res.data.data
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
  if (!content || loading.value || !auth.isLoggedIn) return

  if (!currentSessionId.value) {
    try {
      const res = await api.post('/ai/sessions', {})
      currentSessionId.value = res.data.data.id
      sessions.value.unshift(res.data.data)
    } catch { return }
  }

  input.value = ''
  loading.value = true

  const userMsg = { id: Date.now(), role: 'USER', content }
  messages.value.push(userMsg)
  await nextTick()
  scrollToBottom()

  try {
    const res = await api.post('/ai/chat', { sessionId: currentSessionId.value, content })
    const aiMsg = res.data.data
    messages.value.push(aiMsg)
    const s = sessions.value.find(x => x.id === currentSessionId.value)
    if (s && (s.title === '新对话' || s.title === '新对话')) {
      s.title = content.length > 20 ? content.substring(0, 20) + '...' : content
    }
  } catch (err: any) {
    messages.value.push({ id: Date.now() + 1, role: 'ASSISTANT', content: '抱歉，发送失败了，请稍后再试。' })
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
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.ai-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 28px rgba(108, 92, 231, 0.55);
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
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 440px;
  height: 640px;
  max-height: calc(100dvh - 48px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
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
}
.msg-avatar {
  width: 28px;
  height: 28px;
  font-size: 16px;
  background: transparent;
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
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.sidebar-new:hover { background: #5a4bd1; }
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
.session-item.active { background: #6c5ce7; color: #fff; }
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
  color: #6c5ce7;
  transition: all 0.15s;
}
.quick-prompts button:hover {
  border-color: #6c5ce7;
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
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
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
.input-area textarea:focus { border-color: #6c5ce7; }
.input-area textarea:disabled { background: #f5f5f5; color: #aaa; }
.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #6c5ce7;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.15s;
  flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: #5a4bd1; }
.send-btn:disabled { background: #ccc; cursor: not-allowed; }

.login-hint {
  text-align: center;
  font-size: 12px;
  color: #6c5ce7;
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