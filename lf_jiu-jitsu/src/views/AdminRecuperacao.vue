<template>
  <main class="auth-shell rec">
    <section class="auth-card">
      <header class="auth-head">
        <h1>Recuperar senha (Admin)</h1>
        <p class="muted">Informe o e-mail do administrador para receber o link.</p>
      </header>

      <div v-if="toast" class="toast" :class="toastType">{{ toast }}</div>

      <form @submit.prevent="enviar">
        <label class="auth-label">
          <span class="label-caption">E-MAIL DO ADMIN</span>
          <input
            v-model.trim="email"
            type="email"
            placeholder="admin@lfjiujitsu.com"
            :class="{ 'is-invalid': touched && !valido }"
            @blur="touched = true"
            autofocus
          />
        
        </label>

        <div class="row mt-16">
          <button class="btn btn-primary">Enviar link</button>
          <RouterLink class="btn" to="/admin">Voltar</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email   = ref('')
const touched = ref(false)
const toast   = ref('')
const toastType = ref('ok')

const valido = computed(() => email.value.toLowerCase() === 'admin@lfjiujitsu.com')

function enviar() {
  touched.value = true
  if (!valido.value) {
    toast.value = 'E-mail inválido para recuperação.'
    toastType.value = 'error'
    setTimeout(() => (toast.value = ''), 2500)
    return
  }

  toast.value = 'Enviamos um link de recuperação para admin@lfjiujitsu.com.'
  toastType.value = 'ok'
  setTimeout(() => {
    toast.value = ''
    router.push('/admin')
  }, 1800)
}
</script>

<style scoped>
.auth-shell{min-height:100vh;display:grid;place-items:center;background:#f6f7fb}
.auth-card{width:min(520px,92vw);background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;box-shadow:0 6px 16px rgba(0,0,0,.04)}
.auth-head h1{margin:0 0 4px}
.auth-head .muted{margin:0 0 16px}
.auth-label{display:grid;gap:6px}
.label-caption{font-size:11px;letter-spacing:.06em;color:#94a3b8;font-weight:700}
input{width:100%;height:40px;border:1px solid #e5e7eb;border-radius:10px;padding:8px 12px;font-size:15px;background:#fff}
input:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.25);outline:none}
.is-invalid{border-color:#ef4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.12)!important}
.error{color:#b91c1c;font-size:12px;margin-top:6px}
.row{display:flex;gap:12px;align-items:center}
.btn{padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;cursor:pointer}
.btn-primary{background:#1d4ed8;color:#fff;border-color:#1d4ed8}
.muted{color:#64748b}
.toast{margin-bottom:10px;padding:10px 12px;border-radius:10px;border:1px solid #a7f3d0;background:#ecfdf5;color:#065f46}
.toast.error{background:#fef2f2;color:#7f1d1d;border-color:#fecaca}
</style>
