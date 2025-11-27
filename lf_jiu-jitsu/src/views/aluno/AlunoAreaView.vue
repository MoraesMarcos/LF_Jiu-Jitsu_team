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
            Olá, {{ currentUser.name }}.
          </p>
        </div>
        <button class="btn-ghost" @click="logout">Sair</button>
      </header>

      <nav class="tabs">
        <button class="tab" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
          Dashboard
        </button>
        <button class="tab" :class="{ active: activeTab === 'agenda' }" @click="activeTab = 'agenda'">
          Agenda / Check-in
        </button>
      </nav>

      <section v-if="activeTab === 'dashboard'" class="dashboard">
        <div class="grid-3">
          <article class="card highlight">
            <div class="profile">
              <div class="avatar">{{ iniciais }}</div>
              <div>
                <h2>{{ currentUser.name }}</h2>
                <p class="muted">
                  {{ currentUser.belt }} · {{ currentUser.plan }} · {{ currentUser.profile }}
                </p>
              </div>
            </div>
            <ul class="stats">
              <li><span>Aulas Mês</span><strong>8</strong></li>
              <li><span>Presenças Ano</span><strong>42</strong></li>
              <li><span>Vencimento</span><strong>10/12/2025</strong></li>
            </ul>
          </article>
        </div>
        <p class="muted">Atualize seus dados na secretaria.</p>
      </section>

      <section v-else class="agenda">
        <header class="agenda-head">
          <h2>Check-in</h2>
          <p class="muted">
            Aulas filtradas para seu perfil: <strong>{{ currentUser.profile }}</strong>.
          </p>
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
            <div class="info">
              <div class="time">{{ s.time }}</div>
              <div class="name">{{ s.name || s.titulo }}</div>
              <div class="coach">{{ s.coach || s.instrutor }}</div>
            </div>

            <div class="right">
              <div class="vagas-info">
                <span class="vagas-count" :class="{ 'vagas-full': vagasRestantes(s) === 0 }">
                  {{ vagasRestantes(s) }}/{{ s.capacity }} vagas
                </span>
                <button class="btn-text" @click="abrirListaPresenca(s.id, s.titulo)">
                  Ver quem vai
                </button>
              </div>
              
              <button
                class="btn"
                :class="botaoClass(s)"
                :disabled="vagasRestantes(s) === 0 && !isBooked(s.id)"
                @click="toggle(s)"
              >
                {{ textoBotao(s) }}
              </button>
            </div>
          </article>
        </div>

        <p v-else class="muted center-msg">Nenhuma aula para seu perfil neste dia.</p>
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
              <span class="dot"></span> {{ aluno.name || aluno.nome }} ({{ aluno.belt || aluno.faixa }})
            </li>
          </ul>
          <p v-else class="muted">Nenhum aluno confirmado ainda. Seja o primeiro!</p>
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
const activeTab = ref('agenda') 

onMounted(() => { if (!currentUser.value) router.replace('/login-aluno') })
watch(currentUser, (val) => { if (!val) router.replace('/login-aluno') })

function logout () { alunosStore.logout() }

const iniciais = computed(() => currentUser.value?.name ? currentUser.value.name.slice(0,2).toUpperCase() : 'LF')

const userId = computed(() => currentUser.value?.id || 'demo')
const userProfile = computed(() => currentUser.value?.profile || 'adulto')

const { days, selectedDate, listByDate, attendeesCount, isBooked, replaceSession } = useBookings(userId, userProfile)

