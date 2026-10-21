import { ref } from 'vue';
import { adminApi } from '@/api';
import { extractError } from '@/api';
const activeTab = ref('dashboard');
const stats = ref({});
const loadingStats = ref(false);
const users = ref([]);
const userTotal = ref(0);
const userPage = ref(0);
const userKeyword = ref('');
const loadingUsers = ref(false);
const bans = ref([]);
const banTotal = ref(0);
const banPage = ref(0);
const loadingBans = ref(false);
const logs = ref([]);
const logTotal = ref(0);
const logPage = ref(0);
const loadingLogs = ref(false);
const opCode = ref('');
const showOpModal = ref(false);
const pendingAction = ref(null);
const opError = ref('');
const opSuccess = ref('');
const PAGE_SIZE = 20;
async function loadStats() {
    loadingStats.value = true;
    try {
        stats.value = await adminApi.stats();
    }
    catch { }
    finally {
        loadingStats.value = false;
    }
}
async function loadUsers() {
    loadingUsers.value = true;
    try {
        const res = await adminApi.listUsers({
            keyword: userKeyword.value || undefined,
            page: userPage.value,
            pageSize: PAGE_SIZE
        });
        users.value = res.users;
        userTotal.value = res.total;
    }
    catch { }
    finally {
        loadingUsers.value = false;
    }
}
async function loadBans() {
    loadingBans.value = true;
    try {
        const res = await adminApi.listBans({ page: banPage.value, pageSize: PAGE_SIZE });
        bans.value = res.bans;
        banTotal.value = res.total;
    }
    catch { }
    finally {
        loadingBans.value = false;
    }
}
async function loadLogs() {
    loadingLogs.value = true;
    try {
        const res = await adminApi.listLogs({ page: logPage.value, pageSize: PAGE_SIZE });
        logs.value = res.logs;
        logTotal.value = res.total;
    }
    catch { }
    finally {
        loadingLogs.value = false;
    }
}
function switchTab(tab) {
    activeTab.value = tab;
    opError.value = '';
    opSuccess.value = '';
    if (tab === 'dashboard' && Object.keys(stats.value).length === 0)
        loadStats();
    if (tab === 'users' && users.value.length === 0)
        loadUsers();
    if (tab === 'bans' && bans.value.length === 0)
        loadBans();
    if (tab === 'logs' && logs.value.length === 0)
        loadLogs();
}
function openOpModal(type, userId, extra) {
    pendingAction.value = { type, userId, extra };
    opCode.value = '';
    opError.value = '';
    opSuccess.value = '';
    showOpModal.value = true;
}
async function confirmAction() {
    if (!pendingAction.value || !opCode.value)
        return;
    opError.value = '';
    opSuccess.value = '';
    try {
        const p = pendingAction.value;
        if (p.type === 'ban') {
            await adminApi.banUser({
                userId: p.userId,
                minutes: p.extra.minutes,
                reason: p.extra.reason,
                opCode: opCode.value
            });
            opSuccess.value = '封禁成功';
        }
        else if (p.type === 'unban') {
            await adminApi.unbanUser({ userId: p.userId, reason: p.extra?.reason || '', opCode: opCode.value });
            opSuccess.value = '解封成功';
        }
        else if (p.type === 'promote') {
            await adminApi.promote({ userId: p.userId, opCode: opCode.value });
            opSuccess.value = '已临时提升（30分钟）';
        }
        setTimeout(() => {
            showOpModal.value = false;
            pendingAction.value = null;
            loadStats();
            loadUsers();
            loadBans();
        }, 800);
    }
    catch (err) {
        opError.value = extractError(err);
    }
}
const banMinutes = ref(60);
const banReason = ref('');
function banFlow(userId) {
    banMinutes.value = 60;
    banReason.value = '';
    openOpModal('ban', userId, { minutes: banMinutes.value, reason: banReason.value });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "admin-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tabs" },
});
for (const [t] of __VLS_getVForSourceType(([{ k: 'dashboard', n: '📊 仪表盘' }, { k: 'users', n: '👥 用户管理' }, { k: 'bans', n: '🚫 封禁列表' }, { k: 'logs', n: '📝 操作日志' }]))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.switchTab(t.k);
            } },
        key: (t.k),
        ...{ class: "tab-btn" },
        ...{ class: ({ active: __VLS_ctx.activeTab === t.k }) },
    });
    (t.n);
}
if (__VLS_ctx.activeTab === 'dashboard') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tab-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stats-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-num" },
    });
    (__VLS_ctx.loadingStats ? '...' : (__VLS_ctx.stats.totalUsers ?? 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-num" },
    });
    (__VLS_ctx.loadingStats ? '...' : (__VLS_ctx.stats.totalPosts ?? 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-num" },
    });
    (__VLS_ctx.loadingStats ? '...' : (__VLS_ctx.stats.totalComments ?? 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-num" },
    });
    (__VLS_ctx.loadingStats ? '...' : (__VLS_ctx.stats.totalBans ?? 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-label" },
    });
}
if (__VLS_ctx.activeTab === 'users') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tab-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "toolbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onKeyup: (...[$event]) => {
                if (!(__VLS_ctx.activeTab === 'users'))
                    return;
                __VLS_ctx.userPage = 0;
                __VLS_ctx.loadUsers();
            } },
        placeholder: "按邮箱或名字搜索用户...",
        ...{ class: "search-input" },
    });
    (__VLS_ctx.userKeyword);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.activeTab === 'users'))
                    return;
                __VLS_ctx.userPage = 0;
                __VLS_ctx.loadUsers();
            } },
        ...{ class: "btn-primary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "data-table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [u] of __VLS_getVForSourceType((__VLS_ctx.users))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (u.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (u.id);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (u.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (u.email);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "role-tag" },
            ...{ class: ((u.role || '').toLowerCase()) },
        });
        (u.role);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (u.level ?? 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        if (u.banned) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ban-badge" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ok-badge" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "actions" },
        });
        if (!u.banned) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 'users'))
                            return;
                        if (!(!u.banned))
                            return;
                        __VLS_ctx.banFlow(u.id);
                    } },
                ...{ class: "btn-danger-sm" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 'users'))
                            return;
                        if (!!(!u.banned))
                            return;
                        __VLS_ctx.openOpModal('unban', u.id, { reason: '手动解封' });
                    } },
                ...{ class: "btn-warning-sm" },
            });
        }
        if (u.role !== 'ADMIN') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.activeTab === 'users'))
                            return;
                        if (!(u.role !== 'ADMIN'))
                            return;
                        __VLS_ctx.openOpModal('promote', u.id);
                    } },
                ...{ class: "btn-ghost-sm" },
            });
        }
    }
    if (!__VLS_ctx.loadingUsers && __VLS_ctx.users.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            colspan: "7",
            ...{ style: {} },
        });
    }
    if (__VLS_ctx.userTotal > __VLS_ctx.PAGE_SIZE) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pagination" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'users'))
                        return;
                    if (!(__VLS_ctx.userTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.userPage--;
                    __VLS_ctx.loadUsers();
                } },
            disabled: (__VLS_ctx.userPage === 0),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.userPage + 1);
        (Math.ceil(__VLS_ctx.userTotal / __VLS_ctx.PAGE_SIZE));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'users'))
                        return;
                    if (!(__VLS_ctx.userTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.userPage++;
                    __VLS_ctx.loadUsers();
                } },
            disabled: ((__VLS_ctx.userPage + 1) * __VLS_ctx.PAGE_SIZE >= __VLS_ctx.userTotal),
        });
    }
}
if (__VLS_ctx.activeTab === 'bans') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tab-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "data-table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [b] of __VLS_getVForSourceType((__VLS_ctx.bans))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (b.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (b.id);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (b.userName || '#' + b.userId);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (b.email);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (b.reason || '-');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (b.permanent ? '永久' : (b.until?.slice(0, 16) || '-'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "actions" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'bans'))
                        return;
                    __VLS_ctx.openOpModal('unban', b.userId, { reason: '封禁列表解封' });
                } },
            ...{ class: "btn-warning-sm" },
        });
    }
    if (!__VLS_ctx.loadingBans && __VLS_ctx.bans.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            colspan: "6",
            ...{ style: {} },
        });
    }
    if (__VLS_ctx.banTotal > __VLS_ctx.PAGE_SIZE) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pagination" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'bans'))
                        return;
                    if (!(__VLS_ctx.banTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.banPage--;
                    __VLS_ctx.loadBans();
                } },
            disabled: (__VLS_ctx.banPage === 0),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.banPage + 1);
        (Math.ceil(__VLS_ctx.banTotal / __VLS_ctx.PAGE_SIZE));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'bans'))
                        return;
                    if (!(__VLS_ctx.banTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.banPage++;
                    __VLS_ctx.loadBans();
                } },
            disabled: ((__VLS_ctx.banPage + 1) * __VLS_ctx.PAGE_SIZE >= __VLS_ctx.banTotal),
        });
    }
}
if (__VLS_ctx.activeTab === 'logs') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tab-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "data-table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [l] of __VLS_getVForSourceType((__VLS_ctx.logs))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (l.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (l.createdAt?.slice(0, 19).replace('T', ' '));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (l.adminName || '#' + l.adminId);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "action-tag" },
        });
        (l.action);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "detail-cell" },
        });
        (l.detail);
    }
    if (!__VLS_ctx.loadingLogs && __VLS_ctx.logs.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            colspan: "4",
            ...{ style: {} },
        });
    }
    if (__VLS_ctx.logTotal > __VLS_ctx.PAGE_SIZE) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pagination" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'logs'))
                        return;
                    if (!(__VLS_ctx.logTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.logPage--;
                    __VLS_ctx.loadLogs();
                } },
            disabled: (__VLS_ctx.logPage === 0),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.logPage + 1);
        (Math.ceil(__VLS_ctx.logTotal / __VLS_ctx.PAGE_SIZE));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'logs'))
                        return;
                    if (!(__VLS_ctx.logTotal > __VLS_ctx.PAGE_SIZE))
                        return;
                    __VLS_ctx.logPage++;
                    __VLS_ctx.loadLogs();
                } },
            disabled: ((__VLS_ctx.logPage + 1) * __VLS_ctx.PAGE_SIZE >= __VLS_ctx.logTotal),
        });
    }
}
if (__VLS_ctx.pendingAction?.type === 'ban' && __VLS_ctx.showOpModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.pendingAction?.type === 'ban' && __VLS_ctx.showOpModal))
                    return;
                __VLS_ctx.showOpModal = false;
            } },
        ...{ class: "modal-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    (__VLS_ctx.pendingAction.userId);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "number",
        min: "1",
        ...{ class: "form-input" },
    });
    (__VLS_ctx.banMinutes);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.banReason),
        rows: "3",
        ...{ class: "form-input" },
        placeholder: "请输入封禁原因...",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "password",
        ...{ class: "form-input" },
        placeholder: "opCode",
    });
    (__VLS_ctx.opCode);
    if (__VLS_ctx.opError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "error-msg" },
        });
        (__VLS_ctx.opError);
    }
    if (__VLS_ctx.opSuccess) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "success-msg" },
        });
        (__VLS_ctx.opSuccess);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.pendingAction?.type === 'ban' && __VLS_ctx.showOpModal))
                    return;
                __VLS_ctx.showOpModal = false;
            } },
        ...{ class: "btn-ghost" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.confirmAction) },
        ...{ class: "btn-danger" },
        disabled: (!__VLS_ctx.opCode),
    });
}
if (__VLS_ctx.pendingAction?.type !== 'ban' && __VLS_ctx.showOpModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.pendingAction?.type !== 'ban' && __VLS_ctx.showOpModal))
                    return;
                __VLS_ctx.showOpModal = false;
            } },
        ...{ class: "modal-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal" },
    });
    if (__VLS_ctx.pendingAction?.type === 'unban') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.pendingAction.userId);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (__VLS_ctx.pendingAction.userId);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "modal-desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "password",
        ...{ class: "form-input" },
        placeholder: "opCode",
    });
    (__VLS_ctx.opCode);
    if (__VLS_ctx.opError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "error-msg" },
        });
        (__VLS_ctx.opError);
    }
    if (__VLS_ctx.opSuccess) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "success-msg" },
        });
        (__VLS_ctx.opSuccess);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.pendingAction?.type !== 'ban' && __VLS_ctx.showOpModal))
                    return;
                __VLS_ctx.showOpModal = false;
            } },
        ...{ class: "btn-ghost" },
    });
    if (__VLS_ctx.pendingAction?.type === 'unban') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.confirmAction) },
            ...{ class: "btn-warning" },
            disabled: (!__VLS_ctx.opCode),
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.confirmAction) },
            ...{ class: "btn-primary" },
            disabled: (!__VLS_ctx.opCode),
        });
    }
}
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-num']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-num']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-num']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-num']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['ban-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['ok-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-table']} */ ;
/** @type {__VLS_StyleScopedClasses['action-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['success-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['success-msg']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activeTab: activeTab,
            stats: stats,
            loadingStats: loadingStats,
            users: users,
            userTotal: userTotal,
            userPage: userPage,
            userKeyword: userKeyword,
            loadingUsers: loadingUsers,
            bans: bans,
            banTotal: banTotal,
            banPage: banPage,
            loadingBans: loadingBans,
            logs: logs,
            logTotal: logTotal,
            logPage: logPage,
            loadingLogs: loadingLogs,
            opCode: opCode,
            showOpModal: showOpModal,
            pendingAction: pendingAction,
            opError: opError,
            opSuccess: opSuccess,
            PAGE_SIZE: PAGE_SIZE,
            loadUsers: loadUsers,
            loadBans: loadBans,
            loadLogs: loadLogs,
            switchTab: switchTab,
            openOpModal: openOpModal,
            confirmAction: confirmAction,
            banMinutes: banMinutes,
            banReason: banReason,
            banFlow: banFlow,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
