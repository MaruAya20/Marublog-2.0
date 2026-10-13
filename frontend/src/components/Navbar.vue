<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)

onMounted(() => {
  auth.initFromStorage()
  auth.fetchMe()
})

const initial = computed(() => {
  const name = auth.user?.name
  if (name && name.length > 0) return name[0].toUpperCase()
  const email = auth.user?.email
  if (email && email.length > 0) return email[0].toUpperCase()
  return '?'
})

function handleLogout() {
  auth.logout()
  menuOpen.value = false
  router.push('/')
}

function goProfile() {
  menuOpen.value = false
  router.push('/me')
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="brand">
        <img src="/favicon.png" alt="logo" class="brand-icon" />
        <span class="brand-text">MaruBlog</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/tags" class="nav-link" active-class="active">标签</router-link>
        <router-link to="/levels" class="nav-link" active-class="active">等级</router-link>
        <router-link v-if="auth.isLoggedIn" to="/new" class="nav-link write-btn">✍️ 发文</router-link>

        <template v-if="auth.isLoggedIn">
          <div class="avatar-wrapper" @click.stop="menuOpen = !menuOpen">
            <button class="avatar-btn" :class="{ 'menu-open': menuOpen }" aria-haspopup="menu">
              <img v-if="auth.user?.avatar?.startsWith('/') || auth.user?.avatar?.startsWith('http')"
                   :src="auth.user.avatar" alt="avatar" class="avatar-img" />
              <img v-else-if="auth.user?.avatar"
                   :src="auth.user.avatar" alt="avatar" class="avatar-img" />
              <span v-else class="avatar-initial">{{ initial }}</span>
            </button>
            <div v-if="menuOpen" class="avatar-menu" role="menu">
              <button class="menu-item" @click="goProfile">
                👤 个人主页
              </button>
              <button class="menu-item danger" @click="handleLogout">
                🚪 退出登录
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link login-btn">登录</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--card-bg, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  backdrop-filter: blur(8px);
}
.topbar-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
  font-weight: 600;
}
.brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
}
.brand-text {
  font-size: 16px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text, #374151);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
  cursor: pointer;
  border: none;
  background: transparent;
}
.nav-link:hover {
  background: var(--hover, rgba(0,0,0,0.05));
}
.nav-link.active {
  background: var(--hover, rgba(0,0,0,0.05));
  color: var(--brand, #5f4dbf);
}
.write-btn {
  color: var(--brand, #5f4dbf);
  font-weight: 600;
}
.login-btn {
  background: var(--brand, #5f4dbf);
  color: #fff;
}
.login-btn:hover {
  background: var(--brand-hover, #4a3da8);
  color: #fff;
}
.avatar-wrapper {
  position: relative;
}
.avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--brand, #5f4dbf);
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(95,77,191,0.25), rgba(159,122,234,0.25));
  transition: border-color 0.15s;
}
.avatar-btn:hover {
  border-color: var(--brand, #5f4dbf);
}
.avatar-btn.menu-open {
  border-color: var(--brand, #5f4dbf);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-initial {
  font-weight: 700;
  font-size: 14px;
  color: var(--text, #374151);
  line-height: 32px;
}
.avatar-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: var(--card-bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  padding: 4px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 200;
  animation: fadeIn 0.12s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.menu-item {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text, #374151);
  transition: background 0.1s;
}
.menu-item:hover {
  background: var(--hover, rgba(0,0,0,0.05));
}
.menu-item.danger {
  color: #dc2626;
}
.menu-item.danger:hover {
  background: rgba(220,38,38,0.08);
}
</style>