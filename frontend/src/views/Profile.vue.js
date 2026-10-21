/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api, extractError } from '@/api/client';
import { postApi } from '@/api';
import PostCard from '@/components/PostCard.vue';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const profile = ref(null);
const open = ref(true);
const editing = ref(false);
const editName = ref('');
const editBio = ref('');
const editAvatar = ref('');
const saving = ref(false);
const uploading = ref(false);
const msg = ref('');
const error = ref('');
const isMe = computed(() => {
    return auth.isLoggedIn && auth.user?.name === route.params.name;
});
const isGuest = computed(() => profile.value?.role === 'GUEST');
const isAdmin = computed(() => profile.value?.role === 'ADMIN');
const LEVEL_NAMES = ['幼丸', '新丸', '小小丸', '小丸', '中丸', '大丸', '大大丸', '超大丸', '巨丸', '饭纲丸', '射命丸'];
const LEVEL_COLORS = ['#9e9e9e', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722', '#8bc34a', '#3f51b5', '#245a88', '#ef4045'];
const badge = computed(() => {
    if (!profile.value)
        return null;
    if (profile.value.role === 'GUEST')
        return null;
    if (profile.value.role === 'ADMIN') {
        return { text: '姬海棠 LV.-1', color: '#a72aab', bg: '#a72aab26', extraTag: 'ADMIN' };
    }
    const lv = Math.max(0, Math.min(10, profile.value.level || 0));
    const color = LEVEL_COLORS[lv];
    return { text: `${LEVEL_NAMES[lv]} LV.${lv}`, color, bg: color + '26' };
});
async function loadProfile() {
    error.value = '';
    try {
        if (isMe.value) {
            await auth.fetchMe();
            profile.value = auth.user;
        }
        else {
            const name = route.params.name;
            const res = await api.get(`/users/${encodeURIComponent(name)}`);
            profile.value = res.data.user || res.data;
        }
    }
    catch (err) {
        error.value = extractError(err);
    }
}
const POST_PAGE_SIZE = 8;
const postSlugs = ref([]);
const postsLoading = ref(false);
const postsHasMore = ref(true);
const postsError = ref('');
const postsEmpty = ref(false);
let postPageRef = 1;
let postLoadingRef = false;
let postHasMoreRef = true;
let postBusyRef = false;
let scrollHandlerBound = false;
async function loadMorePosts() {
    if (!profile.value?.id)
        return;
    if (postBusyRef || postLoadingRef || !postHasMoreRef)
        return;
    postBusyRef = true;
    postsLoading.value = true;
    postLoadingRef = true;
    postsError.value = '';
    try {
        const page = postPageRef;
        const data = await postApi.list({
            page,
            pageSize: POST_PAGE_SIZE,
            authorId: profile.value.id
        });
        const newSlugs = (data.posts || []).map((p) => p.slug);
        postSlugs.value = [...postSlugs.value, ...newSlugs.filter(s => !postSlugs.value.includes(s))];
        const more = Boolean(data.hasMore);
        postsHasMore.value = more;
        postHasMoreRef = more;
        if (more)
            postPageRef = page + 1;
        if (page === 1 && newSlugs.length === 0)
            postsEmpty.value = true;
    }
    catch (err) {
        postsError.value = extractError(err);
    }
    finally {
        postBusyRef = false;
        postsLoading.value = false;
        postLoadingRef = false;
    }
}
function onScroll() {
    if (!profile.value?.id)
        return;
    if (!postHasMoreRef || postLoadingRef)
        return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight || 0;
    const docH = document.documentElement.scrollHeight || 0;
    if (scrollTop + vh >= docH - 200) {
        loadMorePosts();
    }
}
function resetPostState() {
    postSlugs.value = [];
    postsLoading.value = false;
    postsHasMore.value = true;
    postsError.value = '';
    postsEmpty.value = false;
    postPageRef = 1;
    postLoadingRef = false;
    postHasMoreRef = true;
    postBusyRef = false;
}
function bindScroll() {
    if (!scrollHandlerBound) {
        window.addEventListener('scroll', onScroll);
        scrollHandlerBound = true;
    }
}
function unbindScroll() {
    if (scrollHandlerBound) {
        window.removeEventListener('scroll', onScroll);
        scrollHandlerBound = false;
    }
}
async function loadAllAfterProfile() {
    resetPostState();
    bindScroll();
    await nextTick();
    await loadMorePosts();
}
function startEdit() {
    if (!profile.value)
        return;
    editName.value = profile.value.name || '';
    editBio.value = profile.value.signature || '';
    editAvatar.value = profile.value.avatar || '';
    msg.value = '';
    editing.value = true;
}
function cancelEdit() {
    editing.value = false;
    msg.value = '';
}
async function onFileChange(e) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file)
        return;
    if (!file.type.startsWith('image/')) {
        const tip = '只能上传图片文件（jpg/png/gif/webp）';
        msg.value = tip;
        alert(tip);
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        const tip = '文件超过 10MB 限制，请压缩后再试';
        msg.value = tip;
        alert(tip);
        return;
    }
    uploading.value = true;
    msg.value = '上传中...';
    try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await api.post('/upload?kind=avatar', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        editAvatar.value = res.data.url;
        msg.value = '头像已上传';
    }
    catch (err) {
        const tip = extractError(err) || '上传失败，请重试';
        msg.value = tip;
        alert('头像上传失败：' + tip);
    }
    finally {
        uploading.value = false;
        input.value = '';
    }
}
async function saveEdit() {
    if (!profile.value)
        return;
    saving.value = true;
    error.value = '';
    msg.value = '';
    try {
        const patch = {};
        if (editName.value !== profile.value.name)
            patch.name = editName.value.trim();
        if (editBio.value !== (profile.value.signature || ''))
            patch.signature = editBio.value.trim();
        if (editAvatar.value !== (profile.value.avatar || ''))
            patch.avatar = editAvatar.value.trim();
        if (Object.keys(patch).length === 0) {
            editing.value = false;
            return;
        }
        const res = await api.patch('/me/profile', patch);
        const updated = res.data.user || res.data;
        profile.value = updated;
        auth.user = updated;
        localStorage.setItem('user', JSON.stringify(updated));
        editing.value = false;
        msg.value = '已保存';
    }
    catch (err) {
        error.value = extractError(err);
        msg.value = error.value;
    }
    finally {
        saving.value = false;
    }
}
async function deleteAccount() {
    if (!profile.value)
        return;
    if (isAdmin.value) {
        msg.value = '管理员账号不能被删除';
        return;
    }
    const label = profile.value.name || profile.value.email || `用户#${profile.value.id}`;
    const input = window.prompt(`要删除账号「${label}」，请输入该用户名确认：`);
    if (input === null)
        return;
    if ((input || '').trim() !== (profile.value.name || '')) {
        alert('输入的用户名不匹配，已取消删除');
        return;
    }
    const ok = window.confirm('再次确认：确定要删除你的账号以及所有相关数据吗？此操作不可恢复！');
    if (!ok)
        return;
    try {
        await api.delete('/me');
        auth.logout();
        router.push('/');
    }
    catch (err) {
        msg.value = extractError(err);
    }
}
onMounted(async () => {
    await loadProfile();
    if (profile.value?.id)
        loadAllAfterProfile();
});
watch(() => route.params.name, async () => {
    editing.value = false;
    open.value = true;
    msg.value = '';
    error.value = '';
    unbindScroll();
    resetPostState();
    profile.value = null;
    await loadProfile();
    if (profile.value?.id)
        loadAllAfterProfile();
});
onBeforeUnmount(unbindScroll);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge-clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['chevron']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-edit']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-page" },
});
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-card" },
    });
    (__VLS_ctx.error);
}
else if (!__VLS_ctx.profile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-card" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card profile-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.error))
                    return;
                if (!!(!__VLS_ctx.profile))
                    return;
                __VLS_ctx.open = !__VLS_ctx.open;
            } },
        ...{ class: "profile-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar-circle" },
    });
    if (__VLS_ctx.profile.avatar) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.profile.avatar),
            alt: "头像",
            ...{ class: "avatar-img" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "avatar-fallback" },
        });
        ((__VLS_ctx.profile.name || '?')[0]);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "user-name" },
    });
    (__VLS_ctx.profile.name || '未命名');
    if (__VLS_ctx.badge) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(!__VLS_ctx.profile))
                        return;
                    if (!(__VLS_ctx.badge))
                        return;
                    __VLS_ctx.router.push('/levels');
                } },
            ...{ class: "level-badge level-badge-clickable" },
            ...{ style: ({ borderColor: __VLS_ctx.badge.color, color: __VLS_ctx.badge.color, background: __VLS_ctx.badge.bg }) },
        });
        (__VLS_ctx.badge.text);
        if (__VLS_ctx.badge.extraTag) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "level-badge" },
                ...{ style: ({ borderColor: '#a72aab', color: '#a72aab', background: '#a72aab26' }) },
            });
            (__VLS_ctx.badge.extraTag);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-sign" },
    });
    (__VLS_ctx.isGuest ? (__VLS_ctx.profile.signature || '') : (__VLS_ctx.profile.signature || '你还没有个性签名哦~'));
    if (__VLS_ctx.profile.xp !== undefined) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "xp-row" },
        });
        (__VLS_ctx.profile.xp);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chevron" },
        ...{ class: ({ open: __VLS_ctx.open }) },
    });
    if (__VLS_ctx.open) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "profile-actions" },
        });
        if (!__VLS_ctx.editing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "action-buttons" },
            });
            if (__VLS_ctx.isMe && !__VLS_ctx.isGuest) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (__VLS_ctx.startEdit) },
                    ...{ class: "btn-nav" },
                });
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: () => { } },
                ...{ class: "edit-form" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                maxlength: "16",
                disabled: (__VLS_ctx.isGuest),
                placeholder: "输入昵称",
            });
            (__VLS_ctx.editName);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                maxlength: "120",
                disabled: (__VLS_ctx.isGuest),
                placeholder: "个性签名（可选）",
            });
            (__VLS_ctx.editBio);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "avatar-edit" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "avatar-circle small" },
            });
            if (__VLS_ctx.editAvatar) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (__VLS_ctx.editAvatar),
                    ...{ class: "avatar-img" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "avatar-fallback" },
                });
                ((__VLS_ctx.editName || '?')[0]);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ onChange: (__VLS_ctx.onFileChange) },
                type: "file",
                accept: "image/*",
                disabled: (__VLS_ctx.isGuest || __VLS_ctx.uploading),
            });
            if (__VLS_ctx.uploading) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "hint" },
                });
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-actions" },
            });
            if (!__VLS_ctx.isGuest) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (__VLS_ctx.saveEdit) },
                    ...{ class: "btn-primary" },
                    disabled: (__VLS_ctx.saving),
                });
                (__VLS_ctx.saving ? '保存中...' : '💾 保存');
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (__VLS_ctx.cancelEdit) },
                ...{ class: "btn-nav" },
            });
            if (__VLS_ctx.isMe && !__VLS_ctx.isAdmin) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                    ...{ onClick: (__VLS_ctx.deleteAccount) },
                    ...{ class: "btn-danger" },
                });
            }
            if (__VLS_ctx.msg) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "hint" },
                });
                (__VLS_ctx.msg);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "posts-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "posts-title" },
    });
    ((__VLS_ctx.profile?.name || '用户'));
    if (__VLS_ctx.postsError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "posts-hint posts-error" },
        });
        (__VLS_ctx.postsError);
    }
    else if (__VLS_ctx.postsEmpty) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "posts-hint" },
        });
        (__VLS_ctx.profile?.name || '该用户');
    }
    else if (__VLS_ctx.postSlugs.length === 0 && __VLS_ctx.postsLoading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "posts-hint" },
        });
    }
    else {
        for (const [slug] of __VLS_getVForSourceType((__VLS_ctx.postSlugs))) {
            /** @type {[typeof PostCard, ]} */ ;
            // @ts-ignore
            const __VLS_0 = __VLS_asFunctionalComponent(PostCard, new PostCard({
                key: (slug),
                slug: (slug),
            }));
            const __VLS_1 = __VLS_0({
                key: (slug),
                slug: (slug),
            }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        }
        if (__VLS_ctx.postsLoading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "posts-hint" },
            });
        }
        else if (!__VLS_ctx.postsHasMore) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "posts-hint" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['profile-page']} */ ;
/** @type {__VLS_StyleScopedClasses['error-card']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-card']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-main']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name-row']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge-clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['user-sign']} */ ;
/** @type {__VLS_StyleScopedClasses['xp-row']} */ ;
/** @type {__VLS_StyleScopedClasses['chevron']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-section']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-title']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-error']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['posts-hint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PostCard: PostCard,
            router: router,
            profile: profile,
            open: open,
            editing: editing,
            editName: editName,
            editBio: editBio,
            editAvatar: editAvatar,
            saving: saving,
            uploading: uploading,
            msg: msg,
            error: error,
            isMe: isMe,
            isGuest: isGuest,
            isAdmin: isAdmin,
            badge: badge,
            postSlugs: postSlugs,
            postsLoading: postsLoading,
            postsHasMore: postsHasMore,
            postsError: postsError,
            postsEmpty: postsEmpty,
            startEdit: startEdit,
            cancelEdit: cancelEdit,
            onFileChange: onFileChange,
            saveEdit: saveEdit,
            deleteAccount: deleteAccount,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
