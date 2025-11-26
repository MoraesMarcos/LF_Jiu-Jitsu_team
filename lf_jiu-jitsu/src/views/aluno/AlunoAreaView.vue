<template>
  <main class="aluno-shell">
    <section v-if="!currentUser" class="not-auth">
      <p>Você precisa entrar na Área do Aluno.</p>
      <RouterLink to="/login-aluno" class="btn btn-primary">Ir para login</RouterLink>
    </section>

    <section v-else class="aluno-container">
      <header class="aluno-head">
        <div>
          <h1>Área do Aluno</h1>
          <p class="muted">
            Olá, {{ currentUser.name }}. Acompanhe seu progresso, próximas aulas e pagamentos.
          </p>
        </div>
        <button class="btn-ghost" @click="logout">
          Sair
        </button>
      </header>

      <nav class="tabs" aria-label="Seções da Área do Aluno">
        <button class="tab" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          Dashboard
        </button>
        <button class="tab" :class="{ active: activeTab === 'agenda' }" @click="activeTab = 'agenda'">
          Agenda / Check-in
        </button>
      </nav>

      <section v-if="activeTab === 'dashboard'" class="dashboard" aria-label="Resumo do aluno">
        <div class="grid-3">
          <article class="card highlight" aria-label="Resumo de plano e faixa do aluno">
            <div class="profile">
              <div class="avatar" :title="currentUser.name">{{ iniciais }}</div>
              <div>
                <h2>{{ currentUser.name }}</h2>
                <p class="muted">
                  Faixa: {{ currentUser.belt || 'Branca' }} · Plano: {{ currentUser.plan || 'Mensal' }} ·
                  Perfil: {{ currentUser.profile || 'Adulto / Misto' }}
                </p>
              </div>
            </div>
            <ul class="stats">
              <li>
                <span>Aulas no mês</span>
                <strong>{{ stats.aulasMes }}</strong>
              </li>
              <li>
                <span>Presenças no ano</span>
                <strong>{{ stats.presencasAno }}</strong>
              </li>
              <li>
                <span>Vencimento</span>
                <strong :class="{ danger: stats.planoVencido }">{{ stats.vencimento }}</strong>
              </li>
            </ul>
          </article>

          <article class="card" aria-label="Próximas aulas">
            <h3>Próximas aulas</h3>
            <ul class="list">
              <li v-for="(aula, i) in proximasAulas" :key="i" class="list-item">
                <div>
                  <strong>{{ aula.dia }} · {{ aula.hora }}</strong>
                  <p class="muted">{{ aula.modalidade }} — Instrutor: {{ aula.prof }}</p>
                </div>
                <span class="badge" :class="{ ok: aula.confirmado }">
                  {{ aula.confirmado ? 'Confirmado' : 'A confirmar' }}
                </span>
              </li>
            </ul>
          </article>

          <article class="card" aria-label="Pagamentos recentes">
            <h3>Pagamentos</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in pagamentos" :key="i">
                  <td>{{ p.mes }}</td>
                  <td>R$ {{ p.valor.toFixed(2) }}</td>
                  <td>
                    <span class="badge" :class="{ ok: p.status === 'Pago', warn: p.status === 'Pendente' }">
                      {{ p.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>

        <article class="card" aria-label="Atualizar dados do aluno">
          <h3>Atualizar dados</h3>
          <form class="form" @submit.prevent="salvarPerfil" novalidate>
            <div class="grid-3">
              <label>
                Nome completo
                <input v-model.trim="perfil.nome" type="text" required />
              </label>
              <label>
                WhatsApp
                <input v-model.trim="perfil.telefone" type="tel" placeholder="(00) 90000-0000" />
              </label>
              <label>
                E-mail
                <input v-model.trim="perfil.email" type="email" required />
              </label>
            </div>

            <div class="grid-2">
              <label>
                Objetivo no Jiu-Jitsu
                <select v-model="perfil.objetivo">
                  <option value="saude">Saúde e condicionamento</option>
                  <option value="defesa">Defesa pessoal</option>
                  <option value="competicao">Competição</option>
                  <option value="recreativo">Recreativo</option>
                </select>
              </label>
              <label class="row" style="gap: 8px">
                <input type="checkbox" v-model="perfil.whatsapp" />
                Receber lembretes por WhatsApp
              </label>
            </div>

            <div class="row">
              <button class="btn btn-primary" type="submit">Salvar alterações</button>
              <button class="btn" type="button" @click="resetarPerfil">Cancelar</button>
            </div>

            <p v-if="salvo" class="ok-msg" role="status">Dados atualizados com sucesso.</p>
          </form>
        </article>
      </section>

      <section v-else class="agenda" aria-label="Agenda de aulas para check-in">
        <header class="agenda-head">
          <h2>Agenda / Check-in</h2>
          <p class="muted">
            Escolha o dia e confirme sua presença nas aulas. O sistema mostra apenas turmas do seu
            perfil: <strong>{{ currentUser.profile || 'Adulto / Misto' }}</strong>.
          </p>
        </header>

        <div class="date-strip" role="tablist" aria-label="Dias disponíveis">
          <button v-for="d in days" :key="d" class="day-pill" :class="{ active: selectedDate === d }"
            @click="selectedDate = d" role="tab" :aria-selected="selectedDate === d">
            {{ formatDate(d) }}
          </button>
        </div>

        <div v-if="listByDate.length" class="list">
          <article v-for="s in listByDate" :key="s.id" class="card session">
            <div class="info">
              <div class="time">{{ toHour(s.start) }}–{{ toHour(s.end) }}</div>
              <div class="name">{{ s.name }}</div>
              <div class="coach">Instrutor: {{ s.coach }}</div>
            </div>

            <div class="right">
              <button class="btn-text" @click="abrirListaPresenca(s.id, s.name)">
                Ver lista ({{ attendeesCount(s.id) }}/{{ s.capacity }})
              </button>

              <button class="btn" :class="isBooked(s.id) ? 'btn-checked' : 'btn-primary'" @click="toggle(s)">
                {{ isBooked(s.id) ? 'Check-in realizado' : 'Fazer check-in' }}
              </button>
            </div>
          </article>
        </div>

        <p v-else class="muted center-msg">Nenhuma aula neste dia para o seu perfil.</p>
      </section>
    </section>

    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-card">
        <header class="modal-header">
          <h3>Lista de Presença</h3>
          <p>{{ modalTitulo }}</p>
          <button class="icon-close" @click="fecharModal">×</button>
        </header>
        <div class="modal-body">
          <ul v-if="listaAtual.length > 0" class="presenca-list">
            <li v-for="aluno in listaAtual" :key="aluno.id">
              <span class="dot"></span> {{ aluno.name }} ({{ aluno.belt }})
            </li>
          </ul>
          <p v-else class="muted">Nenhum aluno confirmado ainda.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'
import { checkinStore } from '@/store/checkinStore'
import { useBookings } from '@/composables/useBookings'
import { toggleBookingWithRules } from '@/rules'

const router = useRouter()
const currentUser = computed(() => alunosStore.currentUser)

onMounted(() => {
  if (!currentUser.value) {
    router.replace('/login-aluno')
  }
})

watch(currentUser, (val) => {
  if (!val) {
    router.replace('/login-aluno')
  }
})

const activeTab = ref('dashboard')

const iniciais = computed(() =>
  currentUser.value?.name
    ? currentUser.value.name
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'LF'
)

const stats = ref({
  aulasMes: 8,
  presencasAno: 42,
  vencimento: '10/12/2025',
  planoVencido: false
})

const proximasAulas = ref([
  { dia: 'Hoje', hora: '19:30', modalidade: 'Jiu-Jitsu Adulto – Noite', prof: 'Mestre Silva', confirmado: true },
  { dia: 'Qua', hora: '16:00', modalidade: 'Turma Feminina', prof: 'Instrutora Ana', confirmado: false },
  { dia: 'Sex', hora: '11:00', modalidade: 'Aula Especial Fundamentos', prof: 'Professor João', confirmado: false }
])

const pagamentos = ref([
  { mes: 'Out/2025', valor: 70, status: 'Pago' },
  { mes: 'Nov/2025', valor: 70, status: 'Pago' },
  { mes: 'Dez/2025', valor: 70, status: 'Pendente' }
])

const perfil = ref({
  nome: '',
  telefone: '',
  email: '',
  objetivo: 'saude',
  whatsapp: true
})
const salvo = ref(false)

onMounted(() => {
  if (currentUser.value) {
    perfil.value.nome = currentUser.value.name
    perfil.value.email = currentUser.value.email || 'aluno@lfjiujitsu.com'
  }
})

function salvarPerfil() {
  if (!perfil.value.nome || !perfil.value.email) return
  salvo.value = true
  setTimeout(() => {
    salvo.value = false
  }, 2000)
}

function resetarPerfil() {
  if (currentUser.value) {
    perfil.value = {
      nome: currentUser.value.name,
      telefone: '',
      email: currentUser.value.email || 'aluno@lfjiujitsu.com',
      objetivo: 'saude',
      whatsapp: true
    }
  }
}

function logout() {
  alunosStore.logout()
}

const userId = computed(() => currentUser.value?.id || 'aluno_demo')
const userProfile = computed(() => currentUser.value?.profile || 'adulto')

const {
  days,
  selectedDate,
  listByDate,
  attendeesCount,
  isBooked,
  replaceSession
} = useBookings(userId, userProfile)

function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  })
}

