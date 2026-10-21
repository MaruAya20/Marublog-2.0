import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postApi, tagApi, trackApi } from '@/api';
import ImageViewer from '@/components/ImageViewer.vue';
const route = useRoute();
const router = useRouter();
const LEVEL_NAMES = ['幼丸', '新丸', '小小丸', '小丸', '中丸', '大丸', '大大丸', '超大丸', '巨丸', '饭纲丸', '射命丸'];
const LEVEL_COLORS = ['#9e9e9e', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#8bc34a', '#3f51b5', '#245a88', '#ef4045'];
const ADMIN_BADGE_NAME = '姬海棠';
const ADMIN_BADGE_COLOR = '#a72aabff';
function getLevelBadge(level, role) {
    if (role === 'ADMIN')
        return { text: ADMIN_BADGE_NAME, color: ADMIN_BADGE_COLOR, bg: ADMIN_BADGE_COLOR + '26' };
    const lv = Math.max(0, Math.min(10, level || 0));
    return { text: `${LEVEL_NAMES[lv]}`, color: LEVEL_COLORS[lv], bg: LEVEL_COLORS[lv] + '26' };
}
const posts = ref([]);
const tags = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = 15;
const activeTag = ref(null);
const loading = ref(false);
const viewerOpen = ref(false);
const viewerSrc = ref('');
function openViewer(src) {
    viewerSrc.value = src;
    viewerOpen.value = true;
}
function goUser(name) {
    if (name)
        router.push(`/user/${encodeURIComponent(name)}`);
}
function onThumbError(e, origUrl) {
    const img = e.target;
    if (img._triedFallback) {
        img.style.display = 'none';
        return;
    }
    if (origUrl && img.src !== origUrl && !origUrl.includes('/thumbnail')) {
        img._triedFallback = true;
        img.src = origUrl;
    }
    else {
        img.style.display = 'none';
    }
}
async function load() {
    loading.value = true;
    try {
        const params = { page: page.value, pageSize };
        if (activeTag.value)
            params.tag = activeTag.value;
        const data = await postApi.list(params);
        posts.value = (data.posts || []).filter((p) => p.status !== 'draft');
        total.value = data.total;
        trackApi.view({ route: '/', tag: activeTag.value || undefined });
    }
    finally {
        loading.value = false;
    }
}
function gotoPage(p) {
    page.value = p;
    load();
}
onMounted(async () => {
    tags.value = await tagApi.list().catch(() => []);
    await load();
});
watch(activeTag, () => {
    page.value = 1;
    load();
});
const totalPages = () => Math.max(1, Math.ceil(total.value / pageSize));
const hasNext = () => page.value < totalPages();
const hasPrev = () => page.value > 1;
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    if (h.length !== 6)
        return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function darken(hex, factor = 0.55) {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return hex;
    const r = Math.round(rgb[0] * (1 - factor));
    const g = Math.round(rgb[1] * (1 - factor));
    const b = Math.round(rgb[2] * (1 - factor));
    return `rgb(${r}, ${g}, ${b})`;
}
function getTagStyle(name) {
    const t = tags.value.find(x => x.name === name);
    if (!t)
        return {};
    const textColor = t.color || '#888';
    const bgColor = darken(textColor, 0.55);
    const borderColor = darken(textColor, 0.4);
    return {
        background: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`
    };
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-title']} */ ;
/** @type {__VLS_StyleScopedClasses['author-link']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge-clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-thumbs']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-img']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (__VLS_ctx.tags.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.tags.length))
                    return;
                __VLS_ctx.activeTag = null;
            } },
        ...{ class: "tag" },
        ...{ class: ({ active: !__VLS_ctx.activeTag }) },
    });
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.tags.length))
                        return;
                    __VLS_ctx.activeTag = t.name;
                } },
            key: (t.id),
            ...{ class: "tag" },
            ...{ class: ({ active: __VLS_ctx.activeTag === t.name }) },
            ...{ style: (__VLS_ctx.getTagStyle(t.name)) },
        });
        (t.name);
    }
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
}
else if (__VLS_ctx.posts.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
else {
    for (const [p] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (p.id),
            ...{ class: "post-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "post-main" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "title-row" },
        });
        const __VLS_0 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            to: (`/post/${p.slug}`),
            ...{ class: "post-title" },
        }));
        const __VLS_2 = __VLS_1({
            to: (`/post/${p.slug}`),
            ...{ class: "post-title" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_3.slots.default;
        (p.title);
        var __VLS_3;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "post-meta" },
        });
        if (p.author) {
            const __VLS_4 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
            // @ts-ignore
            const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
                ...{ 'onClick': {} },
                ...{ class: "author-link" },
                to: (`/user/${encodeURIComponent(p.author.name || '')}`),
            }));
            const __VLS_6 = __VLS_5({
                ...{ 'onClick': {} },
                ...{ class: "author-link" },
                to: (`/user/${encodeURIComponent(p.author.name || '')}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_5));
            let __VLS_8;
            let __VLS_9;
            let __VLS_10;
            const __VLS_11 = {
                onClick: () => { }
            };
            __VLS_7.slots.default;
            if (p.author.avatar) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (p.author.avatar),
                    ...{ class: "mini-avatar" },
                    alt: "头像",
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "mini-avatar mini-avatar-fb" },
                });
                ((p.author.name || '?')[0]);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "author-name" },
            });
            (p.author.name);
            if (p.author.role && p.author.role !== 'GUEST') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.posts.length === 0))
                                return;
                            if (!(p.author))
                                return;
                            if (!(p.author.role && p.author.role !== 'GUEST'))
                                return;
                            __VLS_ctx.router.push('/levels');
                        } },
                    ...{ class: "level-badge level-badge-clickable" },
                    ...{ style: ({ background: __VLS_ctx.getLevelBadge(p.author.level, p.author.role).bg, color: __VLS_ctx.getLevelBadge(p.author.level, p.author.role).color, borderColor: __VLS_ctx.getLevelBadge(p.author.level, p.author.role).color + '40' }) },
                });
                (__VLS_ctx.getLevelBadge(p.author.level, p.author.role).text);
            }
            var __VLS_7;
        }
        if (p.author) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "meta-dot" },
            });
        }
        if (p.publishedAt) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (new Date(p.publishedAt).toLocaleDateString());
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "meta-dot" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (p.comments ?? 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "meta-dot" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (p.views ?? 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "meta-dot" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (p.likes ?? 0);
        if (p.excerpt) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "post-excerpt" },
            });
            (p.excerpt);
        }
        if (p.tags?.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "post-tags" },
            });
            for (const [t] of __VLS_getVForSourceType((p.tags))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    key: (t),
                    ...{ class: "tag" },
                    ...{ style: (__VLS_ctx.getTagStyle(t)) },
                });
                (t);
            }
        }
        if (p.previewThumbs?.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "post-thumbs" },
            });
            for (const [thumb, i] of __VLS_getVForSourceType((p.previewThumbs.slice(0, 3)))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    ...{ onError: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.posts.length === 0))
                                return;
                            if (!(p.previewThumbs?.length))
                                return;
                            __VLS_ctx.onThumbError($event, p.previewImages?.[i]);
                        } },
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.posts.length === 0))
                                return;
                            if (!(p.previewThumbs?.length))
                                return;
                            __VLS_ctx.openViewer(p.previewImages?.[i] || thumb);
                        } },
                    key: (i),
                    src: (thumb),
                    ...{ class: "thumb-img" },
                });
            }
        }
    }
}
if (__VLS_ctx.totalPages() > 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pagination" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.totalPages() > 1))
                    return;
                __VLS_ctx.gotoPage(__VLS_ctx.page - 1);
            } },
        disabled: (!__VLS_ctx.hasPrev()),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "page-info" },
    });
    (__VLS_ctx.page);
    (__VLS_ctx.totalPages());
    (__VLS_ctx.total);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.totalPages() > 1))
                    return;
                __VLS_ctx.gotoPage(__VLS_ctx.page + 1);
            } },
        disabled: (!__VLS_ctx.hasNext()),
    });
}
/** @type {[typeof ImageViewer, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(ImageViewer, new ImageViewer({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.viewerOpen),
    src: (__VLS_ctx.viewerSrc),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onClose': {} },
    open: (__VLS_ctx.viewerOpen),
    src: (__VLS_ctx.viewerSrc),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onClose: (...[$event]) => {
        __VLS_ctx.viewerOpen = false;
    }
};
var __VLS_14;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-main']} */ ;
/** @type {__VLS_StyleScopedClasses['title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['post-title']} */ ;
/** @type {__VLS_StyleScopedClasses['post-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['author-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-avatar-fb']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge-clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['post-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['post-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['post-thumbs']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['page-info']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ImageViewer: ImageViewer,
            router: router,
            getLevelBadge: getLevelBadge,
            posts: posts,
            tags: tags,
            total: total,
            page: page,
            activeTag: activeTag,
            loading: loading,
            viewerOpen: viewerOpen,
            viewerSrc: viewerSrc,
            openViewer: openViewer,
            onThumbError: onThumbError,
            gotoPage: gotoPage,
            totalPages: totalPages,
            hasNext: hasNext,
            hasPrev: hasPrev,
            getTagStyle: getTagStyle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
