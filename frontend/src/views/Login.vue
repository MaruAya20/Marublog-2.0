<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const mode = ref<'email' | 'guest'>('email')
const email = ref('')
const code = ref('')
const name = ref('')
const nameForEmail = ref('')
const error = ref('')
const sending = ref(false)
const logging = ref(false)
const codeSent = ref(false)
const countdown = ref(0)

async function handleSendCode() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = '请输入有效邮箱'
    return
  }
  sending.value = true
  try {
    await auth.sendCode(email.value)
    codeSent.value = true
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    sending.value = false
  }
}

async function handleEmailLogin() {
  error.value = ''
  if (!email.value || !code.value) { error.value = '请填邮箱和验证码'; return }
  logging.value = true
  try {
    const data = await auth.loginWithCode(email.value, code.value, nameForEmail.value || undefined)
    if (data.user?.role === 'GUEST') {
      router.push(`/user/${encodeURIComponent(data.user?.name || '')}`)
    } else {
      router.push(`/user/${encodeURIComponent(data.user?.name || '')}`)
    }
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    logging.value = false
  }
}

async function handleGuestLogin() {
  error.value = ''
  if (!name.value.trim()) { error.value = '请填昵称'; return }
  logging.value = true
  try {
    const data = await auth.guestLogin(name.value.trim())
    router.push(`/user/${encodeURIComponent(data.user?.name || '')}`)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    logging.value = false
  }
}
</script>

<template>
  <div class="card" style="max-width: 400px; margin: 40px auto;">
    <h2 class="page-title" style="text-align: center;">登录 MaruBlog</h2>

    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
      <button
        class="btn-primary"
        :style="{ background: mode === 'email' ? 'var(--primary)' : '#eee', color: mode === 'email' ? '#fff' : '#666' }"
        @click="mode = 'email'"
      >邮箱登录</button>
      <button
        class="btn-primary"
        :style="{ background: mode === 'guest' ? 'var(--primary)' : '#eee', color: mode === 'guest' ? '#fff' : '#666' }"
        @click="mode = 'guest'"
      >游客登录</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <template v-if="mode === 'email'">
      <div class="form-row">
        <label>邮箱</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form-row" v-if="codeSent">
        <label>昵称（可选，首次登录时填写）</label>
        <input v-model="nameForEmail" placeholder="你的昵称" maxlength="16" />
      </div>
      <div class="form-row" v-if="codeSent">
        <label>验证码</label>
        <input v-model="code" placeholder="6位验证码" maxlength="6" />
      </div>

      <template v-if="!codeSent">
        <button class="btn-primary" style="width: 100%;" :disabled="sending" @click="handleSendCode">
          {{ sending ? '发送中...' : '发送验证码' }}
        </button>
      </template>
      <template v-else>
        <div style="display: flex; gap: 8px;">
          <button class="btn-ghost" style="flex: 1;" :disabled="countdown > 0 || sending" @click="handleSendCode">
            {{ countdown > 0 ? `${countdown}s` : '重发' }}
          </button>
          <button class="btn-primary" style="flex: 2;" :disabled="logging" @click="handleEmailLogin">
            {{ logging ? '登录中...' : '登录' }}
          </button>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="form-row">
        <label>昵称</label>
        <input v-model="name" placeholder="随便起个名字吧" maxlength="16" />
      </div>
      <button class="btn-primary" style="width: 100%;" :disabled="logging" @click="handleGuestLogin">
        {{ logging ? '进入中...' : '以游客身份进入' }}
      </button>
    </template>
  </div>
</template>