function toHour(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function toggle(session) {
  const updated = { ...session }
  const res = toggleBookingWithRules(updated, userId.value, new Date())
  if (!res.ok) {
    alert(res.message)
    return
  }
  replaceSession(updated)
}

const modalAberto = ref(false)
const modalTitulo = ref('')
const listaAtual = ref([])

function abrirListaPresenca(sessionId, sessionName) {
  modalTitulo.value = sessionName
  listaAtual.value = checkinStore.listaPresenca(sessionId)
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  listaAtual.value = []
}
</script>

<style scoped>
.aluno-shell {
  padding: 32px 0 64px;
  background: #f8fafc;
}

.aluno-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

.not-auth {
  min-height: 60vh;
  display: grid;
  place-items: center;
}

.aluno-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.aluno-head h1 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
}

.muted {
  color: #64748b;
  font-size: 14px;
}

.tabs {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: #e5e7eb;
  margin-bottom: 20px;
}

.tab {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.tab.active {
  background: #ffffff;
  color: #1d4ed8;
}

.grid-3 {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1.1fr);
  margin-bottom: 20px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04);
}

.highlight {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 40%, #020617 100%);
  color: #e5e7eb;
}

.profile {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 20px;
}

.highlight .muted {
  color: #cbd5f5;
}

.stats {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.4);
}

