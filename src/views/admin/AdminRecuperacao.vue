<!-- src/views/admin/AdminRecoverView.vue -->
<template>
  <main class="recover-shell" aria-labelledby="recover-title">
    <section class="recover-card">
      <RouterLink to="/admin/login" class="back-link">
        ← Voltar para login
      </RouterLink>

      <h1 id="recover-title" class="title">Recuperar acesso (Admin)</h1>
      <p class="muted">
        Informe o e-mail cadastrado do administrador. Vamos simular o envio de um link de recuperação.
      </p>

      <form @submit.prevent="enviar" novalidate>
        <label class="form-label" for="admin-rec-email">
          E-mail do administrador
          <input
            id="admin-rec-email"
            type="email"
            v-model.trim="email"
            placeholder="admin@lf.com"
            class="input-base"
            required
            autocomplete="email"
          />
        </label>

        <button class="btn btn-primary btn-block" type="submit">
          Enviar link de recuperação
        </button>

        <div
          v-if="feedback.msg"
          :class="['feedback-box', feedback.type]"
          role="status"
          aria-live="polite"
        >
          {{ feedback.msg }}
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const feedback = reactive({ type: '', msg: '' })

function enviar () {
  feedback.msg = ''

  if (email.value.toLowerCase() !== 'admin@lf.com') {
    feedback.type = 'error'
    feedback.msg = 'Não encontramos esse e-mail cadastrado como administrador.'
    return
  }

  feedback.type = 'success'
  feedback.msg = 'Simulação: enviamos um link de recuperação para admin@lf.com.'
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
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.16);
  width: 100%;
  max-width: 460px;
}

.title {
  margin: 12px 0 4px;
  font-size: 24px;
  color: #0f172a;
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
}

.input-base:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

.btn-block {
  width: 100%;
  height: 44px;
  margin-top: 10px;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.back-link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 10px;
}

.back-link:hover {
  color: #2563eb;
}

.feedback-box {
  margin-top: 20px;
  padding: 14px 12px;
  border-radius: 8px;
  font-size: 14px;
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
