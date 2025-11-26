<template>
  <main class="login-shell">
    <section class="login-card" aria-labelledby="aluno-login-title">
      <div class="brand">
        <p class="brand-sub">LF JIU-JITSU TEAM</p>
        <h1 id="aluno-login-title">Área do Aluno</h1>
      </div>

      <form @submit.prevent="handleLogin" novalidate aria-describedby="error-msg">
        <div class="input-group">
          <label for="username">Usuário</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Ex: lf.joaosilva"
            autocomplete="username"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••"
            autocomplete="current-password"
            required
          />
          <div class="forgot-wrap">
            <RouterLink to="/recuperar-senha" class="forgot-link">
              Esqueci minha senha
            </RouterLink>
          </div>
        </div>

        <p
          v-if="error"
          id="error-msg"
          class="error-msg"
          role="alert"
        >
          {{ error }}
        </p>

        <button type="submit" class="btn-primary">
          Entrar
        </button>
      </form>

      <RouterLink to="/" class="back-link">
        Voltar ao site
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''
  const ok = alunosStore.login(username.value, password.value)
  if (ok) {
    router.push('/aluno')
  } else {
    error.value = 'Usuário ou senha incorretos.'
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #1d4ed8 0, #020617 45%);
  padding: 16px;
}

.login-card {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  width: min(420px, 100%);
  padding: 32px 26px 26px;
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.7);
  color: #e5e7eb;
}

.brand-sub {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 10px;
  color: #60a5fa;
  margin: 0 0 4px;
}

h1 {
  font-size: 24px;
  margin: 0 0 24px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid #1f2933;
  background: #020617;
  color: #e5e7eb;
  font-size: 15px;
}

.input-group input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.6);
}

.forgot-wrap {
  text-align: right;
  margin-top: 6px;
}

.forgot-link {
  font-size: 12px;
  color: #93c5fd;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.error-msg {
  margin: 8px 0 8px;
  font-size: 13px;
  color: #fecaca;
  background: rgba(127, 29, 29, 0.45);
  padding: 8px 10px;
  border-radius: 8px;
}

.btn-primary {
  width: 100%;
  padding: 13px;
  margin-top: 4px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  background: linear-gradient(90deg, #2563eb, #22c55e);
  color: #ffffff;
  cursor: pointer;
}

.btn-primary:hover {
  filter: brightness(1.08);
}

.back-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
}
.back-link:hover {
  color: #e5e7eb;
}
</style>
