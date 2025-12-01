<template>
  <section class="agenda">
    <header class="agenda-head">
      <div class="head-top">
        <h2>Agenda / Check-in</h2>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
      <p class="muted">Escolha o dia e confirme sua presença nas aulas.</p>
    </header>

    <div class="date-strip">
      <button v-for="d in days" :key="d" class="day-pill" :class="{ active: selectedDate === d }"
        @click="selectedDate = d">
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
          <button class="btn" :class="isBooked(s.id) ? 'btn-danger' : 'btn-primary'" @click="toggle(s)">
            {{ isBooked(s.id) ? 'Cancelar' : 'Fazer check-in' }}
          </button>
        </div>
      </article>
    </div>

    <p v-else class="muted center-msg">Nenhuma aula neste dia.</p>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBookings } from '@/composables/useBookings'
import { toggleBookingWithRules } from '@/rules'
import { alunosStore } from '@/store/alunosStore'

const router = useRouter()

const userId = alunosStore.currentUser ? alunosStore.currentUser.id : 'aluno_demo'

const {
  days,
  selectedDate,
  listByDate,
  attendeesCount,
  isBooked,
  replaceSession
} = useBookings(userId)

function handleLogout() {
  alunosStore.logout()
  router.push('/login-aluno')
}

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
.agenda {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.agenda-head {
  margin-bottom: 20px;
}

.head-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.head-top h2 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

/* Botão de Sair */
.btn-logout {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #ef4444;
  color: white;
}

.muted {
  color: #64748b;
  font-size: 14px;
}

.center-msg {
  text-align: center;
  margin-top: 40px;
}

.date-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.day-pill {
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 99px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  transition: all 0.2s;
}

.day-pill:hover {
  border-color: #cbd5e1;
}

.day-pill.active {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
  font-weight: 600;
}

.list {
  display: grid;
  gap: 12px;
}

.card.session {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.info {
  cursor: pointer;
  flex: 1;
}

.time {
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
}

.name {
  color: #334155;
  font-weight: 600;
  margin: 2px 0;
}

.coach {
  color: #64748b;
  font-size: 13px;
}

.right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cap {
  font-weight: 700;
  color: #64748b;
  font-size: 14px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-danger:hover {
  background: #fecaca;
}

@media (max-width: 600px) {
  .card.session {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>