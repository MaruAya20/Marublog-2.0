import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const notif = useNotificationStore();
const auth = useAuthStore();
const toasts = ref([]);
let lastUnread = 0;
let checkTimer = null;
function showNewNotifications(diff) {
    const recent = notif.recent || [];
    const fresh = recent.slice(0, diff);
    fresh.forEach((n) => {
        if (!toasts.value.find(t => t.id === n.id)) {
            addToast(n);
        }
    });
}
function addToast(n) {
    const t = { ...n, timeout: null };
    toasts.value.push(t);
    t.timeout = setTimeout(() => {
        dismiss(t.id);
    }, 4000);
}
function dismiss(id) {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx >= 0) {
        if (toasts.value[idx].timeout)
            clearTimeout(toasts.value[idx].timeout);
        toasts.value.splice(idx, 1);
    }
}
function clickToast(t) {
    dismiss(t.id);
    if (t.postSlug)
        router.push(`/post/${t.postSlug}`);
    else
        router.push('/notifications');
    if (!t.isRead)
        notif.markRead(t.id);
}
function typeIcon(t) {
    return { COMMENT: '💬', REPLY: '↩️', LIKE: '❤️', SYSTEM: '🔔' }[t] || '🔔';
}
onMounted(() => {
    if (!auth.isLoggedIn)
        return;
    lastUnread = notif.unreadCount;
    checkTimer = setInterval(async () => {
        if (!auth.isLoggedIn)
            return;
        const before = notif.unreadCount;
        await notif.fetchUnread();
        await notif.fetchRecent();
        if (notif.unreadCount > before) {
            showNewNotifications(notif.unreadCount - before);
        }
        lastUnread = notif.unreadCount;
    }, 25000);
});
onUnmounted(() => {
    if (checkTimer)
        clearInterval(checkTimer);
    toasts.value.forEach(t => t.timeout && clearTimeout(t.timeout));
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['toast-item']} */ ;
/** @type {__VLS_StyleScopedClasses['close']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toast-stack" },
});
const __VLS_0 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "toast",
}));
const __VLS_2 = __VLS_1({
    name: "toast",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.toasts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.clickToast(t);
            } },
        key: (t.id),
        ...{ class: "toast-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "icon" },
    });
    (__VLS_ctx.typeIcon(t.type));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (t.fromName || '有人');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (t.type === 'COMMENT' ? '评论了你' : t.type === 'REPLY' ? '回复了你' : t.type === 'LIKE' ? '点赞了你' : '通知你');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview" },
    });
    (t.content || t["postTitle"] || '');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.dismiss(t.id);
            } },
        ...{ class: "close" },
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['toast-stack']} */ ;
/** @type {__VLS_StyleScopedClasses['toast-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['body']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview']} */ ;
/** @type {__VLS_StyleScopedClasses['close']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            toasts: toasts,
            dismiss: dismiss,
            clickToast: clickToast,
            typeIcon: typeIcon,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
