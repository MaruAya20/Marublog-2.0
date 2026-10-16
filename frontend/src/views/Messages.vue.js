import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { notificationApi } from '@/api';
const router = useRouter();
const auth = useAuthStore();
const activeTab = ref('replies');
const loading = ref(false);
const allItems = ref([]);
const unread = ref(0);
const replies = computed(() => allItems.value.filter(m => m.type === 'reply'));
const comments = computed(() => allItems.value.filter(m => m.type === 'comment'));
const likes = computed(() => allItems.value.filter(m => m.type === 'like'));
const unreadReplies = computed(() => replies.value.filter(r => !r.read).length);
const unreadComments = computed(() => comments.value.filter(r => !r.read).length);
const unreadLikes = computed(() => likes.value.filter(r => !r.read).length);
async function load() {
    if (!auth.isLoggedIn) {
        allItems.value = [];
        unread.value = 0;
        return;
    }
    loading.value = true;
    try {
        const res = await notificationApi.list();
        allItems.value = res.items || [];
        unread.value = res.unread || 0;
    }
    catch (e) {
        console.error('load notifications error', e);
    }
    finally {
        loading.value = false;
    }
}
async function handleOpenPost(slug, id) {
    try {
        await notificationApi.markRead(id);
    }
    catch { }
    await load();
    router.push(`/post/${slug}`);
}
async function markAllRead() {
    try {
        await notificationApi.markAllRead();
    }
    catch { }
    await load();
}
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-link']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ style: {} },
});
if (!__VLS_ctx.auth.isLoggedIn) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
        ...{ style: {} },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tabs" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.auth.isLoggedIn))
                    return;
                __VLS_ctx.activeTab = 'replies';
            } },
        ...{ class: "tab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'replies' }) },
    });
    if (__VLS_ctx.unreadReplies) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "badge" },
        });
        (__VLS_ctx.unreadReplies);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.auth.isLoggedIn))
                    return;
                __VLS_ctx.activeTab = 'comments';
            } },
        ...{ class: "tab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'comments' }) },
    });
    if (__VLS_ctx.unreadComments) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "badge" },
        });
        (__VLS_ctx.unreadComments);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.auth.isLoggedIn))
                    return;
                __VLS_ctx.activeTab = 'likes';
            } },
        ...{ class: "tab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'likes' }) },
    });
    if (__VLS_ctx.unreadLikes) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "badge" },
        });
        (__VLS_ctx.unreadLikes);
    }
    if (__VLS_ctx.unread > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.markAllRead) },
            ...{ class: "mark-all" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
else if (__VLS_ctx.activeTab === 'replies') {
    if (__VLS_ctx.replies.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
        });
    }
    for (const [m] of __VLS_getVForSourceType((__VLS_ctx.replies))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (m.id),
            ...{ class: "msg-item" },
            ...{ class: ({ unread: !m.read }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (m.fromName || '有人');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "msg-time" },
        });
        (m.createdAt);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-content" },
        });
        (m.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!(__VLS_ctx.activeTab === 'replies'))
                        return;
                    __VLS_ctx.handleOpenPost(m.postSlug, m.id);
                } },
            ...{ class: "msg-link" },
        });
        (m.postTitle);
    }
}
else if (__VLS_ctx.activeTab === 'comments') {
    if (__VLS_ctx.comments.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
        });
    }
    for (const [m] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (m.id),
            ...{ class: "msg-item" },
            ...{ class: ({ unread: !m.read }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (m.fromName || '有人');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "msg-time" },
        });
        (m.createdAt);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-content" },
        });
        (m.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'replies'))
                        return;
                    if (!(__VLS_ctx.activeTab === 'comments'))
                        return;
                    __VLS_ctx.handleOpenPost(m.postSlug, m.id);
                } },
            ...{ class: "msg-link" },
        });
        (m.postTitle);
    }
}
else {
    if (__VLS_ctx.likes.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
        });
    }
    for (const [m] of __VLS_getVForSourceType((__VLS_ctx.likes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (m.id),
            ...{ class: "msg-item" },
            ...{ class: ({ unread: !m.read }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (m.fromName || '有人');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "msg-time" },
        });
        (m.createdAt);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "msg-icon" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'replies'))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'comments'))
                        return;
                    __VLS_ctx.handleOpenPost(m.postSlug, m.id);
                } },
            ...{ class: "msg-link" },
        });
        (m.postTitle);
    }
}
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-header']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-link']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-header']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-link']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-header']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            auth: auth,
            activeTab: activeTab,
            loading: loading,
            unread: unread,
            replies: replies,
            comments: comments,
            likes: likes,
            unreadReplies: unreadReplies,
            unreadComments: unreadComments,
            unreadLikes: unreadLikes,
            handleOpenPost: handleOpenPost,
            markAllRead: markAllRead,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
