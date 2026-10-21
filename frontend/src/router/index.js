import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/post/:slug',
            name: 'post-detail',
            component: () => import('@/views/PostDetail.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/user/:name',
            name: 'user-profile',
            component: () => import('@/views/Profile.vue')
        },
        {
            path: '/tags',
            name: 'tags',
            component: () => import('@/views/Tags.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/Settings.vue'),
            meta: { auth: true }
        },
        {
            path: '/levels',
            name: 'levels',
            component: () => import('@/views/Levels.vue')
        },
        {
            path: '/new',
            name: 'new-post',
            component: () => import('@/views/PostEditor.vue'),
            meta: { auth: true }
        },
        {
            path: '/edit/:slug',
            name: 'edit-post',
            component: () => import('@/views/PostEditor.vue'),
            meta: { auth: true }
        },
        {
            path: '/messages',
            name: 'messages',
            component: () => import('@/views/Messages.vue'),
            meta: { auth: true }
        },
        {
            path: '/drafts',
            name: 'drafts',
            component: () => import('@/views/Drafts.vue'),
            meta: { auth: true }
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/Admin.vue'),
            meta: { auth: true, admin: true }
        }
    ]
});
router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore();
    if (to.meta.auth && !auth.isLoggedIn) {
        auth.initFromStorage();
        if (!auth.isLoggedIn) {
            return next({ name: 'login', query: { redirect: to.fullPath } });
        }
    }
    if (to.meta.admin) {
        auth.initFromStorage();
        if (!auth.isLoggedIn) {
            return next({ name: 'login', query: { redirect: to.fullPath } });
        }
        if (!auth.isAdmin) {
            try {
                await auth.fetchMe();
            }
            catch { }
        }
        if (!auth.isAdmin) {
            return next({ name: 'home' });
        }
    }
    next();
});
export default router;
