import { onMounted, ref, watch } from 'vue';
import { preferenceApi, uploadApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const urlInput = ref('');
const currentWallpaper = ref('');
const opacity = ref(0.35);
const urlLocked = ref(false);
const saving = ref(false);
const savingMsg = ref('');
const uploading = ref(false);
const uploadMsg = ref('');
function applyToDOM(u, o) {
    const root = document.documentElement;
    const hasUrl = u && u.length > 0;
    const finalUrl = hasUrl ? `url("${u}")` : 'none';
    root.style.setProperty('--wallpaper-url', finalUrl);
    if (typeof o === 'number' && !Number.isNaN(o)) {
        const v = Math.min(1, Math.max(0, o));
        root.style.setProperty('--wallpaper-opacity', String(v));
    }
}
watch([currentWallpaper, opacity], ([u, o]) => {
    applyToDOM(u.trim(), o);
}, { immediate: false });
onMounted(async () => {
    try {
        const pref = await preferenceApi.get();
        opacity.value = pref.opacity ?? 0.35;
        currentWallpaper.value = pref.wallpaper || '';
        urlLocked.value = !!(pref.wallpaper && pref.wallpaperHidden);
        urlInput.value = urlLocked.value ? '' : (pref.wallpaper || '');
        applyToDOM(pref.wallpaper || undefined, opacity.value);
    }
    catch { }
});
async function saveSettings() {
    saving.value = true;
    savingMsg.value = '';
    try {
        const payload = { opacity: opacity.value };
        if (!urlLocked.value) {
            payload.wallpaper = urlInput.value.trim() || null;
        }
        const res = await preferenceApi.update(payload);
        currentWallpaper.value = res.wallpaper || '';
        urlLocked.value = !!res.wallpaperHidden;
        if (urlLocked.value) {
            urlInput.value = '';
        }
        else {
            urlInput.value = res.wallpaper || '';
        }
        applyToDOM(currentWallpaper.value, opacity.value);
        savingMsg.value = '已保存';
        setTimeout(() => { savingMsg.value = ''; }, 2000);
    }
    catch (err) {
        savingMsg.value = err?.message || '保存失败';
    }
    finally {
        saving.value = false;
    }
}
async function resetSettings() {
    saving.value = true;
    savingMsg.value = '';
    try {
        await preferenceApi.update({ wallpaper: null, opacity: 0.35 });
        currentWallpaper.value = '';
        urlInput.value = '';
        opacity.value = 0.35;
        urlLocked.value = false;
        savingMsg.value = '已重置';
        setTimeout(() => { savingMsg.value = ''; }, 2000);
    }
    catch (err) {
        savingMsg.value = err?.message || '重置失败';
    }
    finally {
        saving.value = false;
    }
}
async function onUpload(e) {
    const input = e.target;
    const f = input.files?.[0];
    if (!f)
        return;
    if (!auth.isLoggedIn) {
        uploadMsg.value = '请先登录';
        input.value = '';
        return;
    }
    uploading.value = true;
    uploadMsg.value = '';
    try {
        const up = await uploadApi.upload(f);
        urlLocked.value = true;
        urlInput.value = '';
        currentWallpaper.value = up.url;
        await preferenceApi.update({
            wallpaper: up.url,
            opacity: opacity.value,
        });
        uploadMsg.value = '已上传并应用（URL 隐藏以保护隐私）';
        setTimeout(() => { uploadMsg.value = ''; }, 3000);
    }
    catch (err) {
        uploadMsg.value = err?.message || '上传失败';
    }
    finally {
        uploading.value = false;
        input.value = '';
    }
}
function onUrlUnlocked() {
    urlLocked.value = false;
    urlInput.value = '';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['field-input']} */ ;
/** @type {__VLS_StyleScopedClasses['unlock-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "settings-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-bg" },
    ...{ style: ({
            backgroundImage: __VLS_ctx.currentWallpaper ? `url(${__VLS_ctx.currentWallpaper})` : undefined,
            opacity: __VLS_ctx.opacity,
        }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-label" },
});
((__VLS_ctx.opacity * 100).toFixed(0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "field-label" },
});
if (!__VLS_ctx.urlLocked) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "url",
        placeholder: "https://...",
        ...{ class: "field-input" },
    });
    (__VLS_ctx.urlInput);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "text",
        value: "（已通过服务器上传，URL 已隐藏）",
        disabled: true,
        ...{ class: "field-input field-locked" },
    });
}
if (__VLS_ctx.urlLocked) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.onUrlUnlocked) },
        ...{ class: "unlock-btn" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "field-label" },
});
((__VLS_ctx.opacity * 100).toFixed(0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "range",
    min: "0",
    max: "1",
    step: "0.01",
});
(__VLS_ctx.opacity);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.saveSettings) },
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.saving),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.resetSettings) },
    ...{ class: "btn btn-ghost" },
    disabled: (__VLS_ctx.saving),
});
if (__VLS_ctx.savingMsg) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint" },
    });
    (__VLS_ctx.savingMsg);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "hint" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onChange: (__VLS_ctx.onUpload) },
    type: "file",
    accept: "image/*",
    disabled: (__VLS_ctx.uploading),
});
if (__VLS_ctx.uploadMsg) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hint" },
        ...{ style: {} },
    });
    (__VLS_ctx.uploadMsg);
}
/** @type {__VLS_StyleScopedClasses['settings-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-area']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field-locked']} */ ;
/** @type {__VLS_StyleScopedClasses['unlock-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            urlInput: urlInput,
            currentWallpaper: currentWallpaper,
            opacity: opacity,
            urlLocked: urlLocked,
            saving: saving,
            savingMsg: savingMsg,
            uploading: uploading,
            uploadMsg: uploadMsg,
            saveSettings: saveSettings,
            resetSettings: resetSettings,
            onUpload: onUpload,
            onUrlUnlocked: onUrlUnlocked,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
