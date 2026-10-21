import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { postApi, commentApi, tagApi, extractError } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { renderMarkdown } from '@/utils/markdown';
import ImageViewer from '@/components/ImageViewer.vue';
const props = defineProps();
const router = useRouter();
const auth = useAuthStore();
const post = ref(null);
const comments = ref([]);
const commentTotal = ref(0);
const tags = ref([]);
const loading = ref(true);
const error = ref('');
const commentContent = ref('');
const guestName = ref('');
const submitting = ref(false);
const replyTo = ref(null);
const viewerOpen = ref(false);
const viewerSrc = ref('');
function openViewer(src) {
    viewerSrc.value = src;
    viewerOpen.value = true;
}
function onContentClick(e) {
    const target = e.target;
    if (target.tagName === 'IMG' && target.src)
        openViewer(target.src);
}
function goUser(name) {
    if (name)
        router.push(`/user/${encodeURIComponent(name)}`);
}
const isOwner = computed(() => {
    if (!post.value || !auth.user)
        return false;
    return auth.user.name === post.value.author?.name || auth.user.role === 'ADMIN';
});
const renderedContent = computed(() => {
    if (!post.value?.content)
        return '';
    return renderMarkdown(post.value.content);
});
function getTagStyle(name) {
    const t = tags.value.find(x => x.name === name);
    if (!t)
        return {};
    const textColor = t.color || '#888';
    const h = textColor.replace('#', '');
    const rgb = h.length === 6
        ? [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
        : null;
    if (!rgb)
        return { background: '#f0f0f0', color: textColor };
    const bg = `rgb(${Math.round(rgb[0] * 0.45)}, ${Math.round(rgb[1] * 0.45)}, ${Math.round(rgb[2] * 0.45)})`;
    const bd = `rgb(${Math.round(rgb[0] * 0.6)}, ${Math.round(rgb[1] * 0.6)}, ${Math.round(rgb[2] * 0.6)})`;
    return { background: bg, color: textColor, border: `1px solid ${bd}` };
}
function goDetail() {
    if (post.value?.slug)
        router.push(`/post/${encodeURIComponent(post.value.slug)}`);
}
function goEdit() {
    if (post.value?.slug)
        router.push(`/edit/${post.value.slug}`);
}
function startReply(c) {
    replyTo.value = {
        id: c.id,
        name: c.user?.name || c.guestName || '匿名',
        parentId: c.parentId ?? c.id,
        mentionUserId: c.userId
    };
    commentContent.value = '';
    setTimeout(() => document.querySelector('.pc-comment-input textarea')?.focus(), 50);
}
function cancelReply() { replyTo.value = null; }
async function load() {
    loading.value = true;
    error.value = '';
    try {
        if (tags.value.length === 0)
            tags.value = await tagApi.list().catch(() => []);
        post.value = await postApi.getBySlug(props.slug);
        if (post.value?.id) {
            const tree = await commentApi.tree(post.value.id);
            comments.value = tree.roots || [];
            commentTotal.value = tree.total || 0;
        }
    }
    catch (err) {
        error.value = extractError(err);
    }
    finally {
        loading.value = false;
    }
}
async function submitComment() {
    if (!commentContent.value.trim() || !post.value)
        return;
    submitting.value = true;
    try {
        const data = { postId: post.value.id, content: commentContent.value.trim() };
        if (replyTo.value) {
            data.parentId = replyTo.value.parentId;
            if (replyTo.value.mentionUserId)
                data.mentionUserId = replyTo.value.mentionUserId;
        }
        if (!auth.isLoggedIn) {
            if (!guestName.value.trim()) {
                alert('访客请填昵称');
                submitting.value = false;
                return;
            }
            data.guestName = guestName.value.trim();
        }
        await commentApi.create(data);
        commentContent.value = '';
        guestName.value = '';
        replyTo.value = null;
        const tree = await commentApi.tree(post.value.id);
        comments.value = tree.roots || [];
        commentTotal.value = tree.total || 0;
    }
    catch (err) {
        alert(extractError(err));
    }
    finally {
        submitting.value = false;
    }
}
async function toggleLike() {
    if (!auth.isLoggedIn) {
        alert('请先登录');
        return;
    }
    const res = await postApi.toggleLike(props.slug);
    if (post.value) {
        post.value.likedByMe = res.liked;
        post.value.likes = res.count;
    }
}
async function toggleFavorite() {
    if (!auth.isLoggedIn) {
        alert('请先登录');
        return;
    }
    const res = await postApi.toggleFavorite(props.slug);
    if (post.value) {
        post.value.favoritedByMe = res.favorited;
        post.value.favorites = res.count;
    }
}
onMounted(load);
watch(() => props.slug, load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pc-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-author']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "post-card-wrap" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-hint" },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-hint pc-error" },
    });
    (__VLS_ctx.error);
}
else if (__VLS_ctx.post) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "card post-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "pc-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ onClick: (__VLS_ctx.goDetail) },
        ...{ class: "pc-title" },
    });
    (__VLS_ctx.post.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-meta" },
    });
    if (__VLS_ctx.post.publishedAt) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (new Date(__VLS_ctx.post.publishedAt).toLocaleString());
    }
    if (__VLS_ctx.post.author) {
        if (__VLS_ctx.post.publishedAt) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!(__VLS_ctx.post))
                        return;
                    if (!(__VLS_ctx.post.author))
                        return;
                    __VLS_ctx.goUser(__VLS_ctx.post.author?.name);
                } },
            ...{ class: "pc-author" },
        });
        if (__VLS_ctx.post.author.avatar) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.post.author.avatar),
                ...{ class: "pc-avatar" },
                alt: "",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "pc-avatar pc-avatar-fb" },
            });
            ((__VLS_ctx.post.author.name || '?')[0]);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.post.author.name);
    }
    if (__VLS_ctx.isOwner) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.goEdit) },
            ...{ class: "pc-ghost-btn" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goDetail) },
        ...{ class: "pc-ghost-btn" },
    });
    if (__VLS_ctx.post.excerpt) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-excerpt" },
        });
        (__VLS_ctx.post.excerpt);
    }
    if (__VLS_ctx.post.tags?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-tags" },
        });
        for (const [t] of __VLS_getVForSourceType((__VLS_ctx.post.tags))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                key: (t),
                ...{ class: "pc-tag" },
                ...{ style: (__VLS_ctx.getTagStyle(t)) },
            });
            (t);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.onContentClick) },
        ...{ class: "pc-content markdown-body" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.renderedContent) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleLike) },
        ...{ class: "btn-ghost" },
        ...{ class: ({ active: __VLS_ctx.post.likedByMe }) },
    });
    (__VLS_ctx.post.likedByMe ? '❤️' : '🤍');
    (__VLS_ctx.post.likes || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleFavorite) },
        ...{ class: "btn-ghost" },
        ...{ class: ({ active: __VLS_ctx.post.favoritedByMe }) },
    });
    (__VLS_ctx.post.favoritedByMe ? '⭐' : '☆');
    (__VLS_ctx.post.favorites || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "btn-ghost pc-views" },
    });
    (__VLS_ctx.post.views ?? 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goDetail) },
        ...{ class: "btn-ghost" },
    });
    (__VLS_ctx.commentTotal);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-comments" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "pc-comments-title" },
    });
    (__VLS_ctx.commentTotal);
    if (__VLS_ctx.replyTo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-reply-hint" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.replyTo.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.cancelReply) },
            ...{ class: "pc-ghost-btn" },
        });
    }
    if (!__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-form-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            placeholder: "请输入昵称",
            maxlength: "16",
        });
        (__VLS_ctx.guestName);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-form-row pc-comment-input" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.commentContent),
        placeholder: "写下你的评论...",
        maxlength: "500",
        rows: "3",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pc-form-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.submitComment) },
        ...{ class: "btn-primary" },
        disabled: (__VLS_ctx.submitting),
    });
    (__VLS_ctx.submitting ? '发送中...' : (__VLS_ctx.replyTo ? '发表回复' : '发表评论'));
    if (__VLS_ctx.comments.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-comment-list" },
        });
        for (const [c] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "pc-comment-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "pc-comment-meta" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            (c.user?.name || c.guestName || '匿名');
            if (c.createdAt) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (new Date(c.createdAt).toLocaleString());
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.error))
                            return;
                        if (!(__VLS_ctx.post))
                            return;
                        if (!(__VLS_ctx.comments.length))
                            return;
                        __VLS_ctx.startReply(c);
                    } },
                ...{ class: "pc-reply-btn" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "pc-comment-text" },
            });
            (c.content);
            if (c.replies?.length) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "pc-comment-replies" },
                });
                for (const [r] of __VLS_getVForSourceType((c.replies))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        key: (r.id),
                        ...{ class: "pc-comment-item pc-comment-item-reply" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "pc-comment-meta" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                    (r.user?.name || r.guestName || '匿名');
                    if (r.createdAt) {
                        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                        (new Date(r.createdAt).toLocaleString());
                    }
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.loading))
                                    return;
                                if (!!(__VLS_ctx.error))
                                    return;
                                if (!(__VLS_ctx.post))
                                    return;
                                if (!(__VLS_ctx.comments.length))
                                    return;
                                if (!(c.replies?.length))
                                    return;
                                __VLS_ctx.startReply(r);
                            } },
                        ...{ class: "pc-reply-btn" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "pc-comment-text" },
                    });
                    (r.content);
                }
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "pc-hint pc-empty" },
        });
    }
}
/** @type {[typeof ImageViewer, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ImageViewer, new ImageViewer({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.viewerOpen),
    src: (__VLS_ctx.viewerSrc),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.viewerOpen),
    src: (__VLS_ctx.viewerSrc),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onClose: (...[$event]) => {
        __VLS_ctx.viewerOpen = false;
    }
};
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['post-card-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-error']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-author']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-avatar-fb']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-views']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comments']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comments-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-reply-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-replies']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-item-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['pc-empty']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ImageViewer: ImageViewer,
            auth: auth,
            post: post,
            comments: comments,
            commentTotal: commentTotal,
            loading: loading,
            error: error,
            commentContent: commentContent,
            guestName: guestName,
            submitting: submitting,
            replyTo: replyTo,
            viewerOpen: viewerOpen,
            viewerSrc: viewerSrc,
            onContentClick: onContentClick,
            goUser: goUser,
            isOwner: isOwner,
            renderedContent: renderedContent,
            getTagStyle: getTagStyle,
            goDetail: goDetail,
            goEdit: goEdit,
            startReply: startReply,
            cancelReply: cancelReply,
            submitComment: submitComment,
            toggleLike: toggleLike,
            toggleFavorite: toggleFavorite,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
