<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { adminApi, aiApi, uploadApi, unwrap, extractError } from '@/api'

type TabKey = 'dashboard' | 'users' | 'bans' | 'logs' | 'ai'

const activeTab = ref<TabKey>('dashboard')

const stats = ref<Record<string, number | string>>({})
const loadingStats = ref(false)

const users = ref<any[]>([])
const userTotal = ref(0)
const userPage = ref(0)
const userKeyword = ref('')
const loadingUsers = ref(false)

const bans = ref<any[]>([])
const banTotal = ref(0)
const banPage = ref(0)
const loadingBans = ref(false)

const logs = ref<any[]>([])
const logTotal = ref(0)
const logPage = ref(0)
const loadingLogs = ref(false)

const opCode = ref('')
const showOpModal = ref(false)
const pendingAction = ref<null | { type: 'ban' | 'unban' | 'promote'; userId: number; extra?: any }>(null)
const opError = ref('')
const opSuccess = ref('')

const PAGE_SIZE = 20

async function loadStats() {
  loadingStats.value = true
  try {
    stats.value = await adminApi.stats()
  } catch {} finally {
    loadingStats.value = false
  }
}

async function loadUsers() {
  loadingUsers.value = true
  try {
    const res = await adminApi.listUsers({
      keyword: userKeyword.value || undefined,
      page: userPage.value,
      pageSize: PAGE_SIZE
    })
    users.value = res.users
    userTotal.value = res.total
  } catch {} finally {
    loadingUsers.value = false
  }
}

async function loadBans() {
  loadingBans.value = true
  try {
    const res = await adminApi.listBans({ page: banPage.value, pageSize: PAGE_SIZE })
    bans.value = res.bans
    banTotal.value = res.total
  } catch {} finally {
    loadingBans.value = false
  }
}

async function loadLogs() {
  loadingLogs.value = true
  try {
    const res = await adminApi.listLogs({ page: logPage.value, pageSize: PAGE_SIZE })
    logs.value = res.logs
    logTotal.value = res.total
  } catch {} finally {
    loadingLogs.value = false
  }
}

function switchTab(tab: TabKey) {
  activeTab.value = tab
  opError.value = ''
  opSuccess.value = ''
  if (tab === 'dashboard' && Object.keys(stats.value).length === 0) loadStats()
  if (tab === 'users' && users.value.length === 0) loadUsers()
  if (tab === 'bans' && bans.value.length === 0) loadBans()
  if (tab === 'logs' && logs.value.length === 0) loadLogs()
  if (tab === 'ai') loadAiTab()
}

function openOpModal(type: 'ban' | 'unban' | 'promote', userId: number, extra?: any) {
  pendingAction.value = { type, userId, extra }
  opCode.value = ''
  opError.value = ''
  opSuccess.value = ''
  showOpModal.value = true
}

async function confirmAction() {
  if (!pendingAction.value || !opCode.value) return
  opError.value = ''
  opSuccess.value = ''
  try {
    const p = pendingAction.value
    if (p.type === 'ban') {
      await adminApi.banUser({
        userId: p.userId,
        minutes: p.extra.minutes,
        reason: p.extra.reason,
        opCode: opCode.value
      })
      opSuccess.value = '封禁成功'
    } else if (p.type === 'unban') {
      await adminApi.unbanUser({ userId: p.userId, reason: p.extra?.reason || '', opCode: opCode.value })
      opSuccess.value = '解封成功'
    } else if (p.type === 'promote') {
      await adminApi.promote({ userId: p.userId, opCode: opCode.value })
      opSuccess.value = '已临时提升（30分钟）'
    }
    setTimeout(() => {
      showOpModal.value = false
      pendingAction.value = null
      loadStats()
      loadUsers()
      loadBans()
    }, 800)
  } catch (err) {
    opError.value = extractError(err)
  }
}

const banMinutes = ref(60)
const banReason = ref('')

function banFlow(userId: number) {
  banMinutes.value = 60
  banReason.value = ''
  openOpModal('ban', userId, { minutes: banMinutes.value, reason: banReason.value })
}

// ==================== AI / RAG Tab ====================

const personas = ref<any[]>([])
const selectedPersona = ref<any>(null)
const loadingPersonas = ref(false)
const personaError = ref('')
const personaSaved = ref('')

const ragStatsData = ref<any>(null)
const loadingRagStats = ref(false)
const reindexing = ref(false)
const reindexMsg = ref('')

const uploadingAvatar = ref<{ field: string | null }>({ field: null })
const avatarInputRef = ref<HTMLInputElement | null>(null)
const chatAvatarInputRef = ref<HTMLInputElement | null>(null)
const exprInputRefs = ref<Record<string, HTMLInputElement | null>>({})

