import { createRouter, createWebHistory } from 'vue-router'

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
    }
  ]
})

export default router