/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postApi, tagApi, uploadApi, extractError } from '@/api';
import { useAuthStore } from '@/stores/auth';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const slug = computed(() => route.params.slug);
const isEdit = computed(() => !!slug.value);
const MAX_IMAGES = 3;
const MAX_AUDIOS = 2;
const MAX_SIZE = 50 * 1024 * 1024;
const AUTOSAVE_INTERVAL = 30000;
const DRAFT_LOCAL_KEY = 'marublog_autosave_draft_slug';
const loading = ref(false);
const title = ref('');
const content = ref('');
const excerpt = ref('');
const tagsInput = ref('');
const status = ref('published');
const scheduledAt = ref('');
const presetTags = ref([]);
const submitting = ref(false);
const error = ref('');
const editorRef = ref(null);
const images = ref([]);
const audios = ref([]);
const autosaveTimer = ref(null);
const debounceTimer = ref(null);
const lastSavedSnapshot = ref('');
const draftSlug = ref(null);
const autosaveStatus = ref('');
function buildSnapshot() {
    return JSON.stringify({ t: title.value, c: content.value, e: excerpt.value, tags: tagsInput.value });
}
async function autosave() {
    if (!auth.isLoggedIn)
        return;
    const snap = buildSnapshot();
    if (snap === lastSavedSnapshot.value)
        return;
    if (!title.value.trim() && !content.value.trim())
        return;
    try {
        const payload = {
            title: title.value.trim() || '(未命名草稿)',
            content: content.value,
            excerpt: excerpt.value.trim() || undefined,
            tags: parsedTags.value,
            status: 'draft',
        };
        let result;
        if (isEdit.value && slug.value) {
            result = await postApi.update(slug.value, payload);
        }
        else if (draftSlug.value) {
            result = await postApi.update(draftSlug.value, payload);
        }
        else {
            result = await postApi.create(payload);
            draftSlug.value = result.slug;
            localStorage.setItem(DRAFT_LOCAL_KEY, result.slug);
        }
        lastSavedSnapshot.value = snap;
        autosaveStatus.value = `自动保存于 ${new Date().toLocaleTimeString()}`;
    }
    catch (err) {
        autosaveStatus.value = '自动保存失败';
    }
}
function triggerDebouncedAutosave() {
    if (debounceTimer.value)
        clearTimeout(debounceTimer.value);
    debounceTimer.value = window.setTimeout(() => {
        autosave();
    }, 3000);
}
function parseMdMedia(md) {
    const imgs = [];
    const auds = [];
    if (!md)
        return { imgs, auds };
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let m;
    while ((m = imgRegex.exec(md))) {
        const name = m[1] || m[2].split('/').pop() || 'image';
        imgs.push({ url: m[2], name, snippet: m[0] });
    }
    const audRegex = /\[audio:([^\]]*)\]\(([^)]+)\)/g;
    while ((m = audRegex.exec(md))) {
        const name = m[1] || m[2].split('/').pop() || 'audio';
        auds.push({ url: m[2], name, snippet: m[0] });
    }
    return { imgs, auds };
}
function clearAll() {
    if (!confirm('确定要清空所有内容吗？（不会删除已上传的文件）'))
        return;
    title.value = '';
    content.value = '';
    excerpt.value = '';
    tagsInput.value = '';
    images.value = [];
    audios.value = [];
    autosaveStatus.value = '';
    lastSavedSnapshot.value = '';
    draftSlug.value = null;
    localStorage.removeItem(DRAFT_LOCAL_KEY);
}
onMounted(async () => {
    if (!auth.isLoggedIn) {
        alert('请先登录');
        router.push('/login');
        return;
    }
    try {
        const tagRes = await tagApi.list();
        presetTags.value = Array.isArray(tagRes) ? tagRes.map((t) => t.name || t).filter(Boolean) : [];
    }
    catch { }
    if (isEdit.value && slug.value) {
        loading.value = true;
        try {
            const post = await postApi.getBySlug(slug.value);
            title.value = post.title;
            content.value = post.content || '';
            excerpt.value = post.excerpt || '';
            tagsInput.value = (post.tags || []).join(' ');
            status.value = post.status === 'draft' ? 'draft' : 'published';
            const { imgs, auds } = parseMdMedia(content.value);
            images.value = imgs.slice(0, MAX_IMAGES);
            audios.value = auds.slice(0, MAX_AUDIOS);
            lastSavedSnapshot.value = buildSnapshot();
        }
        catch (err) {
            error.value = extractError(err);
        }
        finally {
            loading.value = false;
        }
    }
    else {
        const savedSlug = localStorage.getItem(DRAFT_LOCAL_KEY);
        if (savedSlug) {
            try {
                const post = await postApi.getBySlug(savedSlug);
                if (post.status === 'draft' && post.authorId === auth.user?.id) {
                    draftSlug.value = savedSlug;
                    title.value = post.title === '(未命名草稿)' ? '' : post.title;
                    content.value = post.content || '';
                    excerpt.value = post.excerpt || '';
                    tagsInput.value = (post.tags || []).join(' ');
                    status.value = 'draft';
                    const { imgs, auds } = parseMdMedia(content.value);
                    images.value = imgs.slice(0, MAX_IMAGES);
                    audios.value = auds.slice(0, MAX_AUDIOS);
                    lastSavedSnapshot.value = buildSnapshot();
                    autosaveStatus.value = '已恢复上次的草稿';
                }
            }
            catch { }
        }
    }
    autosaveTimer.value = window.setInterval(autosave, AUTOSAVE_INTERVAL);
    window.addEventListener('beforeunload', handleBeforeUnload);
});
function handleBeforeUnload() {
    if (lastSavedSnapshot.value !== buildSnapshot() && (title.value.trim() || content.value.trim())) {
        autosave();
        return '有未保存的内容，确定要离开吗？';
    }
    return undefined;
}
onUnmounted(() => {
    if (autosaveTimer.value) {
        clearInterval(autosaveTimer.value);
        autosaveTimer.value = null;
    }
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
        debounceTimer.value = null;
    }
    window.removeEventListener('beforeunload', handleBeforeUnload);
});
watch([title, content, excerpt, tagsInput], () => {
    if (lastSavedSnapshot.value !== buildSnapshot()) {
        autosaveStatus.value = '有未保存的更改...';
        triggerDebouncedAutosave();
    }
});
const parsedTags = computed(() => tagsInput.value.split(' ').map(s => s.trim()).filter(Boolean));
function insert(before, after = '') {
    const el = editorRef.value;
    if (!el)
        return;
    const start = el.selectionStart ?? content.value.length;
    const end = el.selectionEnd ?? content.value.length;
    const selected = content.value.slice(start, end);
    content.value =
        content.value.slice(0, start) + before + selected + after + content.value.slice(end);
    setTimeout(() => {
        el.focus();
        el.selectionStart = start + before.length;
        el.selectionEnd = start + before.length + selected.length;
    }, 0);
}
function insertTag(tag) {
    const current = parsedTags.value;
    if (current.includes(tag))
        return;
    tagsInput.value = current.length ? current.join(' ') + ' ' + tag : tag;
}
async function handleImageFiles(files) {
    if (!files || !files.length)
        return;
    const remaining = MAX_IMAGES - images.value.length;
    if (remaining <= 0) {
        alert(`最多只能上传 ${MAX_IMAGES} 张图片`);
        return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    for (const file of toUpload) {
        if (!file.type.startsWith('image/')) {
            alert('只能上传图片');
            continue;
        }
        if (file.size > MAX_SIZE) {
            alert(`${file.name} 超过 10MB`);
            continue;
        }
        try {
            const res = await uploadApi.upload(file);
            const safeName = res.name.replace(/\.[^.]+$/, '');
            const snippet = `\n![${safeName}](${res.url})\n`;
            content.value += snippet;
            images.value.push({ url: res.url, name: res.name, snippet });
        }
        catch (err) {
            alert(`上传失败: ${extractError(err)}`);
        }
    }
}
async function handleAudioFile(file) {
    if (!file)
        return;
    if (audios.value.length >= MAX_AUDIOS) {
        alert(`最多只能上传 ${MAX_AUDIOS} 个音频`);
        return;
    }
    if (!file.type.startsWith('audio/')) {
        alert('只能上传音频');
        return;
    }
    if (file.size > MAX_SIZE) {
        alert('文件超过 10MB');
        return;
    }
    try {
        const res = await uploadApi.upload(file);
        const safeName = res.name.replace(/\.[^.]+$/, '');
        const snippet = `\n[audio:${safeName}](${res.url})\n`;
        content.value += snippet;
        audios.value.push({ url: res.url, name: res.name, snippet });
    }
    catch (err) {
        alert(`上传失败: ${extractError(err)}`);
    }
}
async function removeImage(item) {
    try {
        await uploadApi.delete(item.url);
    }
    catch { }
    images.value = images.value.filter(x => x.url !== item.url);
    content.value = content.value.replace(item.snippet, '');
}
async function removeAudio(item) {
    try {
        await uploadApi.delete(item.url);
    }
    catch { }
    audios.value = audios.value.filter(x => x.url !== item.url);
    content.value = content.value.replace(item.snippet, '');
}
async function handleSubmit(asDraft = false) {
    if (!asDraft && !title.value.trim()) {
        alert('标题不能为空');
        return;
    }
    if (!asDraft && !content.value.trim()) {
        alert('内容不能为空');
        return;
    }
    submitting.value = true;
    error.value = '';
    try {
        const payload = {
            title: title.value.trim() || '(未命名草稿)',
            content: content.value,
            excerpt: excerpt.value.trim() || undefined,
            tags: parsedTags.value,
            status: asDraft ? 'draft' : status.value,
        };
        if (scheduledAt.value) {
            payload.scheduledAt = new Date(scheduledAt.value).toISOString();
        }
        let result;
        if (isEdit.value && slug.value) {
            result = await postApi.update(slug.value, payload);
        }
        else if (draftSlug.value) {
            result = await postApi.update(draftSlug.value, payload);
        }
        else {
            result = await postApi.create(payload);
        }
        localStorage.removeItem(DRAFT_LOCAL_KEY);
        if (!asDraft) {
            draftSlug.value = null;
            lastSavedSnapshot.value = '';
            autosaveStatus.value = '';
            router.push(`/post/${result.slug}`);
        }
        else {
            draftSlug.value = result.slug;
            localStorage.setItem(DRAFT_LOCAL_KEY, result.slug);
            lastSavedSnapshot.value = buildSnapshot();
            autosaveStatus.value = `已保存为草稿 ${new Date().toLocaleTimeString()}`;
        }
    }
    catch (err) {
        error.value = extractError(err);
    }
    finally {
        submitting.value = false;
    }
}
async function handleDelete() {
    if (!isEdit.value || !slug.value)
        return;
    if (!confirm('确定要删除这篇文章吗？'))
        return;
    try {
        await postApi.remove(slug.value);
        router.push('/');
    }
    catch (err) {
        alert(extractError(err));
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['autosave-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ style: {} },
});
(__VLS_ctx.isEdit ? '编辑文章' : '写新文章');
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card" },
    });
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "error" },
            ...{ style: {} },
        });
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        placeholder: "给它起个名字...",
        maxlength: "300",
    });
    (__VLS_ctx.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        placeholder: "例如 Vue Spring Boot 技术",
    });
    (__VLS_ctx.tagsInput);
    if (__VLS_ctx.presetTags.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        for (const [t] of __VLS_getVForSourceType((__VLS_ctx.presetTags))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.presetTags.length))
                            return;
                        __VLS_ctx.insertTag(t);
                    } },
                key: (t),
                type: "button",
                ...{ class: "tag" },
                ...{ class: ({ active: __VLS_ctx.parsedTags.includes(t) }) },
                ...{ style: {} },
            });
            (t);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.excerpt),
        placeholder: "留空将自动截取...",
        maxlength: "500",
        rows: "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "toolbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('**', '**');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('*', '*');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('`', '`');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('\n```\n', '\n```\n');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('# ');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('- ');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('[文本](链接)');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.insert('![alt](https://example.com/image.jpg)');
            } },
        type: "button",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        ref: "editorRef",
        value: (__VLS_ctx.content),
        placeholder: "支持 Markdown 格式...&#10;&#10;图片自动插入: ![name](/api/uploads/xxx.png)&#10;音频自动插入: [audio:name](/api/uploads/xxx.mp3)",
        rows: "18",
        ...{ style: {} },
    });
    /** @type {typeof __VLS_ctx.editorRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    (__VLS_ctx.MAX_IMAGES);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: ((e) => __VLS_ctx.handleImageFiles(e.target.files)) },
        type: "file",
        accept: "image/*",
        multiple: true,
        disabled: (__VLS_ctx.images.length >= __VLS_ctx.MAX_IMAGES),
    });
    if (__VLS_ctx.images.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "hint" },
        });
        (__VLS_ctx.images.length);
        (__VLS_ctx.MAX_IMAGES);
    }
    if (__VLS_ctx.images.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        for (const [img] of __VLS_getVForSourceType((__VLS_ctx.images))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (img.url),
                ...{ class: "thumb-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (img.url),
                ...{ class: "thumb" },
                alt: (img.name),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.images.length))
                            return;
                        __VLS_ctx.removeImage(img);
                    } },
                type: "button",
                ...{ class: "thumb-close" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "thumb-name" },
            });
            (img.name);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    (__VLS_ctx.MAX_AUDIOS);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: ((e) => __VLS_ctx.handleAudioFile((e.target.files || null)?.[0] || null)) },
        type: "file",
        accept: "audio/*",
        disabled: (__VLS_ctx.audios.length >= __VLS_ctx.MAX_AUDIOS),
    });
    if (__VLS_ctx.audios.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "hint" },
        });
        (__VLS_ctx.audios.length);
        (__VLS_ctx.MAX_AUDIOS);
    }
    if (__VLS_ctx.audios.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        for (const [a] of __VLS_getVForSourceType((__VLS_ctx.audios))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                key: (a.url),
                ...{ style: {} },
            });
            (a.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!(__VLS_ctx.audios.length))
                            return;
                        __VLS_ctx.removeAudio(a);
                    } },
                type: "button",
                ...{ class: "thumb-close" },
                ...{ style: {} },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "datetime-local",
    });
    (__VLS_ctx.scheduledAt);
    if (__VLS_ctx.autosaveStatus) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "autosave-hint" },
            ...{ class: ({ dirty: __VLS_ctx.autosaveStatus.includes('未保存') }) },
        });
        (__VLS_ctx.autosaveStatus);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-actions" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.handleSubmit(false);
            } },
        ...{ class: "btn-primary" },
        disabled: (__VLS_ctx.submitting),
    });
    (__VLS_ctx.submitting ? '发布中...' : (__VLS_ctx.isEdit ? '保存修改' : '发布'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.handleSubmit(true);
            } },
        ...{ class: "btn-ghost" },
        disabled: (__VLS_ctx.submitting),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.clearAll) },
        ...{ class: "btn-ghost" },
        disabled: (__VLS_ctx.submitting),
    });
    if (__VLS_ctx.isEdit) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleDelete) },
            ...{ class: "btn-ghost danger" },
            disabled: (__VLS_ctx.submitting),
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.router.back();
            } },
        ...{ class: "btn-ghost" },
    });
}
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-item']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-close']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-name']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-close']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['autosave-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            router: router,
            isEdit: isEdit,
            MAX_IMAGES: MAX_IMAGES,
            MAX_AUDIOS: MAX_AUDIOS,
            loading: loading,
            title: title,
            content: content,
            excerpt: excerpt,
            tagsInput: tagsInput,
            scheduledAt: scheduledAt,
            presetTags: presetTags,
            submitting: submitting,
            error: error,
            editorRef: editorRef,
            images: images,
            audios: audios,
            autosaveStatus: autosaveStatus,
            clearAll: clearAll,
            parsedTags: parsedTags,
            insert: insert,
            insertTag: insertTag,
            handleImageFiles: handleImageFiles,
            handleAudioFile: handleAudioFile,
            removeImage: removeImage,
            removeAudio: removeAudio,
            handleSubmit: handleSubmit,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
