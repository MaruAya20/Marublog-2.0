/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, onUnmounted, ref, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const dragging = ref(false);
const dragStart = { x: 0, y: 0, ox: 0, oy: 0 };
function reset() {
    scale.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
}
watch(() => props.open, (v) => { if (v)
    reset(); });
function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    scale.value = Math.max(0.3, Math.min(scale.value + delta, 5));
}
function onMouseDown(e) {
    if (scale.value <= 1)
        return;
    dragging.value = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    dragStart.ox = offsetX.value;
    dragStart.oy = offsetY.value;
    e.preventDefault();
}
function onMouseMove(e) {
    if (!dragging.value)
        return;
    offsetX.value = dragStart.ox + (e.clientX - dragStart.x);
    offsetY.value = dragStart.oy + (e.clientY - dragStart.y);
}
function onMouseUp() {
    dragging.value = false;
}
function onDblClick(e) {
    e.preventDefault();
    if (scale.value > 1)
        reset();
    else {
        scale.value = 2;
        offsetX.value = 0;
        offsetY.value = 0;
    }
}
function onKey(e) {
    if (e.key === 'Escape')
        emit('close');
    if (e.key === '+' || e.key === '=')
        scale.value = Math.min(scale.value + 0.2, 5);
    if (e.key === '-')
        scale.value = Math.max(scale.value - 0.2, 0.3);
    if (e.key === '0')
        reset();
}
onMounted(() => {
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
});
onUnmounted(() => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['viewer-close']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
if (props.open && props.src) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(props.open && props.src))
                    return;
                __VLS_ctx.emit('close');
            } },
        ...{ onWheel: (__VLS_ctx.onWheel) },
        ...{ class: "viewer-mask" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(props.open && props.src))
                    return;
                __VLS_ctx.emit('close');
            } },
        ...{ class: "viewer-close" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "viewer-zoom-hint" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        ...{ onMousedown: (__VLS_ctx.onMouseDown) },
        ...{ onDblclick: (__VLS_ctx.onDblClick) },
        ...{ class: "viewer-img" },
        src: (props.src),
        ...{ style: ({
                transform: `translate(${__VLS_ctx.offsetX}px, ${__VLS_ctx.offsetY}px) scale(${__VLS_ctx.scale})`,
                cursor: __VLS_ctx.scale > 1 ? (__VLS_ctx.dragging ? 'grabbing' : 'grab') : 'zoom-in'
            }) },
        alt: "大图",
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['viewer-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-close']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-zoom-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-img']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            scale: scale,
            offsetX: offsetX,
            offsetY: offsetY,
            dragging: dragging,
            onWheel: onWheel,
            onMouseDown: onMouseDown,
            onDblClick: onDblClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