const exprList = [
  { key: 'neutral', field: 'exprNeutral', label: '平静', emoji: '😐' },
  { key: 'happy',   field: 'exprHappy',   label: '开心', emoji: '😄' },
  { key: 'thinking',field: 'exprThinking',label: '思考', emoji: '🤔' },
  { key: 'shy',     field: 'exprShy',     label: '害羞', emoji: '😳' },
  { key: 'excited', field: 'exprExcited', label: '激动', emoji: '🤩' },
  { key: 'sad',     field: 'exprSad',     label: '难过', emoji: '😢' },
  { key: 'angry',   field: 'exprAngry',   label: '生气', emoji: '😠' },
  { key: 'sleepy',  field: 'exprSleepy',  label: '困了', emoji: '😴' },
]

function getInputRef(field: string): HTMLInputElement | null {
  if (field === 'avatar') return avatarInputRef.value
  if (field === 'chatAvatar') return chatAvatarInputRef.value
  return exprInputRefs.value[field] || null
}

function ensureHiddenInputs() {
  exprList.forEach(expr => {
    if (!exprInputRefs.value[expr.field]) {
      const inp = document.createElement('input')
      inp.type = 'file'
      inp.accept = 'image/*'
      inp.style.display = 'none'
      inp.addEventListener('change', (e: Event) => onAvatarUpload(e, expr.field))
      document.body.appendChild(inp)
      exprInputRefs.value[expr.field] = inp
    }
  })
}

function triggerAvatarUpload(field: string) {
  if (field !== 'avatar' && field !== 'chatAvatar') ensureHiddenInputs()
  getInputRef(field)?.click()
}

async function onAvatarUpload(e: Event, field: string) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    personaError.value = '请选择图片文件'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    personaError.value = '图片超过 10MB'
    return
  }
  uploadingAvatar.value = { field }
  personaError.value = ''
  try {
    const res = await uploadApi.upload(file)
    if (selectedPersona.value) {
      (selectedPersona.value as any)[field] = res.url
    }
  } catch (err: any) {
    personaError.value = err?.response?.data?.error || '上传失败'
  } finally {
    uploadingAvatar.value = { field: null }
    input.value = ''
  }
}

function clearAvatar(field: string) {
  if (selectedPersona.value) {
    (selectedPersona.value as any)[field] = ''
  }
}

function isImageAvatar(val: string | undefined | null): boolean {
  if (!val) return false
  return val.startsWith('/api/uploads/') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')
}

