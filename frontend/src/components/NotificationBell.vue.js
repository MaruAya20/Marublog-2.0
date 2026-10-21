/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const notif = useNotificationStore();
const auth = useAuthStore();
const open = ref(false);
const hasUnread = computed(() => notif.unreadCount > 0);
function goNotifications() {
    open.value = false;
    router.push('/notifications');
}
function goPost(n) {
    open.value = false;
    if (n.id && !n.isRead)
        notif.markRead(n.id);
    if (n.postSlug)
        router.push(`/post/${n.postSlug}`);
    else
        router.push('/notifications');
}
function typeLabel(t) {
    return { COMMENT: '评论了你', REPLY: '回复了你', LIKE: '点赞了你', SYSTEM: '系统通知' }[t] || t;
}
function typeIcon(t) {
    return { COMMENT: '💬', REPLY: '↩️', LIKE: '❤️', SYSTEM: '🔔' }[t] || '🔔';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['bell-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['bell-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-footer']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.auth.isLoggedIn) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "notif-bell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.isLoggedIn))
                    return;
                __VLS_ctx.open = !__VLS_ctx.open;
            } },
        ...{ class: "bell-btn" },
        ...{ class: ({ active: __VLS_ctx.hasUnread }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M10.3 21a1.94 1.94 0 0 0 3.4 0",
    });
    if (__VLS_ctx.hasUnread) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "badge" },
        });
        (__VLS_ctx.notif.unreadCount > 99 ? '99+' : __VLS_ctx.notif.unreadCount);
    }
    if (__VLS_ctx.open) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            ...{ class: "notif-panel" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "notif-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.hasUnread) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.auth.isLoggedIn))
                            return;
                        if (!(__VLS_ctx.open))
                            return;
                        if (!(__VLS_ctx.hasUnread))
                            return;
                        __VLS_ctx.notif.markAllRead();
                    } },
                ...{ class: "mark-all" },
            });
        }
        if (__VLS_ctx.notif.recent.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "notif-list" },
            });
            for (const [n] of __VLS_getVForSourceType((__VLS_ctx.notif.recent))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.auth.isLoggedIn))
                                return;
                            if (!(__VLS_ctx.open))
                                return;
                            if (!(__VLS_ctx.notif.recent.length))
                                return;
                            __VLS_ctx.goPost(n);
                        } },
                    key: (n.id),
                    ...{ class: "notif-item" },
                    ...{ class: ({ unread: !n.isRead }) },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "icon" },
                });
                (__VLS_ctx.typeIcon(n.type));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "body" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "title" },
                });
                if (n.fromName) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                    (n.fromName);
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.typeLabel(n.type));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "preview" },
                });
                (n.content || n.postTitle || '');
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "notif-empty" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (__VLS_ctx.goNotifications) },
            ...{ class: "notif-footer" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['notif-bell']} */ ;
/** @type {__VLS_StyleScopedClasses['bell-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['body']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['notif-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            notif: notif,
            auth: auth,
            open: open,
            hasUnread: hasUnread,
            goNotifications: goNotifications,
            goPost: goPost,
            typeLabel: typeLabel,
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
