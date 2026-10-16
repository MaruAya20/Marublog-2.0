import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const auth = useAuthStore();
const mode = ref('email');
const email = ref('');
const code = ref('');
const name = ref('');
const nameForEmail = ref('');
const error = ref('');
const sending = ref(false);
const logging = ref(false);
const codeSent = ref(false);
const countdown = ref(0);
async function handleSendCode() {
    error.value = '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        error.value = '请输入有效邮箱';
        return;
    }
    sending.value = true;
    try {
        await auth.sendCode(email.value);
        codeSent.value = true;
        countdown.value = 60;
        const timer = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0)
                clearInterval(timer);
        }, 1000);
    }
    catch (err) {
        error.value = err.message;
    }
    finally {
        sending.value = false;
    }
}
async function handleEmailLogin() {
    error.value = '';
    if (!email.value || !code.value) {
        error.value = '请填邮箱和验证码';
        return;
    }
    logging.value = true;
    try {
        const data = await auth.loginWithCode(email.value, code.value, nameForEmail.value || undefined);
        if (data.user?.role === 'GUEST') {
            router.push(`/user/${encodeURIComponent(data.user?.name || '')}`);
        }
        else {
            router.push(`/user/${encodeURIComponent(data.user?.name || '')}`);
        }
    }
    catch (err) {
        error.value = err.message;
    }
    finally {
        logging.value = false;
    }
}
async function handleGuestLogin() {
    error.value = '';
    if (!name.value.trim()) {
        error.value = '请填昵称';
        return;
    }
    logging.value = true;
    try {
        const data = await auth.guestLogin(name.value.trim());
        router.push(`/user/${encodeURIComponent(data.user?.name || '')}`);
    }
    catch (err) {
        error.value = err.message;
    }
    finally {
        logging.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "page-title" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.mode = 'email';
        } },
    ...{ class: "btn-primary" },
    ...{ style: ({ background: __VLS_ctx.mode === 'email' ? 'var(--primary)' : '#eee', color: __VLS_ctx.mode === 'email' ? '#fff' : '#666' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.mode = 'guest';
        } },
    ...{ class: "btn-primary" },
    ...{ style: ({ background: __VLS_ctx.mode === 'guest' ? 'var(--primary)' : '#eee', color: __VLS_ctx.mode === 'guest' ? '#fff' : '#666' }) },
});
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
}
if (__VLS_ctx.mode === 'email') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "email",
        placeholder: "you@example.com",
    });
    (__VLS_ctx.email);
    if (__VLS_ctx.codeSent) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            placeholder: "你的昵称",
            maxlength: "16",
        });
        (__VLS_ctx.nameForEmail);
    }
    if (__VLS_ctx.codeSent) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            placeholder: "6位验证码",
            maxlength: "6",
        });
        (__VLS_ctx.code);
    }
    if (!__VLS_ctx.codeSent) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleSendCode) },
            ...{ class: "btn-primary" },
            ...{ style: {} },
            disabled: (__VLS_ctx.sending),
        });
        (__VLS_ctx.sending ? '发送中...' : '发送验证码');
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleSendCode) },
            ...{ class: "btn-ghost" },
            ...{ style: {} },
            disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sending),
        });
        (__VLS_ctx.countdown > 0 ? `${__VLS_ctx.countdown}s` : '重发');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleEmailLogin) },
            ...{ class: "btn-primary" },
            ...{ style: {} },
            disabled: (__VLS_ctx.logging),
        });
        (__VLS_ctx.logging ? '登录中...' : '登录');
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        placeholder: "随便起个名字吧",
        maxlength: "16",
    });
    (__VLS_ctx.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleGuestLogin) },
        ...{ class: "btn-primary" },
        ...{ style: {} },
        disabled: (__VLS_ctx.logging),
    });
    (__VLS_ctx.logging ? '进入中...' : '以游客身份进入');
}
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            mode: mode,
            email: email,
            code: code,
            name: name,
            nameForEmail: nameForEmail,
            error: error,
            sending: sending,
            logging: logging,
            codeSent: codeSent,
            countdown: countdown,
            handleSendCode: handleSendCode,
            handleEmailLogin: handleEmailLogin,
            handleGuestLogin: handleGuestLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
