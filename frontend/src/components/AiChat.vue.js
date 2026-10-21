/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, nextTick } from 'vue';
import { api, unwrap } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const auth = useAuthStore();
const router = useRouter();
const open = ref(false);
const sessions = ref([]);
const currentSessionId = ref(null);
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const messagesWrap = ref();
const inputRef = ref();
const unread = ref(0);
const quickPrompts = ['介绍一下 MaruBlog', '怎么写文章？', '如何评论？'];
async function loadSessions() {
    if (!auth.isLoggedIn) {
        sessions.value = [];
        return;
    }
    try {
        const res = await api.get('/ai/sessions');
        sessions.value = unwrap(res) || [];
        if (sessions.value.length > 0 && !currentSessionId.value) {
            currentSessionId.value = sessions.value[0].id;
            await loadMessages(currentSessionId.value);
        }
    }
    catch { }
}
async function loadMessages(sessionId) {
    try {
        const res = await api.get(`/ai/sessions/${sessionId}/messages`);
        messages.value = unwrap(res) || [];
        await nextTick();
        scrollToBottom();
    }
    catch { }
}
async function selectSession(s) {
    currentSessionId.value = s.id;
    await loadMessages(s.id);
}
async function newSession() {
    try {
        const res = await api.post('/ai/sessions', {});
        const session = unwrap(res);
        sessions.value.unshift(session);
        currentSessionId.value = session.id;
        messages.value = [];
        await nextTick();
        inputRef.value?.focus();
    }
    catch { }
}
async function deleteSession(id) {
    if (!confirm('确定删除此对话？'))
        return;
    try {
        await api.delete(`/ai/sessions/${id}`);
        sessions.value = sessions.value.filter(s => s.id !== id);
        if (currentSessionId.value === id) {
            currentSessionId.value = sessions.value[0]?.id || null;
            if (currentSessionId.value)
                await loadMessages(currentSessionId.value);
            else
                messages.value = [];
        }
    }
    catch { }
}
async function sendMessage(text) {
    const content = (text ?? input.value).trim();
    if (!content || loading.value)
        return;
    if (auth.isLoggedIn && !currentSessionId.value) {
        try {
            const res = await api.post('/ai/sessions', {});
            currentSessionId.value = unwrap(res).id;
            sessions.value.unshift(unwrap(res));
        }
        catch {
            return;
        }
    }
    input.value = '';
    loading.value = true;
    const userMsg = { id: Date.now(), role: 'USER', content };
    messages.value.push(userMsg);
    await nextTick();
    scrollToBottom();
    try {
        const payload = { content };
        if (currentSessionId.value)
            payload.sessionId = currentSessionId.value;
        const res = await api.post('/ai/chat', payload);
        const d = unwrap(res);
        if (d && d.sessionId && !currentSessionId.value) {
            currentSessionId.value = d.sessionId;
        }
        messages.value.push({ role: 'ASSISTANT', content: d?.reply || '(无回复)', id: Date.now() + 1 });
        if (auth.isLoggedIn && Array.isArray(sessions.value)) {
            const s = sessions.value.find((x) => x.id === currentSessionId.value);
            if (s && (!s.title || s.title === '新对话')) {
                s.title = content.length > 20 ? content.substring(0, 20) + '...' : content;
            }
        }
    }
    catch (err) {
        const msg = err?.message || '发送失败';
        messages.value.push({ id: Date.now() + 1, role: 'ASSISTANT', content: '抱歉，发送失败：' + msg });
    }
    finally {
        loading.value = false;
        await nextTick();
        scrollToBottom();
    }
}
function scrollToBottom() {
    if (messagesWrap.value) {
        messagesWrap.value.scrollTop = messagesWrap.value.scrollHeight;
    }
}
function autoResize() {
    const el = inputRef.value;
    if (!el)
        return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
function formatMsg(text) {
    if (!text)
        return '';
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}
function goLogin() {
    router.push('/login');
}
onMounted(() => {
    loadSessions();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ai-fab']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-close']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-new']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-del']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-del']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['session-del']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-prompts']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-prompts']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-row']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-row']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['ai']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['typing']} */ ;
