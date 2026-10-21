/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { tagApi } from '@/api';
const tags = ref([]);
function hexToRgb(hex) {
    const m = hex.replace('#', '').trim();
    const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    if (!/^[0-9a-fA-F]{6}$/.test(full))
        return null;
    return {
        r: parseInt(full.substring(0, 2), 16),
        g: parseInt(full.substring(2, 4), 16),
        b: parseInt(full.substring(4, 6), 16),
    };
}
function darken(rgb, factor) {
    return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
}
function getTagStyle(name) {
    const t = tags.value.find(x => x.name === name);
    if (!t || !t.color)
        return {};
    const rgb = hexToRgb(t.color);
    if (!rgb)
        return { color: t.color };
    return {
        color: t.color,
        background: darken(rgb, 0.45),
        border: `1px solid ${darken(rgb, 0.6)}`,
    };
}
onMounted(async () => {
    tags.value = await tagApi.list().catch(() => []);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
if (__VLS_ctx.tags.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
        const __VLS_0 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            key: (t.id),
            to: (`/?tag=${encodeURIComponent(t.name)}`),
            ...{ class: "tag" },
            ...{ style: (__VLS_ctx.getTagStyle(t.name)) },
        }));
        const __VLS_2 = __VLS_1({
            key: (t.id),
            to: (`/?tag=${encodeURIComponent(t.name)}`),
            ...{ class: "tag" },
            ...{ style: (__VLS_ctx.getTagStyle(t.name)) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_3.slots.default;
        (t.name);
        var __VLS_3;
    }
}
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            tags: tags,
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
