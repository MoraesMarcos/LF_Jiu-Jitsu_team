<template>
  <main class="recover-shell">
    <div class="recover-card">

      <a href="/aluno" class="back-link">← Voltar</a>

      <h1 class="title">Recuperar Senha</h1>
      <p class="muted">
        Informe o seu e-mail para enviarmos as instruções de recuperação.
      </p>

      <form @submit.prevent="enviar" novalidate>
        <label class="form-label">
          E-mail
          <input
            type="email"
            v-model.trim="email"
            placeholder="seuemail@exemplo.com"
            class="input-base"
            :class="{ 'input--invalid': !!erro }"
            @blur="validar"
          />
          <small v-if="erro" class="error">{{ erro }}</small>
        </label>

        <button class="btn btn-primary btn-block" type="submit">
          Enviar instruções
        </button>

        <p v-if="sucesso" class="success">
          ✅ Enviamos as instruções para o seu e-mail!
        </p>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const erro = ref('')
const sucesso = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validar() {
  if (!email.value) {
    erro.value = 'Campo obrigatório.'
    return false
  }
  if (!emailRegex.test(email.value)) {
    erro.value = 'Informe um e-mail válido.'
    return false
  }
  erro.value = ''
  return true
}

function enviar() {
  if (!validar()) return

  // Aqui futuramente você integra com seu backend (ENVIO REAL)
  // Exemplo: await api.post('/recuperar-senha', { email: email.value })

  sucesso.value = true
  setTimeout(() => (sucesso.value = false), 3000)
}
</script>

<style scoped>
.recover-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f6f7fb;
  padding: 20px;
}

.recover-card {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 6px 22px rgba(0,0,0,.06);
  width: 100%;
  max-width: 420px;
}

.title {
  margin: 12px 0 4px;
  font-size: 26px;
}

.muted {
  color: #64748b;
  margin-bottom: 20px;
}

.form-label {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.input-base {
  width: 100%;
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
}
.input-base:focus {
  border-color:#60a5fa;
  box-shadow: 0 0 0 3px rgba(96,165,250,.25);
  outline: none;
}
.input--invalid {
  border-color:#ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important;
}

.error {
  color: #b91c1c;
  font-size: 13px;
}

.success {
  margin-top: 12px;
  color: #14532d;
}

.back-link {
  font-size: 13px;
  color: #1d4ed8;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
  height: 42px;
}

.btn-primary {
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #1e40af;
}
</style>
