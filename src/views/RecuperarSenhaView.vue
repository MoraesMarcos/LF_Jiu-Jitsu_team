<template>
  <main class="recover-shell">
    <div class="recover-card">

      <router-link to="/login-aluno" class="back-link">← Voltar para Login</router-link>

      <h1 class="title">Recuperar Acesso</h1>
      <p class="muted">
        Informe seu usuário (ex: <strong>lf.nome</strong>). Vamos simular o envio de uma nova senha.
      </p>

      <form @submit.prevent="enviar">
        <label class="form-label">
          Usuário do Aluno
          <input type="text" v-model.trim="username" placeholder="lf.seu.nome" class="input-base" required />
        </label>

        <button class="btn btn-primary btn-block" type="submit">
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

    feedback.msg = `✅ Sucesso! (Simulação: Sua nova senha temporária é "${result.tempPass}". Use-a para logar.)`
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
  background: #f6f7fb;
  padding: 20px;
}

.recover-card {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, .06);
  width: 100%;
  max-width: 420px;
}

.title {
  margin: 12px 0 4px;
  font-size: 24px;
  color: var(--primary-navy);
}

.muted {
  color: #64748b;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
}

.input-base:focus {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
}

.btn-block {
  width: 100%;
  height: 45px;
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-navy);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--accent-blue);
}

.back-link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 10px;
}

.back-link:hover {
  color: var(--accent-blue);
}

.feedback-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.feedback-box.success {
  background: #dcfce7;
  color: #14532d;
  border: 1px solid #bbf7d0;
}

.feedback-box.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>