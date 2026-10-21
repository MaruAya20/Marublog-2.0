<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { adminApi, unwrap } from '@/api'
import { extractError } from '@/api'

type TabKey = 'dashboard' | 'users' | 'bans' | 'logs'

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
</script>

<template>
  <div class="admin-page">
    <h1 class="page-title">🛡️ 管理后台</h1>

    <div class="tabs">
      <button
        v-for="t in [{ k: 'dashboard', n: '📊 仪表盘' }, { k: 'users', n: '👥 用户管理' }, { k: 'bans', n: '🚫 封禁列表' }, { k: 'logs', n: '📝 操作日志' }]"
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
.admin-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { font-size: 24px; margin-bottom: 20px; }

.tabs {
  display: flex; gap: 4px; margin-bottom: 20px;
  border-bottom: 2px solid var(--border, #e5e7eb);
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
}
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.error-msg { background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }
.success-msg { background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 8px; }
</style>