.stats li {
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
  font-size: 13px;
}

.stats strong {
  font-size: 18px;
}

.danger {
  color: #fee2e2;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 13px;
}

.table th,
.table td {
  padding: 6px 4px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}

.agenda-head {
  margin-bottom: 14px;
}

.date-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.day-pill {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.day-pill.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
}

.card.session {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info .time {
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
}

.info .name {
  font-weight: 600;
  color: #334155;
  margin-top: 2px;
}

.info .coach {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.btn-checked {
  background: #22c55e;
  border-color: #16a34a;
  color: #ffffff;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #0f172a;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.btn-ghost:hover {
  background: #fee2e2;
  border-color: #fecaca;
}

.btn-text {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #e5e7eb;
  color: #0f172a;
}

.badge.ok {
  background: #dcfce7;
  color: #166534;
}

.badge.warn {
  background: #fef3c7;
  color: #92400e;
}

.form {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}

.form input,
.form select {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 14px;
}

.form input:focus,
.form select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  outline: none;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ok-msg {
  margin-top: 6px;
  color: #166534;
  font-size: 13px;
}

.center-msg {
  text-align: center;
  margin-top: 40px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.modal-header p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  position: absolute;
  top: 40px;
  left: 16px;
}

.icon-close {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 24px 16px 16px;
  max-height: 300px;
  overflow-y: auto;
}

.presenca-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.presenca-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

@media (max-width: 960px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .aluno-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>