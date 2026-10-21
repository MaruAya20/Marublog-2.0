/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postApi, commentApi, tagApi, trackApi, extractError } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { renderMarkdown } from '@/utils/markdown';
import ImageViewer from '@/components/ImageViewer.vue';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const post = ref(null);
const comments = ref([]);
const commentTotal = ref(0);
const tags = ref([]);
const loading = ref(false);
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
    if (target.tagName === 'IMG' && target.src) {
        openViewer(target.src);
    }
}
function goUser(name) {
    if (name)
        router.push(`/user/${encodeURIComponent(name)}`);
}
const slug = computed(() => route.params.slug);
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
function goEdit() {
    router.push(`/edit/${slug.value}`);
}
function startReply(c) {
    replyTo.value = {
        id: c.id,
        name: c.user?.name || c.guestName || '匿名',
        parentId: c.parentId ?? c.id,
        mentionUserId: c.userId,
    };
    commentContent.value = '';
    setTimeout(() => document.querySelector('.comment-input textarea')?.focus(), 50);
}
function cancelReply() {
    replyTo.value = null;
}
async function load() {
    loading.value = true;
    error.value = '';
    try {
        tags.value = await tagApi.list().catch(() => []);
        post.value = await postApi.getBySlug(slug.value);
        const tree = await commentApi.tree(post.value.id);
        comments.value = tree.roots || [];
        commentTotal.value = tree.total || 0;
        trackApi.view({ route: `/post/${slug.value}`, slug: slug.value, postId: post.value.id });
    }
    catch (err) {
        error.value = extractError(err);
    }
    finally {
        loading.value = false;
    }
}
async function submitComment() {
    if (!commentContent.value.trim())
        return;
    submitting.value = true;
    try {
        const data = {
            postId: post.value.id,
            content: commentContent.value.trim(),
        };
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
    const res = await postApi.toggleLike(slug.value);
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
    const res = await postApi.toggleFavorite(slug.value);
    if (post.value) {
        post.value.favoritedByMe = res.favorited;
        post.value.favorites = res.count;
    }
}
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['author-link']} */ ;
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
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['audio-card']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
}
else if (__VLS_ctx.post) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "card" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ style: {} },
    });
    (__VLS_ctx.post.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "post-meta" },
        ...{ style: {} },
    });
    if (__VLS_ctx.post.publishedAt) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (new Date(__VLS_ctx.post.publishedAt).toLocaleString());
    }
    if (__VLS_ctx.post.publishedAt && __VLS_ctx.post.author) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    if (__VLS_ctx.post.author) {
        const __VLS_0 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onClick': {} },
            ...{ class: "author-link" },
            to: (`/user/${encodeURIComponent(__VLS_ctx.post.author.name || '')}`),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onClick': {} },
            ...{ class: "author-link" },
            to: (`/user/${encodeURIComponent(__VLS_ctx.post.author.name || '')}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        let __VLS_6;
        const __VLS_7 = {
            onClick: () => { }
        };
        __VLS_3.slots.default;
        if (__VLS_ctx.post.author.avatar) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.post.author.avatar),
                ...{ class: "mini-avatar" },
                alt: "头像",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mini-avatar mini-avatar-fb" },
            });
            ((__VLS_ctx.post.author.name || '?')[0]);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "author-name" },
        });
        (__VLS_ctx.post.author.name);
        var __VLS_3;
    }
    if (__VLS_ctx.isOwner) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.goEdit) },
            ...{ class: "btn-ghost" },
            ...{ style: {} },
        });
    }
    if (__VLS_ctx.post.tags?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "post-tags" },
            ...{ style: {} },
        });
        for (const [t] of __VLS_getVForSourceType((__VLS_ctx.post.tags))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                key: (t),
                ...{ class: "tag" },
                ...{ style: (__VLS_ctx.getTagStyle(t)) },
            });
            (t);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.onContentClick) },
        ...{ class: "post-content markdown-body" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.renderedContent) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleLike) },
        ...{ class: "btn-ghost" },
        ...{ class: ({ active: __VLS_ctx.post.likedByMe }) },
    });
    (__VLS_ctx.post.likedByMe ? '❤️ 已赞' : '🤍 点赞');
    (__VLS_ctx.post.likes || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.toggleFavorite) },
        ...{ class: "btn-ghost" },
    });
    (__VLS_ctx.post.favoritedByMe ? '⭐ 已收藏' : '☆ 收藏');
    (__VLS_ctx.post.favorites || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "btn-ghost" },
        ...{ style: {} },
    });
    (__VLS_ctx.post.views ?? 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ style: {} },
    });
    (__VLS_ctx.commentTotal);
    if (__VLS_ctx.replyTo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.replyTo.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.cancelReply) },
            ...{ class: "btn-ghost" },
            ...{ style: {} },
        });
    }
    if (!__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            placeholder: "请输入昵称",
            maxlength: "16",
        });
        (__VLS_ctx.guestName);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row comment-input" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.commentContent),
        placeholder: "写下你的评论...",
        maxlength: "500",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.submitComment) },
        ...{ class: "btn-primary" },
        disabled: (__VLS_ctx.submitting),
    });
    (__VLS_ctx.submitting ? '发送中...' : (__VLS_ctx.replyTo ? '发表回复' : '发表评论'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    for (const [c] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "comment-meta" },
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
                    __VLS_ctx.startReply(c);
                } },
            ...{ class: "reply-btn" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        (c.content);
        if (c.replies?.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "comment-replies" },
            });
            for (const [r] of __VLS_getVForSourceType((c.replies))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (r.id),
                    ...{ class: "comment-item comment-item-reply" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "comment-meta" },
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
                            if (!(c.replies?.length))
                                return;
                            __VLS_ctx.startReply(r);
                        } },
                    ...{ class: "reply-btn" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: {} },
                });
                (r.content);
            }
        }
    }
    if (__VLS_ctx.comments.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
            ...{ style: {} },
        });
    }
    /** @type {[typeof ImageViewer, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(ImageViewer, new ImageViewer({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.viewerOpen),
        src: (__VLS_ctx.viewerSrc),
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.viewerOpen),
        src: (__VLS_ctx.viewerSrc),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_11;
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = {
        onClose: (...[$event]) => {
            if (!!(__VLS_ctx.loading))
                return;
            if (!!(__VLS_ctx.error))
                return;
            if (!(__VLS_ctx.post))
                return;
            __VLS_ctx.viewerOpen = false;
        }
    };
    var __VLS_10;
}
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar-fb']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['post-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['post-content']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-replies']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
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
            isOwner: isOwner,
            renderedContent: renderedContent,
            getTagStyle: getTagStyle,
            goEdit: goEdit,
            startReply: startReply,
            cancelReply: cancelReply,
            submitComment: submitComment,
            toggleLike: toggleLike,
            toggleFavorite: toggleFavorite,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
