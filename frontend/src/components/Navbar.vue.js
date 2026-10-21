import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import NotificationBell from './NotificationBell.vue';
const router = useRouter();
const auth = useAuthStore();
const notif = useNotificationStore();
const avatarMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
onMounted(() => {
    auth.initFromStorage();
    auth.fetchMe();
    if (auth.isLoggedIn) {
        notif.startPolling();
    }
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
/** @type {__VLS_StyleScopedClasses['mobile-close']} */ ;
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
    /** @type {[typeof NotificationBell, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(NotificationBell, new NotificationBell({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
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
    const __VLS_39 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        to: "/login",
        ...{ class: "nav-link login-btn" },
    }));
    const __VLS_41 = __VLS_40({
        to: "/login",
        ...{ class: "nav-link login-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_42.slots.default;
    var __VLS_42;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeMobile) },
        ...{ class: "mobile-close" },
        'aria-label': "关闭菜单",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: "M18 6L6 18M6 6l12 12",
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
    const __VLS_43 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        to: "/",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_47;
    let __VLS_48;
    let __VLS_49;
    const __VLS_50 = {
        onClick: (__VLS_ctx.closeMobile)
    };
    __VLS_46.slots.default;
    var __VLS_46;
    if (__VLS_ctx.auth.isLoggedIn && __VLS_ctx.auth.user?.name) {
        const __VLS_51 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            ...{ 'onClick': {} },
            to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_53 = __VLS_52({
            ...{ 'onClick': {} },
            to: (`/user/${encodeURIComponent(__VLS_ctx.auth.user.name)}`),
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        let __VLS_55;
        let __VLS_56;
        let __VLS_57;
        const __VLS_58 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_54.slots.default;
        var __VLS_54;
    }
    const __VLS_59 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        to: "/tags",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        to: "/tags",
        ...{ class: "mobile-link" },
        activeClass: "active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_63;
    let __VLS_64;
    let __VLS_65;
    const __VLS_66 = {
        onClick: (__VLS_ctx.closeMobile)
    };
    __VLS_62.slots.default;
    var __VLS_62;
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_67 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
            ...{ 'onClick': {} },
            to: "/new",
            ...{ class: "mobile-link write-btn" },
        }));
        const __VLS_69 = __VLS_68({
            ...{ 'onClick': {} },
            to: "/new",
            ...{ class: "mobile-link write-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        let __VLS_71;
        let __VLS_72;
        let __VLS_73;
        const __VLS_74 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_70.slots.default;
        var __VLS_70;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_75 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
            to: "/messages",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
            to: "/messages",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_79;
        let __VLS_80;
        let __VLS_81;
        const __VLS_82 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_78.slots.default;
        var __VLS_78;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_83 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
            ...{ 'onClick': {} },
            to: "/drafts",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_85 = __VLS_84({
            ...{ 'onClick': {} },
            to: "/drafts",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        let __VLS_87;
        let __VLS_88;
        let __VLS_89;
        const __VLS_90 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_86.slots.default;
        var __VLS_86;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_91 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            ...{ 'onClick': {} },
            to: "/settings",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_93 = __VLS_92({
            ...{ 'onClick': {} },
            to: "/settings",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        let __VLS_95;
        let __VLS_96;
        let __VLS_97;
        const __VLS_98 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_94.slots.default;
        var __VLS_94;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        const __VLS_99 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
            ...{ 'onClick': {} },
            to: "/levels",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }));
        const __VLS_101 = __VLS_100({
            ...{ 'onClick': {} },
            to: "/levels",
            ...{ class: "mobile-link" },
            activeClass: "active",
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        let __VLS_103;
        let __VLS_104;
        let __VLS_105;
        const __VLS_106 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_102.slots.default;
        var __VLS_102;
    }
    if (__VLS_ctx.auth.isLoggedIn) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.handleLogout) },
            ...{ class: "mobile-link danger" },
        });
    }
    else {
        const __VLS_107 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "mobile-link login-btn" },
        }));
        const __VLS_109 = __VLS_108({
            ...{ 'onClick': {} },
            to: "/login",
            ...{ class: "mobile-link login-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        let __VLS_111;
        let __VLS_112;
        let __VLS_113;
        const __VLS_114 = {
            onClick: (__VLS_ctx.closeMobile)
        };
        __VLS_110.slots.default;
        var __VLS_110;
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
/** @type {__VLS_StyleScopedClasses['mobile-close']} */ ;
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
            NotificationBell: NotificationBell,
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
