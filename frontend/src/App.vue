<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const auth = useAuthStore()

onMounted(async () => {
  auth.initFromStorage()
  auth.fetchMe()
})
</script>

<template>
  <div class="app">
    <Navbar />

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