const fs = require('fs');

const adminVue = `<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { adminApi, aiApi, unwrap } from '@/api'
import { extractError } from '@/api'

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

// ========== AI / RAG ==========
const personas = ref<any[]>([])
const loadingPersonas = ref(false)
const selectedPersonaId = ref<number | null>(null)
const editingPersona = ref<any>(null)
const savingPersona = ref(false)
const personaMsg = ref('')

const ragStats = ref<any>(null)
const loadingRagStats = ref(false)
const reindexing = ref(false)
const reindexMsg = ref('')

const testInput = ref('')
const testReply = ref('')
const testLoading = ref(false)
const testSessionId = ref<number | null>(null)
const testHistory = ref<{ role: string; content: string }[]>([])

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

async function loadPersonas() {
  loadingPersonas.value = true
  try {
    const list = await aiApi.listPersonas()
    personas.value = list
    if (!selectedPersonaId.value && list.length > 0) {
      const def = list.find((p: any) => p.isDefault) || list[0]
      selectedPersonaId.value = def.id
      editingPersona.value = { ...def }
    }
  } catch (err: any) {
    personaMsg.value = extractError(err)
  } finally {
    loadingPersonas.value = false
  }
}

function selectPersona(p: any) {
  selectedPersonaId.value = p.id
  editingPersona.value = { ...p }
  personaMsg.value = ''
}

function newPersona() {
  editingPersona.value = {
    name: '新角色',
    avatar: '🌸',
    soulPrompt: '',
    styleExamples: '',
    isDefault: false
  }
  selectedPersonaId.value = null
  personaMsg.value = ''
}

async function savePersona() {
  if (!editingPersona.value) return
  savingPersona.value = true
  personaMsg.value = ''
  try {
    let saved: any
    if (editingPersona.value.id) {
      saved = await aiApi.updatePersona(editingPersona.value)
    } else {
      saved = await aiApi.createPersona(editingPersona.value)
    }
    personaMsg.value = '✓ 已保存'
    selectedPersonaId.value = saved.id
    await loadPersonas()
  } catch (err: any) {
    personaMsg.value = extractError(err)
  } finally {
    savingPersona.value = false
  }
}

async function makeDefault(id: number) {
  try {
    await aiApi.setDefaultPersona(id)
    personaMsg.value = '✓ 已设为默认'
    await loadPersonas()
  } catch (err: any) {
    personaMsg.value = extractError(err)
  }
}

async function removePersona(id: number) {
  if (!confirm('确定删除此人设？')) return
  try {
    await aiApi.deletePersona(id)
    personaMsg.value = '✓ 已删除'
    editingPersona.value = null
    selectedPersonaId.value = null
    await loadPersonas()
  } catch (err: any) {
    personaMsg.value = extractError(err)
  }
}

async function loadRagStats() {
  loadingRagStats.value = true
  try {
    ragStats.value = await aiApi.ragStats()
  } catch (err: any) {
    ragStats.value = { error: extractError(err) }
  } finally {
    loadingRagStats.value = false
  }
}

async function doReindex() {
  if (!confirm('全量重建索引可能耗时较长，确认继续？')) return
  reindexing.value = true
  reindexMsg.value = ''
  try {
    const res = await aiApi.reindexAll()
    reindexMsg.value = res.message || ('✓ 完成：' + res.chunks + ' 个文本块，耗时 ' + res.elapsedMs + 'ms')
    await loadRagStats()
  } catch (err: any) {
    reindexMsg.value = extractError(err)
  } finally {
    reindexing.value = false
  }
}

async function sendTestChat() {
  if (!testInput.value.trim() || testLoading.value) return
  testLoading.value = true
  testReply.value = ''
  try {
    testHistory.value.push({ role: 'USER', content: testInput.value })
    const res = await aiApi.chat({
      content: testInput.value,
      sessionId: testSessionId.value
    })
    testSessionId.value = res.sessionId
    testReply.value = res.reply || '(无回复)'
    testHistory.value.push({ role: 'ASSISTANT', content: res.reply || '(无回复)' })
    testInput.value = ''
  } catch (err: any) {
    testReply.value = '发送失败：' + extractError(err)
  } finally {
    testLoading.value = false
  }
}

function clearTestChat() {
  testSessionId.value = null
  testHistory.value = []
  testReply.value = ''
  testInput.value = ''
}

function switchTab(tab: TabKey) {
  activeTab.value = tab
  opError.value = ''
  opSuccess.value = ''
  if (tab === 'dashboard' && Object.keys(stats.value).length === 0) loadStats()
  if (tab === 'users' && users.value.length === 0) loadUsers()
  if (tab === 'bans' && bans.value.length === 0) loadBans()
  if (tab === 'logs' && logs.value.length === 0) loadLogs()
  if (tab === 'ai') {
    if (!editingPersona.value) loadPersonas()
    if (!ragStats.value) loadRagStats()
  }
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

    <!-- AI / RAG -->
    <div v-if="activeTab === 'ai'" class="tab-content ai-tab">
      <div class="ai-layout">
        <!-- Persona List -->
        <div class="ai-sidebar">
          <div class="ai-sidebar-header">
            <h3>🎭 人设列表</h3>
            <button class="btn-primary btn-sm" @click="newPersona()">+ 新建</button>
          </div>
          <div v-if="loadingPersonas" style="padding: 12px; color: var(--text-muted);">加载中...</div>
          <div v-else class="persona-list">
            <div
              v-for="p in personas"
              :key="p.id"
              class="persona-item"
              :class="{ active: selectedPersonaId === p.id }"
              @click="selectPersona(p)"
            >
              <span class="persona-avatar">{{ p.avatar || '🌸' }}</span>
              <span class="persona-name">{{ p.name }}</span>
              <span v-if="p.isDefault" class="persona-default">默认</span>
            </div>
            <div v-if="personas.length === 0" class="empty-hint">暂无人设</div>
          </div>
        </div>

        <!-- Persona Editor -->
        <div class="ai-editor">
          <h3>✏️ 人设编辑</h3>
          <div v-if="!editingPersona" class="empty-hint" style="padding: 40px;">
            从左侧选择人设，或点击「新建」创建
          </div>
          <div v-else class="persona-form">
            <div class="form-row">
              <label>名称</label>
              <input v-model="editingPersona.name" class="form-input" placeholder="Maru" />
            </div>
            <div class="form-row">
              <label>头像（Emoji 或 URL）</label>
              <input v-model="editingPersona.avatar" class="form-input" placeholder="🌸" />
            </div>
            <div class="form-row">
              <label>灵魂提示词 / System Prompt</label>
              <textarea v-model="editingPersona.soulPrompt" rows="6" class="form-input mono" placeholder="你是..."></textarea>
            </div>
            <div class="form-row">
              <label>风格示例（few-shot）</label>
              <textarea v-model="editingPersona.styleExamples" rows="6" class="form-input mono" placeholder="参考语气..."></textarea>
            </div>
            <div v-if="personaMsg" class="persona-msg">{{ personaMsg }}</div>
            <div class="persona-actions">
              <button class="btn-primary" @click="savePersona" :disabled="savingPersona">
                {{ savingPersona ? '保存中...' : '💾 保存' }}
              </button>
              <button v-if="editingPersona.id && !editingPersona.isDefault" class="btn-ghost" @click="makeDefault(editingPersona.id)">
                ⭐ 设为默认
              </button>
              <button v-if="editingPersona.id" class="btn-danger" @click="removePersona(editingPersona.id)">🗑️ 删除</button>
            </div>
          </div>
        </div>

        <!-- RAG Panel -->
        <div class="ai-rag">
          <!-- RAG Stats -->
          <div class="rag-section">
            <h3>📊 RAG 向量库监控</h3>
            <div v-if="loadingRagStats" style="color: var(--text-muted);">加载中...</div>
            <div v-else-if="ragStats?.error" class="error-msg">{{ ragStats.error }}</div>
            <div v-else class="rag-stats">
              <div class="rag-stat-item">
                <div class="rag-stat-num">{{ ragStats?.totalChunks ?? 0 }}</div>
                <div class="rag-stat-label">向量块总数</div>
              </div>
              <div class="rag-stat-item">
                <div class="rag-stat-num">{{ ragStats?.indexedPosts ?? 0 }}</div>
                <div class="rag-stat-label">已索引文章</div>
              </div>
              <div class="rag-stat-item">
                <div class="rag-stat-num" :style="{ color: ragStats?.embeddingAvailable ? '#059669' : '#dc2626' }">
                  {{ ragStats?.embeddingAvailable ? '✓ 可用' : '✗ 未配置' }}
                </div>
                <div class="rag-stat-label">Embedding 服务</div>
              </div>
            </div>
            <div class="rag-reindex">
              <button class="btn-warning" @click="doReindex" :disabled="reindexing">
                {{ reindexing ? '重建中...' : '🔄 全量重建索引' }}
              </button>
              <button class="btn-ghost btn-sm" @click="loadRagStats()" :disabled="loadingRagStats">刷新</button>
            </div>
            <div v-if="reindexMsg" class="persona-msg">{{ reindexMsg }}</div>
          </div>

          <!-- Chat Test -->
          <div class="rag-section">
            <h3>💬 RAG 对话测试</h3>
            <div class="test-history">
              <div v-if="testHistory.length === 0" class="empty-hint" style="padding: 20px;">输入消息测试 AI 回复</div>
              <div v-for="(m, i) in testHistory" :key="i" class="test-msg" :class="m.role.toLowerCase()">
                <span class="test-role">{{ m.role === 'USER' ? '👤' : '🤖' }}</span>
                <span class="test-content">{{ m.content }}</span>
              </div>
            </div>
            <div v-if="testReply && testHistory.length > 0" class="test-reply-last">
              <strong>🤖 最近回复:</strong>
              <div class="reply-box">{{ testReply }}</div>
            </div>
            <div class="test-input-row">
              <textarea
                v-model="testInput"
                rows="2"
                class="form-input"
                placeholder="输入测试消息，按 Enter 发送"
                @keydown.enter.exact.prevent="sendTestChat"
                :disabled="testLoading"
              ></textarea>
              <button class="btn-primary" @click="sendTestChat" :disabled="!testInput.trim() || testLoading">
                {{ testLoading ? '...' : '发送' }}
              </button>
              <button class="btn-ghost btn-sm" @click="clearTestChat">清空</button>
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
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-danger {
  padding: 8px 16px; background: #dc2626; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-danger-sm {
  padding: 4px 10px; background: #dc2626; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
}
.btn-warning {
  padding: 8px 16px; background: #d97706; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
}
.btn-warning-sm {
  padding: 4px 10px; background: #d97706; color: #fff;
  border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
}
.btn-ghost {
  padding: 8px 16px; background: transparent; color: var(--text-color, #333);
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
.form-input.mono { font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.5; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.error-msg { background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }
.success-msg { background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }

/* ===== AI Tab ===== */
.ai-tab { padding: 0; }
.ai-layout {
  display: grid;
  grid-template-columns: 220px 1fr 340px;
  gap: 0;
  min-height: 600px;
}

.ai-sidebar {
  border-right: 1px solid var(--border, #e5e7eb);
  padding: 16px;
  background: #fafafa;
}
.ai-sidebar-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
}
.ai-sidebar-header h3 { margin: 0; font-size: 14px; }

.persona-list { display: flex; flex-direction: column; gap: 4px; }
.persona-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 6px;
  cursor: pointer; font-size: 13px;
  transition: background 0.15s;
}
.persona-item:hover { background: #eef2ff; }
.persona-item.active { background: #e0e7ff; color: #4338ca; }
.persona-avatar { font-size: 18px; }
.persona-name { flex: 1; }
.persona-default {
  background: #10b981; color: #fff; font-size: 10px;
  padding: 1px 6px; border-radius: 8px;
}
.empty-hint { color: var(--text-muted, #999); font-size: 13px; text-align: center; }

.ai-editor {
  padding: 20px;
  border-right: 1px solid var(--border, #e5e7eb);
}
.ai-editor h3 { margin: 0 0 16px; font-size: 15px; }
.persona-form { max-width: 100%; }
.persona-actions {
  display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;
}
.persona-msg {
  margin-top: 12px; padding: 8px 12px; border-radius: 6px;
  background: #d1fae5; color: #065f46; font-size: 13px;
}

.ai-rag { display: flex; flex-direction: column; }
.rag-section {
  padding: 16px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}
.rag-section:last-child { border-bottom: none; }
.rag-section h3 { margin: 0 0 12px; font-size: 14px; }

.rag-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; margin-bottom: 12px;
}
.rag-stat-item {
  background: #f0f4ff; border-radius: 8px; padding: 12px 8px;
  text-align: center;
}
.rag-stat-num { font-size: 20px; font-weight: 700; color: #4f46e5; }
.rag-stat-label { font-size: 11px; color: var(--text-muted, #666); margin-top: 2px; }

.rag-reindex { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.test-history {
  max-height: 200px; overflow-y: auto;
  border: 1px solid var(--border, #e5e7eb); border-radius: 6px;
  padding: 8px; margin-bottom: 10px;
  background: #fafafa;
}
.test-msg {
  display: flex; gap: 6px; margin-bottom: 6px;
  font-size: 13px; line-height: 1.5;
}
.test-msg.user .test-content { color: #4338ca; }
.test-msg.assistant .test-content { color: #065f46; }
.test-role { flex-shrink: 0; }
.test-content { word-break: break-word; }

.test-reply-last {
  margin-bottom: 10px; font-size: 13px;
}
.reply-box {
  margin-top: 4px; padding: 10px;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;
  white-space: pre-wrap; font-size: 13px; line-height: 1.6;
}

.test-input-row {
  display: flex; gap: 8px; align-items: flex-end;
}
.test-input-row textarea { flex: 1; min-height: 50px; }

@media (max-width: 1100px) {
  .ai-layout {
    grid-template-columns: 1fr;
  }
  .ai-sidebar, .ai-editor, .ai-rag {
    border-right: none;
    border-bottom: 1px solid var(--border, #e5e7eb);
  }
}
</style>
`;

fs.writeFileSync('d:/VSCodeFiles/Marublog-v2/frontend/src/views/Admin.vue', adminVue, 'utf8');
console.log('Admin.vue: fully rewritten with AI/RAG tab');
console.log('Length:', adminVue.length, 'chars');