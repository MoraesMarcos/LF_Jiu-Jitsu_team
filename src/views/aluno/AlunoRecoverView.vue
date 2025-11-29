<template>
  <main class="recover-shell">
    <div class="recover-card">

      <RouterLink to="/login-aluno" class="back-link">← Voltar para Login</RouterLink>

      <h1 class="title">Recuperar Acesso</h1>
      <p class="muted">
        Informe seu usuário (ex: <strong>lf.nome</strong>). Vamos simular o envio de uma nova senha.
      </p>

      <form @submit.prevent="enviar">
        <label class="form-label">
          Usuário do Aluno
          <input
            type="text"
            v-model.trim="username"
            placeholder="lf.seu.nome"
            class="input-base"
            required
          />
        </label>

        <button class="btn-primary btn-block" type="submit">
          Recuperar Senha
        </button>

        <div v-if="feedback.msg" :class="['feedback-box', feedback.type]">
          {{ feedback.msg }}
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'

const username = ref('')
const feedback = reactive({ type: '', msg: '' })

function enviar() {
  feedback.msg = ''

  if (!username.value.startsWith('lf.')) {
    feedback.type = 'error'
    feedback.msg = 'O usuário deve começar com "lf."'
    return
  }

  const result = alunosStore.recoverPassword(username.value)

  if (result.ok) {
    feedback.type = 'success'
    feedback.msg = `✅ Sucesso! (Simulação: sua nova senha temporária é "${result.tempPass}". Use-a para logar.)`
  } else {
    feedback.type = 'error'
    feedback.msg = 'Usuário não encontrado em nossa base.'
  }
}
</script>

<style scoped>
.recover-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b1120;
  padding: 20px;
}

.recover-card {
  background: #0f172a;
  padding: 32px;
  border-radius: 14px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.9);
  width: 100%;
  max-width: 420px;
  color: #e2e8f0;
}

.title {
  margin: 12px 0 4px;
  font-size: 24px;
}

.muted {
  color: #94a3b8;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
}

.form-label {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 14px;
}

.input-base {
  width: 100%;
  height: 42px;
  border: 1px solid #1f2937;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  background: #020617;
  color: #e2e8f0;
}
.input-base:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, .45);
}

.btn-block {
  width: 100%;
  height: 45px;
  margin-top: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  transition: filter 0.15s, transform 0.1s, box-shadow 0.1s;
}
.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(56, 189, 248, .35);
}

.back-link {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 10px;
}
.back-link:hover {
  color: #60a5fa;
}

.feedback-box {
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
}
.feedback-box.success {
  background: #022c22;
  color: #bbf7d0;
  border: 1px solid #16a34a;
}
.feedback-box.error {
  background: #450a0a;
  color: #fecaca;
  border: 1px solid #b91c1c;
}
</style>
