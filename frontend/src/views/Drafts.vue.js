/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { postApi, extractError } from '@/api';
const router = useRouter();
const drafts = ref([]);
const loading = ref(true);
const error = ref('');
async function load() {
    loading.value = true;
    error.value = '';
    try {
        drafts.value = await postApi.drafts();
    }
    catch (err) {
        error.value = extractError(err);
    }
    finally {
        loading.value = false;
    }
}
onMounted(load);
function goEdit(slug) {
    router.push(`/edit/${slug}`);
}
function formatDate(d) {
    if (!d)
        return '';
    const dt = new Date(d);
    const now = new Date();
    const diff = (now.getTime() - dt.getTime()) / 1000;
    if (diff < 60)
        return '刚刚';
    if (diff < 3600)
        return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400)
        return `${Math.floor(diff / 3600)} 小时前`;
    return dt.toLocaleDateString();
}
async function publishDirect(slug) {
    if (!confirm('确定要直接发布这篇草稿吗？'))
        return;
    try {
        await postApi.update(slug, { status: 'published' });
        load();
    }
    catch (err) {
        alert(extractError(err));
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['draft-title']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ style: {} },
});
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
else if (__VLS_ctx.drafts.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/new",
        ...{ class: "btn-primary" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/new",
        ...{ class: "btn-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "draft-list" },
    });
    for (const [d] of __VLS_getVForSourceType((__VLS_ctx.drafts))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (d.id),
            ...{ class: "draft-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "draft-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.drafts.length === 0))
                        return;
                    __VLS_ctx.goEdit(d.slug);
                } },
            ...{ class: "draft-title" },
        });
        (d.title || '(未命名草稿)');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "draft-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "draft-badge" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.formatDate(d.publishedAt));
        if (d.tags?.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "draft-tags" },
            });
            (d.tags.join(' '));
        }
        if (d.excerpt) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                ...{ class: "draft-excerpt" },
            });
            (d.excerpt);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "draft-actions" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.drafts.length === 0))
                        return;
                    __VLS_ctx.goEdit(d.slug);
                } },
            ...{ class: "btn-ghost" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.drafts.length === 0))
                        return;
                    __VLS_ctx.publishDirect(d.slug);
                } },
            ...{ class: "btn-primary" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-list']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-info']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-title']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['draft-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            drafts: drafts,
            loading: loading,
            error: error,
            goEdit: goEdit,
            formatDate: formatDate,
            publishDirect: publishDirect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