const chatHistory = ref<{ role: string; content: string; time?: string }[]>([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatSessionId = ref<number | null>(null)
const chatError = ref('')

async function loadPersonas() {
  loadingPersonas.value = true
  personaError.value = ''
  try {
    const list = await aiApi.listPersonas()
    personas.value = Array.isArray(list) ? list : []
    if (!selectedPersona.value && personas.value.length > 0) {
      const def = personas.value.find((p: any) => p.default) || personas.value[0]
      selectedPersona.value = { ...def }
    }
  } catch (err) {
    personaError.value = extractError(err)
  } finally {
    loadingPersonas.value = false
  }
}

async function loadRagStats() {
  loadingRagStats.value = true
  try {
    ragStatsData.value = await aiApi.ragStats()
  } catch (err) {
    ragStatsData.value = { totalChunks: 0, indexedPosts: 0, embeddingAvailable: false }
  } finally {
    loadingRagStats.value = false
  }
}

function loadAiTab() {
  if (personas.value.length === 0) loadPersonas()
  if (!ragStatsData.value) loadRagStats()
}

function selectPersona(p: any) {
  selectedPersona.value = { ...p }
  personaError.value = ''
  personaSaved.value = ''
}

function newPersona() {
  selectedPersona.value = {
    id: null,
    name: '新角色',
    avatar: '',
    soulPrompt: '你是一个...',
    styleExamples: '',
    default: false
  }
  personaError.value = ''
  personaSaved.value = ''
}

async function savePersona() {
  if (!selectedPersona.value) return
  personaError.value = ''
  personaSaved.value = ''
  try {
    let saved: any
    if (selectedPersona.value.id) {
      saved = await aiApi.updatePersona(selectedPersona.value)
    } else {
      saved = await aiApi.createPersona(selectedPersona.value)
    }
    personaSaved.value = '已保存 ✓'
    await loadPersonas()
    selectedPersona.value = { ...saved }
    setTimeout(() => { personaSaved.value = '' }, 2000)
  } catch (err) {
    personaError.value = extractError(err)
  }
}

async function setDefault(id: number) {
  try {
    await aiApi.setDefaultPersona(id)
    await loadPersonas()
    const p = personas.value.find((x: any) => x.id === id)
    if (p) selectedPersona.value = { ...p }
  } catch (err) {
    personaError.value = extractError(err)
  }
}

async function removePersona(id: number) {
  if (!confirm('确定删除该人设吗？')) return
  try {
    await aiApi.deletePersona(id)
    await loadPersonas()
    if (selectedPersona.value?.id === id) {
      selectedPersona.value = personas.value[0] ? { ...personas.value[0] } : null
    }
  } catch (err) {
    personaError.value = extractError(err)
  }
}

async function doReindex() {
  reindexing.value = true
  reindexMsg.value = ''
  try {
    const res = await aiApi.reindexAll()
    reindexMsg.value = res.message || `重建完成：${res.chunks} 个文本块`
    await loadRagStats()
  } catch (err) {
    reindexMsg.value = '重建失败：' + extractError(err)
  } finally {
    reindexing.value = false
  }
}

async function sendChat() {
  const content = chatInput.value.trim()
  if (!content || chatLoading.value) return
  chatLoading.value = true
  chatError.value = ''
  chatHistory.value.push({ role: 'user', content })
  chatInput.value = ''
  try {
    const res = await aiApi.chat({ content, sessionId: chatSessionId.value })
    chatSessionId.value = res.sessionId
    chatHistory.value.push({
      role: 'assistant',
      content: res.reply || '(无回复)',
      time: res.createdAt || ''
    })
  } catch (err) {
    chatError.value = extractError(err)
    chatHistory.value.pop()
  } finally {
    chatLoading.value = false
  }
}

function clearChat() {
  chatHistory.value = []
  chatSessionId.value = null
  chatError.value = ''
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="admin-page">
    <h1 class="page-title">🛡️ 管理后台</h1>

    <div class="tabs">
      <button
        v-for="t in [
          { k: 'dashboard', n: '📊 仪表盘' },
          { k: 'users', n: '👥 用户管理' },
          { k: 'bans', n: '🚫 封禁列表' },
          { k: 'logs', n: '📝 操作日志' },
          { k: 'ai', n: '🤖 AI 人设 & RAG' }
        ]"
        :key="t.k"
        class="tab-btn"
        :class="{ active: activeTab === t.k }"
        @click="switchTab(t.k as TabKey)"
      >{{ t.n }}</button>
    </div>

    <!-- Dashboard -->
    <div v-if="activeTab === 'dashboard'" class="tab-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-num">{{ loadingStats ? '...' : (stats.totalUsers ?? 0) }}</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">{{ loadingStats ? '...' : (stats.totalPosts ?? 0) }}</div>
          <div class="stat-label">总文章数</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">{{ loadingStats ? '...' : (stats.totalComments ?? 0) }}</div>
          <div class="stat-label">总评论数</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">{{ loadingStats ? '...' : (stats.totalBans ?? 0) }}</div>
          <div class="stat-label">当前封禁</div>
        </div>
      </div>
    </div>

    <!-- Users -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div class="toolbar">
        <input v-model="userKeyword" placeholder="按邮箱或名字搜索用户..." class="search-input" @keyup.enter="userPage = 0; loadUsers()" />
        <button class="btn-primary" @click="userPage = 0; loadUsers()">搜索</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>用户名</th><th>邮箱</th><th>角色</th><th>等级</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td><span class="role-tag" :class="(u.role || '').toLowerCase()">{{ u.role }}</span></td>
            <td>Lv.{{ u.level ?? 0 }}</td>
            <td><span v-if="u.banned" class="ban-badge">已封禁</span><span v-else class="ok-badge">正常</span></td>
            <td class="actions">
              <button v-if="!u.banned" class="btn-danger-sm" @click="banFlow(u.id)">封禁</button>
              <button v-else class="btn-warning-sm" @click="openOpModal('unban', u.id, { reason: '手动解封' })">解封</button>
              <button v-if="u.role !== 'ADMIN'" class="btn-ghost-sm" @click="openOpModal('promote', u.id)">临时提升</button>
            </td>
          </tr>
          <tr v-if="!loadingUsers && users.length === 0">
            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">暂无数据</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="userTotal > PAGE_SIZE">
        <button :disabled="userPage === 0" @click="userPage--; loadUsers()">上一页</button>
        <span>第 {{ userPage + 1 }} / {{ Math.ceil(userTotal / PAGE_SIZE) }} 页</span>
        <button :disabled="(userPage + 1) * PAGE_SIZE >= userTotal" @click="userPage++; loadUsers()">下一页</button>
      </div>
    </div>

    <!-- Bans -->
    <div v-if="activeTab === 'bans'" class="tab-content">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>用户</th><th>邮箱</th><th>原因</th><th>到期时间</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bans" :key="b.id">
            <td>{{ b.id }}</td>
            <td>{{ b.userName || '#' + b.userId }}</td>
            <td>{{ b.email }}</td>
            <td>{{ b.reason || '-' }}</td>
            <td>{{ b.permanent ? '永久' : (b.until?.slice(0, 16) || '-') }}</td>
            <td class="actions">
              <button class="btn-warning-sm" @click="openOpModal('unban', b.userId, { reason: '封禁列表解封' })">解封</button>
            </td>
          </tr>
          <tr v-if="!loadingBans && bans.length === 0">
            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">暂无封禁</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="banTotal > PAGE_SIZE">
        <button :disabled="banPage === 0" @click="banPage--; loadBans()">上一页</button>
        <span>第 {{ banPage + 1 }} / {{ Math.ceil(banTotal / PAGE_SIZE) }} 页</span>
        <button :disabled="(banPage + 1) * PAGE_SIZE >= banTotal" @click="banPage++; loadBans()">下一页</button>
      </div>
    </div>

    <!-- Logs -->
    <div v-if="activeTab === 'logs'" class="tab-content">
      <table class="data-table">
        <thead>
          <tr>
            <th>时间</th><th>管理员</th><th>操作</th><th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in logs" :key="l.id">
            <td>{{ l.createdAt?.slice(0, 19).replace('T', ' ') }}</td>
            <td>{{ l.adminName || '#' + l.adminId }}</td>
            <td><span class="action-tag">{{ l.action }}</span></td>
            <td class="detail-cell">{{ l.detail }}</td>
          </tr>
          <tr v-if="!loadingLogs && logs.length === 0">
            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">暂无日志</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="logTotal > PAGE_SIZE">
        <button :disabled="logPage === 0" @click="logPage--; loadLogs()">上一页</button>
        <span>第 {{ logPage + 1 }} / {{ Math.ceil(logTotal / PAGE_SIZE) }} 页</span>
        <button :disabled="(logPage + 1) * PAGE_SIZE >= logTotal" @click="logPage++; loadLogs()">下一页</button>
      </div>
    </div>

    <!-- AI & RAG Tab -->
    <div v-if="activeTab === 'ai'" class="tab-content ai-tab">
      <div class="ai-columns">
        <!-- Left: Persona List -->
        <div class="ai-col ai-col-left">
          <div class="ai-col-header">
            <h3>🎭 人设列表</h3>
            <button class="btn-primary-sm" @click="newPersona">+ 新建</button>
          </div>
          <div v-if="loadingPersonas" class="ai-loading">加载中...</div>
          <div v-else-if="personas.length === 0" class="ai-empty">暂无人设</div>
          <div v-else class="persona-list">
            <div
              v-for="p in personas"
              :key="p.id"
              class="persona-item"
              :class="{ active: selectedPersona?.id === p.id }"
              @click="selectPersona(p)"
            >
              <div class="persona-avatar">
                <img v-if="p.avatar" :src="p.avatar" :alt="p.name" />
                <span v-else>{{ (p.name || '?').charAt(0) }}</span>
              </div>
              <div class="persona-info">
                <div class="persona-name">
                  {{ p.name }}
                  <span v-if="p.default" class="default-badge">默认</span>
                </div>
                <div class="persona-sub">{{ p.soulPrompt?.slice(0, 30) || '...' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle: Persona Editor -->
        <div class="ai-col ai-col-mid">
          <div class="ai-col-header">
            <h3>✏️ 人设编辑</h3>
            <div class="ai-actions" v-if="selectedPersona">
              <button
                v-if="!selectedPersona.default"
                class="btn-ghost-sm"
                @click="setDefault(selectedPersona.id)"
              >设为默认</button>
              <button
                v-if="selectedPersona.id"
                class="btn-danger-sm"
                @click="removePersona(selectedPersona.id)"
              >删除</button>
              <button class="btn-primary-sm" @click="savePersona">💾 保存</button>
            </div>
          </div>

          <div v-if="!selectedPersona" class="ai-empty">从左侧选择或新建人设</div>
          <div v-else class="persona-editor">
            <div class="form-row">
              <label>角色名称</label>
              <input v-model="selectedPersona.name" class="form-input" placeholder="例如：Maru" />
            </div>
            <div class="form-row">
              <label>① FAB 主立绘（桌面小精灵大图）</label>
              <div class="avatar-upload-wrap">
                <input type="file" accept="image/*" ref="avatarInputRef" @change="(e) => onAvatarUpload(e, 'avatar')" style="display: none" />
                <div
                  class="avatar-upload-btn char-main"
                  @click="triggerAvatarUpload('avatar')"
                  :class="{ uploading: uploadingAvatar.field === 'avatar', hasImg: isImageAvatar(selectedPersona?.avatar) }"
                >
                  <template v-if="uploadingAvatar.field === 'avatar'">
                    <div class="avatar-loading">⏳ 上传中...</div>
                  </template>
                  <template v-else-if="isImageAvatar(selectedPersona?.avatar)">
                    <img :src="selectedPersona.avatar" alt="立绘" class="avatar-preview-img" />
                    <div class="avatar-overlay"><span>📷 点击更换</span></div>
                  </template>
                  <template v-else>
                    <div class="avatar-placeholder">
                      <div class="avatar-emoji-lg">{{ selectedPersona?.avatar || '🌸' }}</div>
                      <div class="avatar-hint">
                        <div class="avatar-hint-title">透明底立绘 PNG 推荐</div>
                        <div class="avatar-hint-sub">512×512 或更大，自动压缩至 1600px</div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="avatar-actions" v-if="isImageAvatar(selectedPersona?.avatar)">
                  <button type="button" class="btn-ghost-sm" @click.stop="triggerAvatarUpload('avatar')">更换</button>
                  <button type="button" class="btn-danger-sm" @click.stop="clearAvatar('avatar')">移除</button>
                </div>
              </div>
            </div>

            <div class="form-row">
              <label>② 聊天小头像（面板 Header + 消息气泡）</label>
              <div class="chat-avatar-row">
                <div
                  class="chat-avatar-circle"
                  @click="triggerAvatarUpload('chatAvatar')"
                  :class="{ uploading: uploadingAvatar.field === 'chatAvatar', hasImg: isImageAvatar(selectedPersona?.chatAvatar) }"
                >
                  <template v-if="uploadingAvatar.field === 'chatAvatar'">⏳</template>
                  <template v-else-if="isImageAvatar(selectedPersona?.chatAvatar)">
                    <img :src="selectedPersona.chatAvatar" alt="头像" />
                  </template>
                  <template v-else-if="isImageAvatar(selectedPersona?.avatar)">
                    <img :src="selectedPersona.avatar" alt="fallback" class="fallback-hint" />
                    <div class="ca-overlay">点击上传专属小头像</div>
                  </template>
                  <template v-else>📷</template>
                </div>
                <div class="chat-avatar-info">
                  <div class="ca-title">圆形裁剪，建议 256×256</div>
                  <div class="ca-sub">不上传则自动使用主立绘裁剪</div>
                  <div class="ca-actions" v-if="isImageAvatar(selectedPersona?.chatAvatar)">
                    <button type="button" class="btn-ghost-sm" @click.stop="triggerAvatarUpload('chatAvatar')">更换</button>
                    <button type="button" class="btn-danger-sm" @click.stop="clearAvatar('chatAvatar')">移除</button>
                  </div>
                </div>
                <input type="file" accept="image/*" ref="chatAvatarInputRef" @change="(e) => onAvatarUpload(e, 'chatAvatar')" style="display: none" />
              </div>
            </div>

            <div class="form-row">
              <label>③ 情绪立绘（8 种表情姿势，后续 AI 根据回复情绪自动切换）</label>
              <div class="expr-grid">
                <div v-for="expr in exprList" :key="expr.key" class="expr-item">
                  <div
                    class="expr-upload"
                    @click="triggerAvatarUpload(expr.field)"
                    :class="{ uploading: uploadingAvatar.field === expr.field, hasImg: isImageAvatar(selectedPersona?.[expr.field]) }"
                  >
                    <template v-if="uploadingAvatar.field === expr.field">⏳</template>
                    <template v-else-if="isImageAvatar(selectedPersona?.[expr.field])">
                      <img :src="selectedPersona[expr.field]" :alt="expr.label" />
                      <div class="expr-overlay">更换</div>
                    </template>
                    <template v-else>
                      <div class="expr-plus">＋</div>
                      <div class="expr-empty-label">未设置</div>
                    </template>
                  </div>
                  <div class="expr-label">
                    <span class="expr-emoji">{{ expr.emoji }}</span>
                    <span>{{ expr.label }}</span>
                  </div>
                  <button
                    v-if="isImageAvatar(selectedPersona?.[expr.field])"
                    type="button"
                    class="expr-clear"
                    @click.stop="clearAvatar(expr.field)"
                    title="移除"
                  >✕</button>
                </div>
              </div>
              <div class="expr-hint">💡 全部留空时，AI 将始终使用主立绘。上传的立绘保持相同姿势，只变表情效果最佳。</div>
            </div>
            <div class="form-row">
              <label>灵魂提示词（System Prompt）</label>
              <textarea v-model="selectedPersona.soulPrompt" rows="6" class="form-input mono" placeholder="你是一个...请以...的语气回答"></textarea>
            </div>
            <div class="form-row">
              <label>风格示例（Style Examples，每行一条）</label>
              <textarea v-model="selectedPersona.styleExamples" rows="5" class="form-input mono" placeholder="用户：你好&#10;助手：嘿~今天想聊点什么？"></textarea>
            </div>
            <div v-if="personaSaved" class="success-msg">{{ personaSaved }}</div>
            <div v-if="personaError" class="error-msg">{{ personaError }}</div>
          </div>
        </div>

        <!-- Right: RAG Stats + Chat Test -->
        <div class="ai-col ai-col-right">
          <div class="ai-col-header">
            <h3>📊 RAG 监控</h3>
          </div>
          <div class="rag-stats">
            <div class="rag-stat">
              <div class="rag-stat-num">{{ loadingRagStats ? '...' : (ragStatsData?.totalChunks ?? 0) }}</div>
              <div class="rag-stat-label">向量块总数</div>
            </div>
            <div class="rag-stat">
              <div class="rag-stat-num">{{ loadingRagStats ? '...' : (ragStatsData?.indexedPosts ?? 0) }}</div>
              <div class="rag-stat-label">已索引文章</div>
            </div>
            <div class="rag-stat">
              <div class="rag-stat-num">
                <span :class="ragStatsData?.embeddingAvailable ? 'ok' : 'bad'">
                  {{ loadingRagStats ? '...' : (ragStatsData?.embeddingAvailable ? '● 可用' : '○ 离线') }}
                </span>
              </div>
              <div class="rag-stat-label">Embedding 服务</div>
            </div>
          </div>
          <button class="btn-primary full-width" :disabled="reindexing" @click="doReindex">
            {{ reindexing ? '重建中...' : '🔄 全量重建索引' }}
          </button>
          <div v-if="reindexMsg" class="rag-msg" :class="{ error: reindexMsg.includes('失败') }">{{ reindexMsg }}</div>

          <div class="ai-col-header" style="margin-top: 20px;">
            <h3>💬 对话测试</h3>
            <button class="btn-ghost-sm" @click="clearChat">清空</button>
          </div>
          <div class="chat-test-area">
            <div class="chat-history">
              <div v-if="chatHistory.length === 0" class="ai-empty">输入消息开始测试 AI 对话</div>
              <div v-for="(m, i) in chatHistory" :key="i" class="chat-msg" :class="m.role">
                <div class="chat-bubble">{{ m.content }}</div>
                <div v-if="m.time" class="chat-time">{{ m.time }}</div>
              </div>
              <div v-if="chatLoading" class="chat-msg assistant">
                <div class="chat-bubble">思考中...</div>
              </div>
            </div>
            <div v-if="chatError" class="error-msg">{{ chatError }}</div>
            <div class="chat-input-row">
              <textarea
                v-model="chatInput"
                rows="2"
                class="form-input"
                placeholder="输入测试消息..."
                @keydown.enter.ctrl="sendChat"
              ></textarea>
              <button class="btn-primary" :disabled="chatLoading || !chatInput.trim()" @click="sendChat">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ban dialog -->
    <div v-if="pendingAction?.type === 'ban' && showOpModal" class="modal-overlay" @click.self="showOpModal = false">
      <div class="modal">
        <h3>封禁用户 #{{ pendingAction.userId }}</h3>
        <div class="form-row">
          <label>封禁时长（分钟）</label>
          <input v-model.number="banMinutes" type="number" min="1" class="form-input" />
        </div>
        <div class="form-row">
          <label>封禁原因</label>
          <textarea v-model="banReason" rows="3" class="form-input" placeholder="请输入封禁原因..."></textarea>
        </div>
        <div class="form-row">
          <label>管理员操作码</label>
          <input v-model="opCode" type="password" class="form-input" placeholder="opCode" />
        </div>
        <div v-if="opError" class="error-msg">{{ opError }}</div>
        <div v-if="opSuccess" class="success-msg">{{ opSuccess }}</div>
        <div class="modal-actions">
          <button class="btn-ghost" @click="showOpModal = false">取消</button>
          <button class="btn-danger" @click="confirmAction" :disabled="!opCode">确认封禁</button>
        </div>
      </div>
    </div>

    <!-- Unban / Promote dialog -->
    <div v-if="pendingAction?.type !== 'ban' && showOpModal" class="modal-overlay" @click.self="showOpModal = false">
      <div class="modal">
        <h3 v-if="pendingAction?.type === 'unban'">解封用户 #{{ pendingAction.userId }}</h3>
        <h3 v-else>临时提升用户 #{{ pendingAction.userId }}</h3>
        <p class="modal-desc">该操作需要管理员操作码确认。</p>
        <div class="form-row">
          <label>管理员操作码</label>
          <input v-model="opCode" type="password" class="form-input" placeholder="opCode" />
        </div>
        <div v-if="opError" class="error-msg">{{ opError }}</div>
        <div v-if="opSuccess" class="success-msg">{{ opSuccess }}</div>
        <div class="modal-actions">
          <button class="btn-ghost" @click="showOpModal = false">取消</button>
          <button
            v-if="pendingAction?.type === 'unban'"
            class="btn-warning"
            @click="confirmAction"
            :disabled="!opCode"
          >确认解封</button>
          <button v-else class="btn-primary" @click="confirmAction" :disabled="!opCode">确认提升</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page { max-width: 1400px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; }

.tabs {
  display: flex; gap: 4px; margin-bottom: 20px;
  border-bottom: 2px solid var(--border, #e5e7eb);
  flex-wrap: wrap;
}
.tab-btn {
  padding: 10px 18px; background: transparent; border: none;
  cursor: pointer; font-size: 14px; color: var(--text-muted, #666);
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: all 0.15s;
}
.tab-btn:hover { color: var(--text-color, #333); }
.tab-btn.active { color: var(--accent, #4f46e5); border-bottom-color: var(--accent, #4f46e5); }

.tab-content { background: var(--card-bg, #fff); border-radius: 8px; padding: 20px; }

.stats-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.stat-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #fff 100%);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px; padding: 24px; text-align: center;
}
.stat-num { font-size: 32px; font-weight: 700; color: var(--accent, #4f46e5); }
.stat-label { font-size: 13px; color: var(--text-muted, #666); margin-top: 4px; }

.toolbar { display: flex; gap: 10px; margin-bottom: 16px; }
.search-input {
  flex: 1; padding: 8px 12px; border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px; font-size: 14px;
}

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td {
  padding: 10px 12px; text-align: left; font-size: 14px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}
.data-table th { background: #f9fafb; font-weight: 600; color: var(--text-muted, #666); }
.data-table tr:hover { background: #f9fafb; }
.detail-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.role-tag {
  display: inline-block; padding: 2px 8px; border-radius: 12px;
  font-size: 12px; font-weight: 600;
}
.role-tag.admin { background: #fef3c7; color: #92400e; }
.role-tag.author { background: #dbeafe; color: #1e40af; }
.role-tag.member { background: #d1fae5; color: #065f46; }
.role-tag.guest { background: #f3f4f6; color: #6b7280; }

.ban-badge { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.ok-badge { background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.action-tag { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 12px; }

.actions { display: flex; gap: 6px; }
.btn-primary {
  padding: 8px 16px; background: var(--accent, #4f46e5); color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary-sm {
  padding: 4px 10px; background: var(--accent, #4f46e5); color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
}
.btn-primary-sm:hover { opacity: 0.9; }
.btn-danger {
  padding: 10px 20px; background: #dc2626; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-danger-sm {
  padding: 4px 10px; background: #dc2626; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
}
.btn-warning {
  padding: 10px 20px; background: #d97706; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-warning-sm {
  padding: 4px 10px; background: #d97706; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
}
.btn-ghost {
  padding: 10px 20px; background: transparent; color: var(--text-color, #333);
  border: 1px solid var(--border, #e5e7eb); border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-ghost-sm {
  padding: 4px 10px; background: transparent; color: var(--text-muted, #666);
  border: 1px solid var(--border, #e5e7eb); border-radius: 4px; cursor: pointer; font-size: 12px;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }

.pagination {
  display: flex; justify-content: center; align-items: center; gap: 16px;
  margin-top: 16px; font-size: 14px; color: var(--text-muted, #666);
}
.pagination button {
  padding: 6px 14px; border: 1px solid var(--border, #e5e7eb);
  background: transparent; border-radius: 6px; cursor: pointer;
}

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: var(--card-bg, #fff); border-radius: 12px; padding: 24px;
  width: 90%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal h3 { margin: 0 0 16px; font-size: 18px; }
.modal-desc { color: var(--text-muted, #666); font-size: 14px; margin-bottom: 16px; }
.form-row { margin-bottom: 14px; }
.form-row label { display: block; font-size: 13px; color: var(--text-muted, #666); margin-bottom: 4px; }
.form-input {
  width: 100%; padding: 8px 12px; border: 1px solid var(--border, #e5e7eb);
  border-radius: 6px; font-size: 14px; box-sizing: border-box; font-family: inherit;
  resize: vertical;
}
.form-input.mono { font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.error-msg { background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }
.success-msg { background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }

/* ===== AI Tab ===== */
.ai-tab { padding: 16px; }
.ai-columns {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  gap: 16px;
}
@media (max-width: 1100px) {
  .ai-columns { grid-template-columns: 1fr; }
}
.ai-col {
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  padding: 16px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}
.ai-col-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}
.ai-col-header h3 { margin: 0; font-size: 15px; }
.ai-actions { display: flex; gap: 6px; }
.ai-loading, .ai-empty {
  text-align: center; color: var(--text-muted, #888);
  padding: 40px 10px; font-size: 13px;
}

/* Persona list */
.persona-list { flex: 1; overflow-y: auto; }
.persona-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px; cursor: pointer;
  margin-bottom: 6px; border: 1px solid transparent;
  transition: background 0.15s;
}
.persona-item:hover { background: #f3f4f6; }
.persona-item.active { background: #eef2ff; border-color: var(--accent, #4f46e5); }
.persona-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent, #4f46e5); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 600; overflow: hidden; flex-shrink: 0;
}
.persona-avatar img { width: 100%; height: 100%; object-fit: cover; }
.persona-info { flex: 1; min-width: 0; }
.persona-name { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.persona-sub { font-size: 11px; color: var(--text-muted, #888); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.default-badge {
  background: #fef3c7; color: #92400e; font-size: 10px;
  padding: 1px 6px; border-radius: 8px; font-weight: 500;
}

/* Persona editor */
.persona-editor { flex: 1; overflow-y: auto; }

/* RAG stats */
.rag-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px; margin-bottom: 12px;
}
.rag-stat {
  background: #f9fafb; border-radius: 8px; padding: 12px; text-align: center;
}
.rag-stat-num {
  font-size: 22px; font-weight: 700; color: var(--accent, #4f46e5);
}
.rag-stat-num .ok { color: #059669; }
.rag-stat-num .bad { color: #dc2626; }
.rag-stat-label { font-size: 11px; color: var(--text-muted, #888); margin-top: 4px; }
.full-width { width: 100%; padding: 10px; }
.rag-msg {
  margin-top: 8px; font-size: 12px; padding: 8px 10px;
  background: #d1fae5; color: #065f46; border-radius: 6px;
}
.rag-msg.error { background: #fee2e2; color: #991b1b; }

/* Chat test */
.chat-test-area { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.chat-history {
  flex: 1; overflow-y: auto;
  background: #f9fafb; border-radius: 8px;
  padding: 10px; margin-bottom: 10px;
  min-height: 200px; max-height: 350px;
}
.chat-msg { margin-bottom: 10px; }
.chat-msg.user { text-align: right; }
.chat-msg.assistant { text-align: left; }
.chat-bubble {
  display: inline-block;
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
}
.chat-msg.user .chat-bubble {
  background: var(--accent, #4f46e5);
  color: #fff;
  border-bottom-right-radius: 2px;
}
.chat-msg.assistant .chat-bubble {
  background: #fff;
  color: #333;
  border: 1px solid var(--border, #e5e7eb);
  border-bottom-left-radius: 2px;
}
.chat-time { font-size: 10px; color: var(--text-muted, #aaa); margin-top: 2px; }
.chat-input-row { display: flex; gap: 8px; align-items: flex-end; }
.chat-input-row textarea { flex: 1; }

/* Avatar upload */
.avatar-upload-wrap { display: flex; flex-direction: column; gap: 8px; }
.avatar-upload-btn {
  width: 100%;
  min-height: 180px;
  border: 2px dashed var(--border, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  background: #fafafa;
}
.avatar-upload-btn:hover {
  border-color: var(--accent, #4f46e5);
  background: #f5f3ff;
}
.avatar-upload-btn.uploading {
  pointer-events: none;
  border-color: var(--accent, #4f46e5);
}
.avatar-upload-btn.hasImg {
  border-style: solid;
  border-color: var(--border, #e5e7eb);
  background: #fff;
}
.avatar-upload-btn.hasImg:hover {
  border-color: var(--accent, #4f46e5);
}
.avatar-preview-img {
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: contain;
  display: block;
  background: linear-gradient(135deg, #f5f3ff 0%, #fafafa 100%);
}
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}
.avatar-upload-btn.hasImg:hover .avatar-overlay { opacity: 1; }
.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
}
.avatar-emoji {
  font-size: 56px;
  line-height: 1;
}
.avatar-hint { text-align: center; }
.avatar-hint-title {
  font-size: 14px;
  color: var(--text-color, #333);
  font-weight: 500;
  margin-bottom: 4px;
}
.avatar-hint-sub {
  font-size: 12px;
  color: var(--text-muted, #888);
}
.avatar-loading {
  font-size: 14px;
  color: var(--accent, #4f46e5);
  font-weight: 500;
}
.avatar-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
.avatar-emoji-lg {
  font-size: 72px;
  line-height: 1;
}

/* Chat avatar circle upload */
.chat-avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #fafbff;
  border-radius: 12px;
  border: 1px solid #eee;
}
.chat-avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px dashed #d1d5db;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
  flex-shrink: 0;
  font-size: 28px;
  color: #aaa;
  transition: border-color 0.2s;
}
.chat-avatar-circle:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
}
.chat-avatar-circle.hasImg {
  border-style: solid;
  border-color: #e5e7eb;
  background: #fff;
}
.chat-avatar-circle.hasImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.chat-avatar-circle.uploading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
}
.ca-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  border-radius: 50%;
}
.fallback-hint { opacity: 0.7; }
.chat-avatar-info { flex: 1; min-width: 0; }
.ca-title { font-size: 13px; font-weight: 500; color: #333; }
.ca-sub { font-size: 11px; color: #888; margin-top: 2px; }
.ca-actions { margin-top: 6px; display: flex; gap: 6px; }

/* Expression grid */
.expr-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 8px;
}
.expr-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.expr-upload {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafbff;
  color: #aaa;
  font-size: 24px;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
}
.expr-upload:hover {
  border-color: #6c5ce7;
  background: #f5f3ff;
  color: #6c5ce7;
}
.expr-upload.hasImg {
  border-style: solid;
  border-color: #e5e7eb;
  background: #fff;
}
.expr-upload.hasImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.expr-upload.uploading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.85);
  border-radius: 8px;
}
.expr-plus { font-size: 28px; line-height: 1; }
.expr-empty-label { font-size: 10px; margin-top: 4px; }
.expr-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 11px;
  text-align: center;
  padding: 3px 0;
  opacity: 0;
  transition: opacity 0.2s;
}
.expr-upload.hasImg:hover .expr-overlay { opacity: 1; }
.expr-label {
  margin-top: 4px;
  font-size: 11px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 2px;
}
.expr-emoji { font-size: 12px; }
.expr-clear {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s;
}
.expr-item:hover .expr-clear { opacity: 1; }
.expr-hint {
  margin-top: 8px;
  font-size: 11px;
  color: #888;
  background: #fffbeb;
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 3px solid #fbbf24;
}
</style>