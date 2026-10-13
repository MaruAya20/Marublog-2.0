<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { siteApi } from '@/api'
import type { SiteSettings } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const site = ref<SiteSettings | null>(null)

onMounted(async () => {
  auth.initFromStorage()
  auth.fetchMe()
  site.value = await siteApi.get().catch(() => null)
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <header class="nav">
      <div class="nav-inner">
        <router-link to="/" class="logo">
          {{ site?.title || 'MaruBlog' }}
        </router-link>
        <nav class="links">
          <router-link to="/">首页</router-link>
          <router-link to="/tags">标签</router-link>
          <router-link to="/levels">等级</router-link>
          <router-link v-if="auth.isLoggedIn" to="/new" class="btn-ghost">✍️ 发文</router-link>
          <template v-if="auth.isLoggedIn">
            <router-link :to="`/user/${encodeURIComponent(auth.user?.name || '')}`">
              {{ auth.user?.name || '我的' }}
            </router-link>
            <button class="btn-ghost" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-primary">登录</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <span>MaruBlog v2 — Spring Boot + Vue 3</span>
    </footer>
  </div>
</template>