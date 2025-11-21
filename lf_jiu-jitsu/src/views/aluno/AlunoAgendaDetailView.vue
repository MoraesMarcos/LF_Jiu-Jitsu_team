<template>
  <section class="detail">
    <button class="link" @click="$router.back()">← Voltar</button>

    <header class="head">
      <h2>{{ session?.name || 'Aula' }}</h2>
      <p class="muted">
        {{ formatDate(session?.start) }} · {{ toHour(session?.start) }}–{{ toHour(session?.end) }} ·
        Instrutor: {{ session?.coach }}
      </p>
    </header>

    <article class="card">
      <div class="row">
        <div><strong>Vagas:</strong> {{ (session?.attendees?.length || 0) }}/{{ session?.capacity }}</div>
        <div class="grow"></div>
        <button
          class="btn"
          :class="isBooked ? 'btn-danger' : 'btn-primary'"
          @click="toggle()"
        >
          {{ isBooked ? 'Cancelar presença' : 'Fazer check-in' }}
        </button>
      </div>

      <h3 class="mt">Lista de presença</h3>
      <ul class="list">
        <li v-for="id in session?.attendees || []" :key="id">
          • {{ userLabel(id) }}
        </li>
        <li v-if="!(session?.attendees || []).length" class="muted">Ainda sem presenças.</li>
      </ul>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookings } from '@/composables/useBookings'
import { toggleBookingWithRules } from '@/rules'

const route = useRoute()
const userId = 'aluno_demo'

const { getById, replaceSession } = useBookings(userId)
const session = computed(() => getById(route.params.id))

const isBooked = computed(() => (session.value?.attendees || []).includes(userId))

function toggle() {
  const updated = { ...session.value }
  const res = toggleBookingWithRules(updated, userId, new Date())
  if (!res.ok) {
    alert(res.message)
    return
  }
  replaceSession(updated)
  alert(res.message)
}

function userLabel(id) {
  // Apenas mock: personalize p/ exibir nome real
  return id === userId ? 'Você' : `Aluno ${id.slice(-3)}`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })
}
function toHour(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.link { background:none; border:none; color:#1d4ed8; cursor:pointer; margin-bottom:8px; }
.head h2 { margin:0; }
.muted { color:#64748b; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
.row { display:flex; align-items:center; gap:12px; }
.grow { flex:1; }
.btn { padding:8px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn-primary { background:#1d4ed8; color:#fff; border-color:#1d4ed8; }
.btn-danger  { background:#fee2e2; color:#991b1b; border-color:#fecaca; }
.mt { margin-top:16px; }
.list { list-style:none; padding-left:0; margin:8px 0 0; }
</style>
