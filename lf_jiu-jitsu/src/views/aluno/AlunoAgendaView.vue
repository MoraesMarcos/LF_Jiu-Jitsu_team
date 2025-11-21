<!-- src/views/aluno/AlunoAgendaView.vue -->
<template>
  <section class="agenda">
    <header class="agenda-head">
      <h2>Agenda / Check-in</h2>
      <p class="muted">Escolha o dia e confirme sua presença nas aulas.</p>
    </header>

    <div class="date-strip">
      <button
        v-for="d in days"
        :key="d"
        class="day-pill"
        :class="{ active: selectedDate === d }"
        @click="selectedDate = d"
      >
        {{ formatDate(d) }}
      </button>
    </div>

    <div v-if="listByDate.length" class="list">
      <article v-for="s in listByDate" :key="s.id" class="card session">
        <div class="info" @click="openDetail(s.id)" title="Ver detalhes">
          <div class="time">{{ toHour(s.start) }}–{{ toHour(s.end) }}</div>
          <div class="name">{{ s.name }}</div>
          <div class="coach">Instrutor: {{ s.coach }}</div>
        </div>

        <div class="right">
          <div class="cap">{{ attendeesCount(s.id) }}/{{ s.capacity }}</div>
          <button
            class="btn"
            :class="isBooked(s.id) ? 'btn-danger' : 'btn-primary'"
            @click="toggle(s)"
          >
            {{ isBooked(s.id) ? 'Cancelar' : 'Fazer check-in' }}
          </button>
        </div>
      </article>
    </div>

    <p v-else class="muted">Nenhuma aula neste dia.</p>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBookings } from '@/composables/useBookings'
import { toggleBookingWithRules } from '@/rules'

const router = useRouter()
const userId = 'aluno_demo' // troque pelo ID real após autenticar

// Pegamos selectedDate diretamente do composable (sem redeclarar)
const {
  days,            // Array<string> YYYY-MM-DD
  selectedDate,    // ref<string> — usado direto no template (unwrapped)
  listByDate,      // computed<Session[]>
  attendeesCount,  // (id) => number
  isBooked,        // (id) => boolean
  replaceSession   // (sessionAtualizada) => void (persiste no localStorage)
} = useBookings(userId)

function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}
function toHour(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function openDetail(id) {
  router.push({ name: 'area-aluno-agenda-detalhe', params: { id } })
}
function toggle(session) {
  const updated = { ...session }
  const res = toggleBookingWithRules(updated, userId, new Date())
  if (!res.ok) {
    alert(res.message)
    return
  }
  replaceSession(updated)
  alert(res.message)
}
</script>

<style scoped>
.agenda-head { margin-bottom: 16px; }
.date-strip { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.day-pill {
  padding:8px 12px; border:1px solid #e5e7eb; border-radius:999px; background:#fff; cursor:pointer;
}
.day-pill.active { background:#eef2ff; color:#1d4ed8; border-color:#bfd3ff; }

.list { display:grid; gap:12px; }
.card.session { display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
.info { cursor:pointer; }
.time { font-weight:700; }
.name { color:#0f172a; }
.coach { color:#64748b; font-size:14px; }

.right { display:flex; align-items:center; gap:12px; }
.cap { font-weight:700; color:#334155; }
.btn { padding:8px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn-primary { background:#1d4ed8; color:#fff; border-color:#1d4ed8; }
.btn-danger  { background:#fee2e2; color:#991b1b; border-color:#fecaca; }
.muted { color:#64748b; }
</style>
