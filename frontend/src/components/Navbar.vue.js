import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const auth = useAuthStore();
const avatarMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
onMounted(() => {
    auth.initFromStorage();
    auth.fetchMe();
});
const initial = computed(() => {
    const name = auth.user?.name;
    if (name && name.length > 0)
        return name[0].toUpperCase();
    const email = auth.user?.email;
    if (email && email.length > 0)
        return email[0].toUpperCase();
    return '?';
});
function handleLogout() {
    auth.logout();
    avatarMenuOpen.value = false;
    mobileMenuOpen.value = false;
    router.push('/');
}
function goProfile() {
    avatarMenuOpen.value = false;
    mobileMenuOpen.value = false;
    const name = auth.user?.name;
    if (name) {
        router.push(`/user/${encodeURIComponent(name)}`);
    }
    else {
        router.push('/');
    }
}
function closeMobile() {
    mobileMenuOpen.value = false;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['open']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['open']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['write-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "topbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-inner" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    to: "/",
    ...{ class: "brand" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    to: "/",
    ...{ class: "brand" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.closeMobile)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: "/favicon.png",
    alt: "logo",
    ...{ class: "brand-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "brand-text" },
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "nav-links" },
});
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_10 = __VLS_9({
    to: "/",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
if (__VLS_ctx.auth.isLoggedIn && __VLS_ctx.auth.user?.name) {
    const __VLS_12 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
        ...{ class: "nav-link" },
        activeClass: "active",
    }));
    const __VLS_14 = __VLS_13({
        to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
        ...{ class: "nav-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
else {
    const __VLS_16 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        to: "/login",
        ...{ class: "nav-link" },
    }));
    const __VLS_18 = __VLS_17({
        to: "/login",
        ...{ class: "nav-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    var __VLS_19;
}
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/tags",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_22 = __VLS_21({
    to: "/tags",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
var __VLS_23;
if (__VLS_ctx.auth.isLoggedIn) {
    const __VLS_24 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        to: "/new",
        ...{ class: "nav-link write-btn" },
    }));
    const __VLS_26 = __VLS_25({
        to: "/new",
        ...{ class: "nav-link write-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
}
if (__VLS_ctx.auth.isLoggedIn) {
    const __VLS_28 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        to: "/messages",
        ...{ class: "nav-link" },
        activeClass: "active",
    }));
    const __VLS_30 = __VLS_29({
        to: "/messages",
        ...{ class: "nav-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
}
if (__VLS_ctx.auth.isLoggedIn) {
    const __VLS_32 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        to: "/drafts",
        ...{ class: "nav-link" },
        activeClass: "active",
    }));
    const __VLS_34 = __VLS_33({
        to: "/drafts",
        ...{ class: "nav-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
}
if (__VLS_ctx.auth.isLoggedIn) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.isLoggedIn))
                    return;
                __VLS_ctx.avatarMenuOpen = !__VLS_ctx.avatarMenuOpen;
            } },
        ...{ class: "avatar-wrapper" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "avatar-btn" },
        ...{ class: ({ 'menu-open': __VLS_ctx.avatarMenuOpen }) },
        'aria-haspopup': "menu",
    });
    if (__VLS_ctx.auth.user?.avatar) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.auth.user.avatar),
            alt: "avatar",
            ...{ class: "avatar-img" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "avatar-initial" },
        });
        (__VLS_ctx.initial);
    }
    if (__VLS_ctx.avatarMenuOpen) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "avatar-menu" },
            role: "menu",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.goProfile) },
            ...{ class: "menu-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.auth.isLoggedIn))
                        return;
                    if (!(__VLS_ctx.avatarMenuOpen))
                        return;
                    __VLS_ctx.avatarMenuOpen = false;
                    __VLS_ctx.router.push('/settings');
                } },
            ...{ class: "menu-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.auth.isLoggedIn))
                        return;
                    if (!(__VLS_ctx.avatarMenuOpen))
                        return;
                    __VLS_ctx.avatarMenuOpen = false;
                    __VLS_ctx.router.push('/levels');
                } },
            ...{ class: "menu-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "menu-item danger" },
        });
    }
}
else {
    const __VLS_36 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        to: "/login",
        ...{ class: "nav-link login-btn" },
    }));
    const __VLS_38 = __VLS_37({
        to: "/login",
        ...{ class: "nav-link login-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.mobileMenuOpen = !__VLS_ctx.mobileMenuOpen;
        } },
    ...{ class: "hamburger" },
    ...{ class: ({ open: __VLS_ctx.mobileMenuOpen }) },
    'aria-label': "菜单",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeMobile) },
        ...{ class: "mobile-overlay" },
    });
}
if (__VLS_ctx.mobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
        ...{ class: "mobile-menu" },
    });
    if (__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-profile" },
        });
        if (__VLS_ctx.auth.user?.avatar) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (__VLS_ctx.auth.user.avatar),
                ...{ class: "mobile-avatar" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mobile-avatar-initial" },
            });
            (__VLS_ctx.initial);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-profile-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-name" },
        });
        (__VLS_ctx.auth.user?.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mobile-email" },
        });
        (__VLS_ctx.auth.user?.email);
    }
    const __VLS_40 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (__VLS_ctx.closeMobile)
    };
    __VLS_43.slots.default;
    var __VLS_43;
    if (__VLS_ctx.auth.isLoggedIn && __VLS_ctx.auth.user?.name) {
        const __VLS_48 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_52;
        let __VLS_53;
        let __VLS_54;
        const __VLS_55 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_51.slots.default;
        var __VLS_51;
    }
    const __VLS_56 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        to: "/tags",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        to: "/tags",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (__VLS_ctx.closeMobile)
    };
    __VLS_59.slots.default;
    var __VLS_59;
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_64 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            ...{ 'onClick': {} },
            to: "/new",
            ...{ class: "mobile-link write-btn" },
        }));
        const __VLS_66 = __VLS_65({
            ...{ 'onClick': {} },
            to: "/new",
            ...{ class: "mobile-link write-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        let __VLS_68;
        let __VLS_69;
        let __VLS_70;
        const __VLS_71 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_67.slots.default;
        var __VLS_67;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_72 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            ...{ 'onClick': {} },
            to: "/messages",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_74 = __VLS_73({
            ...{ 'onClick': {} },
            to: "/messages",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        let __VLS_76;
        let __VLS_77;
        let __VLS_78;
        const __VLS_79 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_75.slots.default;
        var __VLS_75;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_80 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            ...{ 'onClick': {} },
            to: "/drafts",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_82 = __VLS_81({
            ...{ 'onClick': {} },
            to: "/drafts",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        let __VLS_84;
        let __VLS_85;
        let __VLS_86;
        const __VLS_87 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_83.slots.default;
        var __VLS_83;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_88 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            ...{ 'onClick': {} },
            to: "/settings",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_90 = __VLS_89({
            ...{ 'onClick': {} },
            to: "/settings",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        let __VLS_92;
        let __VLS_93;
        let __VLS_94;
        const __VLS_95 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_91.slots.default;
        var __VLS_91;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_96 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            ...{ 'onClick': {} },
            to: "/levels",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_98 = __VLS_97({
            ...{ 'onClick': {} },
            to: "/levels",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        let __VLS_100;
        let __VLS_101;
        let __VLS_102;
        const __VLS_103 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_99.slots.default;
        var __VLS_99;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "mobile-link danger" },
        });
    }
    else {
        const __VLS_104 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "mobile-link login-btn" },
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "mobile-link login-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_108;
        let __VLS_109;
        let __VLS_110;
        const __VLS_111 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_107.slots.default;
        var __VLS_107;
    }
}
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['write-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-img']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-initial']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hamburger']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-avatar-initial']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-email']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['write-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            router: router,
            auth: auth,
            avatarMenuOpen: avatarMenuOpen,
            mobileMenuOpen: mobileMenuOpen,
            initial: initial,
            handleLogout: handleLogout,
            goProfile: goProfile,
            closeMobile: closeMobile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