/** @type {__VLS_StyleScopedClasses['typing']} */ ;
/** @type {__VLS_StyleScopedClasses['typing']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-sidebar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ai-chat-widget" },
});
if (!__VLS_ctx.open) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.open))
                    return;
                __VLS_ctx.open = true;
            } },
        ...{ class: "ai-fab" },
        title: "AI 助手 Maru",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "fab-icon" },
    });
    if (__VLS_ctx.unread > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "fab-badge" },
        });
        (__VLS_ctx.unread > 9 ? '9+' : __VLS_ctx.unread);
    }
}
if (__VLS_ctx.open) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-panel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-header-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ai-avatar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-title-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ai-title-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.open))
                    return;
                __VLS_ctx.open = false;
            } },
        ...{ class: "ai-close" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-sidebar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.newSession) },
        ...{ class: "sidebar-new" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "session-list" },
    });
    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.sessions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.open))
                        return;
                    __VLS_ctx.selectSession(s);
                } },
            key: (s.id),
            ...{ class: "session-item" },
            ...{ class: ({ active: s.id === __VLS_ctx.currentSessionId }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "session-title" },
        });
        (s.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.open))
                        return;
                    __VLS_ctx.deleteSession(s.id);
                } },
            ...{ class: "session-del" },
            title: "删除",
        });
    }
    if (__VLS_ctx.sessions.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "session-empty" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-chat-area" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "messages-wrap" },
        ref: "messagesWrap",
    });
    /** @type {typeof __VLS_ctx.messagesWrap} */ ;
    if (__VLS_ctx.messages.length === 0 && !__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "welcome" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "welcome-emoji" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "welcome-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "quick-prompts" },
        });
        for (const [p] of __VLS_getVForSourceType((__VLS_ctx.quickPrompts))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.open))
                            return;
                        if (!(__VLS_ctx.messages.length === 0 && !__VLS_ctx.loading))
                            return;
                        __VLS_ctx.sendMessage(p);
                    } },
                key: (p),
            });
            (p);
        }
    }
    for (const [m] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (m.id),
            ...{ class: "msg-row" },
            ...{ class: (m.role === 'USER' ? 'user' : 'ai') },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-bubble" },
            ...{ class: (m.role === 'USER' ? 'user' : 'ai') },
        });
        if (m.role === 'ASSISTANT') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "msg-avatar" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-content" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formatMsg(m.content)) }, null, null);
    }
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-row ai" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-bubble ai" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "msg-avatar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "typing" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-area" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        ...{ onKeydown: (...[$event]) => {
                if (!(__VLS_ctx.open))
                    return;
                __VLS_ctx.sendMessage();
            } },
        ...{ onInput: (__VLS_ctx.autoResize) },
        value: (__VLS_ctx.input),
        rows: "1",
        placeholder: (__VLS_ctx.auth.isLoggedIn ? '输入消息... (Enter 发送, Shift+Enter 换行)' : '登录后即可与 Maru 对话'),
        disabled: (!__VLS_ctx.auth.isLoggedIn || __VLS_ctx.loading),
        ref: "inputRef",
    });
    /** @type {typeof __VLS_ctx.inputRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.open))
                    return;
                __VLS_ctx.sendMessage();
            } },
        ...{ class: "send-btn" },
        disabled: (!__VLS_ctx.input.trim() || !__VLS_ctx.auth.isLoggedIn || __VLS_ctx.loading),
    });
    if (!__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (__VLS_ctx.goLogin) },
            ...{ class: "login-hint" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['ai-chat-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-fab']} */ ;
/** @type {__VLS_StyleScopedClasses['fab-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['fab-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-title-group']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-title-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-close']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-body']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-new']} */ ;
/** @type {__VLS_StyleScopedClasses['session-list']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-title']} */ ;
/** @type {__VLS_StyleScopedClasses['session-del']} */ ;
/** @type {__VLS_StyleScopedClasses['session-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-chat-area']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-emoji']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-text']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-prompts']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-row']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ai']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['ai']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['typing']} */ ;
/** @type {__VLS_StyleScopedClasses['input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            auth: auth,
            open: open,
            sessions: sessions,
            currentSessionId: currentSessionId,
            messages: messages,
            input: input,
            loading: loading,
            messagesWrap: messagesWrap,
            inputRef: inputRef,
            unread: unread,
            quickPrompts: quickPrompts,
            selectSession: selectSession,
            newSession: newSession,
            deleteSession: deleteSession,
            sendMessage: sendMessage,
            autoResize: autoResize,
            formatMsg: formatMsg,
            goLogin: goLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