function formatDate (iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function vagasRestantes(s) {
  const ocupadas = attendeesCount(s.id)
  return Math.max(0, (s.capacity || 20) - ocupadas)
}

function textoBotao(s) {
  if (isBooked(s.id)) return 'Check-in realizado'
  if (vagasRestantes(s) === 0) return 'LOTADO'
  return 'Fazer check-in'
}

function botaoClass(s) {
  if (isBooked(s.id)) return 'btn-checked'
  if (vagasRestantes(s) === 0) return 'btn-full'
  return 'btn-primary'
}

function toggle (session) {
  // 1. Confirmação de cancelamento
  if (isBooked(session.id)) {
    const confirmarCancelamento = confirm('Você já confirmou presença. Deseja cancelar sua vaga?')
    if (!confirmarCancelamento) return
  }

  // 2. CORREÇÃO CRÍTICA: Cria uma cópia profunda da lista de attendees
  // Se não fizer isso, a regra altera o array original antes da store, causando o bug de "duplo clique"
  const updated = { 
    ...session, 
    attendees: [...session.attendees] 
  }

  // Valida as regras usando a cópia
  const res = toggleBookingWithRules(updated, userId.value, new Date())
  
  if (!res.ok) { 
    alert(res.message); 
    return 
  }
  
  // 3. Efetiva a ação na Store Real
  checkinStore.toggleCheckin(session.id)

  // 4. Feedback final
  if (isBooked(session.id)) {
    alert('✅ Vaga reservada com sucesso!')
  } else {
    alert('❌ Reserva cancelada. Vaga liberada.')
  }
}

// Modal
const modalAberto = ref(false)
const modalTitulo = ref('')
const listaAtual = ref([])

function abrirListaPresenca(sessionId, sessionName) {
  modalTitulo.value = sessionName
  listaAtual.value = checkinStore.listaPresenca(sessionId)
  modalAberto.value = true
}
function fecharModal() { modalAberto.value = false; listaAtual.value = [] }
</script>

<style scoped>
.aluno-shell { padding: 32px 0 64px; background: #f8fafc; min-height: 100vh; }
.aluno-container { max-width: 1000px; margin: 0 auto; padding: 0 16px; }
.aluno-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.aluno-head h1 { margin: 0; font-size: 26px; }
.muted { color: #64748b; font-size: 14px; }

.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tab { padding: 8px 16px; border-radius: 99px; border: 1px solid transparent; background: #e2e8f0; cursor: pointer; font-weight: 600; }
.tab.active { background: #2563eb; color: white; }

.grid-3 { display: grid; gap: 20px; margin-bottom: 20px; }
.card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.highlight { background: linear-gradient(135deg, #1e40af, #172554); color: white; }
.highlight .muted { color: #bfdbfe; }
.profile { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.avatar { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; display: grid; place-items: center; font-weight: bold; }
.stats { list-style: none; padding: 0; display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; }
.stats li { display: flex; flex-direction: column; }
.stats span { font-size: 12px; opacity: 0.8; }
.stats strong { font-size: 18px; }

.date-strip { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.day-pill { padding: 6px 14px; border-radius: 99px; border: 1px solid #cbd5e1; background: white; cursor: pointer; }
.day-pill.active { background: #2563eb; color: white; border-color: #2563eb; }

.list { display: flex; flex-direction: column; gap: 12px; }
.card.session { display: flex; justify-content: space-between; align-items: center; }
.info .time { font-weight: 800; font-size: 18px; color: #0f172a; }
.info .name { font-weight: 600; margin: 2px 0; }
.info .coach { font-size: 13px; color: #64748b; }

.right { display: flex; align-items: center; gap: 20px; }
.vagas-info { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
.vagas-count { font-size: 13px; font-weight: 700; color: #15803d; transition: color 0.3s; }
.vagas-full { color: #dc2626; }

.btn-text { background: none; border: none; color: #2563eb; font-size: 12px; text-decoration: underline; cursor: pointer; padding: 0; margin-top: 4px; }

.btn { padding: 10px 18px; border-radius: 99px; border: none; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.2s; min-width: 150px; }
.btn-primary { background: #2563eb; color: white; }
.btn-checked { background: #22c55e; color: white; }
.btn-full { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }

.btn-ghost { background: transparent; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; cursor: pointer; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; padding: 20px; z-index: 100; }
.modal-card { background: white; width: 100%; max-width: 400px; border-radius: 12px; overflow: hidden; }
.modal-header { padding: 15px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 18px; }
.modal-body { padding: 20px; max-height: 300px; overflow-y: auto; }
.icon-close { background: none; border: none; font-size: 24px; cursor: pointer; }
.presenca-list { list-style: none; padding: 0; margin: 0; }
.presenca-list li { padding: 8px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; font-size: 14px; }
.dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }

@media (max-width: 600px) {
  .card.session { flex-direction: column; align-items: flex-start; gap: 15px; }
  .right { width: 100%; justify-content: space-between; }
  .vagas-info { align-items: flex-start; text-align: left; }
}
</style>