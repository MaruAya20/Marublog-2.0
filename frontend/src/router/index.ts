import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/post/:slug',
      name: 'post-detail',
      component: () => import('@/views/PostDetail.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/user/:name',
      name: 'user-profile',
      component: () => import('@/views/Profile.vue'),
    },
    {
      path: '/me',
      name: 'me',
      component: () => import('@/views/Profile.vue'),
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/Tags.vue'),
    },
    {
      path: '/levels',
      name: 'levels',
      component: () => import('@/views/Levels.vue'),
    },
    {
      path: '/new',
      name: 'new-post',
      component: () => import('@/views/PostEditor.vue'),
      meta: { auth: true },
    },
    {
      path: '/edit/:slug',
      name: 'edit-post',
      component: () => import('@/views/PostEditor.vue'),
      meta: { auth: true },
    },
  ],
})

export default router