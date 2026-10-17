<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import NotificationBell from './NotificationBell.vue'

const router = useRouter()
const auth = useAuthStore()
const notif = useNotificationStore()
const avatarMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

onMounted(() => {
  auth.initFromStorage()
  auth.fetchMe()
  if (auth.isLoggedIn) {
    notif.startPolling()
  }
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
  avatarMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push('/')
}

function goProfile() {
  avatarMenuOpen.value = false
  mobileMenuOpen.value = false
  const name = auth.user?.name
  if (name) {
    router.push(`/user/${encodeURIComponent(name)}`)
  } else {
    router.push('/')
  }
}

function closeMobile() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="brand" @click="closeMobile">
        <img src="/favicon.png" alt="logo" class="brand-icon" />
        <span class="brand-text">MaruBlog</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-link" active-class="active">发现</router-link>
        <router-link v-if="auth.isLoggedIn && auth.user?.name"
                     :to="`/user/${encodeURIComponent(auth.user.name)}`"
                     class="nav-link" active-class="active">首页</router-link>
        <router-link v-else to="/login" class="nav-link">首页</router-link>
        <router-link to="/tags" class="nav-link" active-class="active">标签</router-link>
        <router-link v-if="auth.isLoggedIn" to="/new" class="nav-link write-btn">✍️ 发文</router-link>
        <router-link v-if="auth.isLoggedIn" to="/messages" class="nav-link" active-class="active">📬 信箱</router-link>
        <router-link v-if="auth.isLoggedIn" to="/drafts" class="nav-link" active-class="active">📝 草稿</router-link>

        <template v-if="auth.isLoggedIn">
          <NotificationBell />
          <div class="avatar-wrapper" @click.stop="avatarMenuOpen = !avatarMenuOpen">
            <button class="avatar-btn" :class="{ 'menu-open': avatarMenuOpen }" aria-haspopup="menu">
              <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="avatar" class="avatar-img" />
              <span v-else class="avatar-initial">{{ initial }}</span>
            </button>
            <div v-if="avatarMenuOpen" class="avatar-menu" role="menu">
              <button class="menu-item" @click="goProfile">👤 个人主页</button>
              <button class="menu-item" @click="avatarMenuOpen = false; router.push('/settings')">⚙️ 设置</button>
              <button class="menu-item" @click="avatarMenuOpen = false; router.push('/levels')">🏆 等级体系</button>
              <button class="menu-item danger" @click="handleLogout">🚪 退出登录</button>
            </div>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link login-btn">登录</router-link>
        </template>
      </nav>

      <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" :class="{ open: mobileMenuOpen }" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobile"></div>
    <nav v-if="mobileMenuOpen" class="mobile-menu">
      <button class="mobile-close" @click="closeMobile" aria-label="关闭菜单">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <template v-if="auth.isLoggedIn">
        <div class="mobile-profile">
          <img v-if="auth.user?.avatar" :src="auth.user.avatar" class="mobile-avatar" />
          <span v-else class="mobile-avatar-initial">{{ initial }}</span>
          <div class="mobile-profile-info">
            <div class="mobile-name">{{ auth.user?.name }}</div>
            <div class="mobile-email">{{ auth.user?.email }}</div>
          </div>
        </div>
      </template>
      <router-link to="/" class="mobile-link" active-class="active" @click="closeMobile">🏠 发现</router-link>
      <router-link v-if="auth.isLoggedIn && auth.user?.name"
                   :to="`/user/${encodeURIComponent(auth.user.name)}`"
                   class="mobile-link" active-class="active" @click="closeMobile">👤 我的主页</router-link>
      <router-link to="/tags" class="mobile-link" active-class="active" @click="closeMobile">🏷️ 标签</router-link>
      <router-link v-if="auth.isLoggedIn" to="/new" class="mobile-link write-btn" @click="closeMobile">✍️ 写文章</router-link>
      <router-link v-if="auth.isLoggedIn" to="/messages" class="mobile-link" active-class="active" @click="closeMobile">📬 信箱</router-link>
      <router-link v-if="auth.isLoggedIn" to="/drafts" class="mobile-link" active-class="active" @click="closeMobile">📝 草稿箱</router-link>
      <router-link v-if="auth.isLoggedIn" to="/settings" class="mobile-link" active-class="active" @click="closeMobile">⚙️ 设置</router-link>
      <router-link v-if="auth.isLoggedIn" to="/levels" class="mobile-link" active-class="active" @click="closeMobile">🏆 等级</router-link>
      <template v-if="auth.isLoggedIn">
        <button class="mobile-link danger" @click="handleLogout">🚪 退出登录</button>
      </template>
      <template v-else>
        <router-link to="/login" class="mobile-link login-btn" @click="closeMobile">登录 / 注册</router-link>
      </template>
    </nav>
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
.nav-link:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.nav-link.active {
  background: var(--hover, rgba(0,0,0,0.05));
  color: var(--brand, #5f4dbf);
}
.write-btn { color: var(--brand, #5f4dbf); font-weight: 600; }
.login-btn { background: var(--brand, #5f4dbf); color: #fff; }
.login-btn:hover { background: var(--brand-hover, #4a3da8); color: #fff; }

.avatar-wrapper { position: relative; }
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
.avatar-btn.menu-open { border-color: var(--brand, #5f4dbf); }
.avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-initial { font-weight: 700; font-size: 14px; color: var(--text, #374151); line-height: 32px; }

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
.menu-item:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.menu-item.danger { color: #dc2626; }
.menu-item.danger:hover { background: rgba(220,38,38,0.08); }

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  gap: 5px;
  border-radius: 8px;
  transition: background 0.15s;
}
.hamburger:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text, #374151);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 149;
}
.mobile-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-color, #333);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  z-index: 2;
}
.mobile-close:hover { background: var(--hover, rgba(0,0,0,0.06)); }

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100dvh;
  width: 280px;
  max-width: 85vw;
  background: var(--card-bg, #fff);
  border-left: 1px solid var(--border, #e5e7eb);
  z-index: 150;
  padding: calc(56px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: -4px 0 16px rgba(0,0,0,0.08);
  animation: slideIn 0.2s ease-out;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.mobile-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 20px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  margin-bottom: 12px;
}
.mobile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand, #5f4dbf);
}
.mobile-avatar-initial {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(95,77,191,0.25), rgba(159,122,234,0.25));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: var(--text, #374151);
  border: 2px solid var(--brand, #5f4dbf);
}
.mobile-profile-info { flex: 1; min-width: 0; }
.mobile-name { font-weight: 600; font-size: 15px; color: var(--text, #374151); }
.mobile-email { font-size: 12px; color: var(--text-secondary, #6b7280); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.mobile-link {
  padding: 12px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text, #374151);
  font-size: 15px;
  font-weight: 500;
  transition: background 0.15s;
  cursor: pointer;
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
}
.mobile-link:hover { background: var(--hover, rgba(0,0,0,0.05)); }
.mobile-link.active { background: var(--hover, rgba(0,0,0,0.05)); color: var(--brand, #5f4dbf); }
.mobile-link.write-btn { color: var(--brand, #5f4dbf); font-weight: 600; }
.mobile-link.danger { color: #dc2626; }
.mobile-link.danger:hover { background: rgba(220,38,38,0.08); }
.mobile-link.login-btn { background: var(--brand, #5f4dbf); color: #fff; text-align: center; margin-top: 8px; }
.mobile-link.login-btn:hover { background: var(--brand-hover, #4a3da8); }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
}
</style>