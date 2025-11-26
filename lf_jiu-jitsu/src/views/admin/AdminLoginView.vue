<!-- src/views/admin/AdminLoginView.vue -->
<template>
  <main class="login-shell" aria-labelledby="admin-title">
    <section class="login-card" role="form">
      <h1 id="admin-title">Acesso Administrativo</h1>
      <p class="muted">Área restrita para instrutores e gestão.</p>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="input-group">
          <label for="admin-email">E-mail</label>
          <input
            id="admin-email"
            v-model="email"
            type="email"
            placeholder="admin@lf.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="input-group">
          <label for="admin-pass">Senha</label>
          <input
            id="admin-pass"
            v-model="password"
            type="password"
            placeholder="admin123"
            required
            autocomplete="current-password"
          />
          <div class="forgot-wrap">
            <RouterLink to="/admin/recuperar-senha" class="forgot-link">
              Esqueci minha senha
            </RouterLink>
          </div>
        </div>

        <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

        <button type="submit" class="btn-primary" aria-label="Entrar no painel administrativo">
          Entrar no Painel
        </button>
      </form>

      <RouterLink to="/" class="back-link">Voltar ao site</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { authStore } from '@/store/authStore'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function handleLogin () {
  if (authStore.login(email.value, password.value)) {
    router.push('/admin')
  } else {
    error.value = 'Credenciais inválidas.'
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: #f1f5f9;
  padding: 16px;
}

.login-card {
  background: #ffffff;
  padding: 40px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
  width: 100%;
  max-width: 420px;
}

h1 {
  font-size: 26px;
  color: #0f172a;
  margin-bottom: 4px;
}

.muted {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 14px;
}

.input-group {
  text-align: left;
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #0f172a;
}

.input-group input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
}

.input-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  outline: none;
}

.forgot-wrap {
  text-align: right;
  margin-top: 6px;
}

.forgot-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 13px;
  margin-top: 10px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.error-msg {
  color: #b91c1c;
  background: #fee2e2;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  margin-bottom: 6px;
}

.back-link {
  display: block;
  margin-top: 18px;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.back-link:hover {
  color: #2563eb;
}
</style>
