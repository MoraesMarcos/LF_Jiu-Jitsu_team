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
            Olá, {{ currentUser.name }}. Bem-vindo ao seu painel.
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
        
        <article class="card highlight full-width">
          <div class="profile-header">
            <div class="avatar">{{ iniciais }}</div>
            <div class="profile-info">
              <h2>{{ currentUser.name }}</h2>
              <div class="tags">
                <span class="tag-pill">Faixa {{ currentUser.belt }}</span>
                <span class="tag-pill">Plano {{ currentUser.plan }}</span>
                <span class="tag-pill">Perfil {{ currentUser.profile }}</span>
              </div>
            </div>
          </div>

          <div class="profile-details-grid">
            <div class="detail-box">
              <span class="label">📞 Contato</span>
              <span class="value">{{ currentUser.phone }}</span>
            </div>
            <div class="detail-box">
              <span class="label">🎯 Objetivo</span>
              <span class="value">{{ currentUser.goal }}</span>
            </div>
            <div class="detail-box">
              <span class="label">📅 Presenças no Ano</span>
              <span class="value">{{ stats.presencasAno }} treinos</span>
            </div>
            <div class="detail-box">
              <span class="label">💳 Status</span>
              <span class="value status-ok">Em dia</span>
            </div>
          </div>
        </article>

        <div class="grid-2 mt-20">
          <article class="card">
            <h3>Histórico de Pagamentos</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in pagamentos" :key="i">
                  <td>{{ p.mes }}</td>
                  <td>
                    <span class="badge" :class="{ ok: p.status === 'Pago', warn: p.status === 'Pendente' }">
                      {{ p.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>

          <article class="card">
            <h3>📝 Meus Dados</h3>
            <form @submit.prevent="salvarDados" class="edit-form">
              <div class="form-group">
                <label>Telefone / WhatsApp</label>
                <input v-model="formPerfil.phone" type="text" placeholder="(00) 00000-0000" />
              </div>
              
              <div class="form-group">
                <label>Objetivo no Jiu-Jitsu</label>
                <select v-model="formPerfil.goal">
                  <option>Saúde e Bem-estar</option>
                  <option>Defesa Pessoal</option>
                  <option>Competição</option>
                  <option>Perda de Peso</option>
                  <option>Estilo de Vida</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary full-btn">
                Salvar Alterações
              </button>
              
              <p v-if="feedbackSalvo" class="msg-success">✅ Dados atualizados!</p>
            </form>
          </article>
        </div>
      </section>

      <section v-else class="agenda">
        <article class="card highlight mb-20 compact">
          <div class="profile-compact">
            <div class="avatar sm">{{ iniciais }}</div>
            <div>
              <h2 class="sm-title">{{ currentUser.name }}</h2>
              <p class="muted-light">
                {{ currentUser.belt }} · {{ currentUser.profile }}
              </p>
            </div>
          </div>
        </article>

        <header class="agenda-head">
          <h2>Check-in</h2>
          <p class="muted">
            Aulas filtradas para seu perfil: <strong>{{ currentUser.profile }}</strong>.
          </p>
        </header>

        <div class="date-strip">
          <button v-for="d in days" :key="d" class="day-pill" :class="{ active: selectedDate === d }" @click="selectedDate = d">
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
                <button class="btn-text" @click="abrirListaPresenca(s.id, s.titulo)">Ver quem vai</button>
              </div>
              <button class="btn" :class="botaoClass(s)" :disabled="vagasRestantes(s) === 0 && !isBooked(s.id)" @click="toggle(s)">
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
const activeTab = ref('dashboard')

onMounted(() => { 
  if (!currentUser.value) {
    router.replace('/login-aluno') 
  } else {
    // Carrega dados atuais no formulário ao abrir
    formPerfil.value.phone = currentUser.value.phone
    formPerfil.value.goal = currentUser.value.goal
  }
})

watch(currentUser, (val) => { if (!val) router.replace('/login-aluno') })

function logout () { alunosStore.logout() }

const iniciais = computed(() => currentUser.value?.name ? currentUser.value.name.slice(0,2).toUpperCase() : 'LF')

// --- LÓGICA DE EDIÇÃO DE PERFIL ---
const formPerfil = ref({
  phone: '',
  goal: ''
})
const feedbackSalvo = ref(false)

function salvarDados() {
  // Chama a store para atualizar
  alunosStore.updateProfile({
    phone: formPerfil.value.phone,
    goal: formPerfil.value.goal
  })
  
  feedbackSalvo.value = true
  setTimeout(() => feedbackSalvo.value = false, 3000)
}

// --- DADOS ESTATÍSTICOS ---
const stats = ref({
  presencasAno: 42,
  vencimento: '10/12/2025'
})

const pagamentos = ref([
  { mes: 'Out/2025', valor: 70, status: 'Pago' },
  { mes: 'Nov/2025', valor: 70, status: 'Pago' },
  { mes: 'Dez/2025', valor: 70, status: 'Pendente' }
])

const proximasAulas = ref([
  { dia: 'Hoje', hora: '19:30', modalidade: 'Jiu-Jitsu Adulto', confirmado: true },
  { dia: 'Qua', hora: '16:00', modalidade: 'Turma Feminina', confirmado: false }
])

// --- CHECK-IN LOGIC ---
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
  if (isBooked(session.id)) {
    const confirmarCancelamento = confirm('Você já confirmou presença. Deseja cancelar sua vaga?')
    if (!confirmarCancelamento) return
  }

  const updated = { ...session, attendees: [...session.attendees] }
  const res = toggleBookingWithRules(updated, userId.value, new Date())
  
  if (!res.ok) { alert(res.message); return }
  checkinStore.toggleCheckin(session.id)

  if (isBooked(session.id)) {
    alert('✅ Vaga reservada com sucesso!')
  } else {
    alert('❌ Reserva cancelada. Vaga liberada.')
  }
}

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
.mt-20 { margin-top: 20px; }
.mb-20 { margin-bottom: 20px; }

.tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.tab { padding: 8px 16px; border-radius: 99px; border: 1px solid transparent; background: #e2e8f0; cursor: pointer; font-weight: 600; }
.tab.active { background: #2563eb; color: white; }

.grid-3 { display: grid; gap: 20px; margin-bottom: 20px; }
.grid-2 { display: grid; gap: 20px; grid-template-columns: 1fr 1fr; }

.card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.highlight { background: linear-gradient(135deg, #1e40af, #172554); color: white; }
.highlight h2 { color: white; margin: 0; font-size: 24px; }
.highlight .muted { color: #bfdbfe; }

.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 20px; }
.avatar { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: grid; place-items: center; font-weight: bold; font-size: 24px; color: white; }
.tags { display: flex; gap: 8px; margin-top: 5px; flex-wrap: wrap; }
.tag-pill { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; }

.profile-details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
.detail-box { display: flex; flex-direction: column; }
.detail-box .label { font-size: 12px; color: #bfdbfe; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-box .value { font-size: 16px; font-weight: 700; color: white; }
.status-ok { color: #86efac; } 

/* FORMULÁRIO DE EDIÇÃO */
.edit-form { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }
.full-btn { width: 100%; margin-top: 5px; }
.msg-success { color: #166534; font-size: 13px; text-align: center; margin-top: 8px; font-weight: 600; }

/* REUTILIZAÇÃO */
.list { display: flex; flex-direction: column; gap: 12px; list-style: none; padding: 0; margin: 0; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
.table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
.table th, .table td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; }
.table th { color: #64748b; font-weight: 600; }
.badge { font-size: 11px; padding: 4px 8px; border-radius: 99px; background: #e5e7eb; font-weight: 700; }
.badge.ok { background: #dcfce7; color: #166534; }
.badge.warn { background: #fef3c7; color: #92400e; }

/* AGENDA */
.compact { padding: 15px; }
.profile-compact { display: flex; align-items: center; gap: 15px; }
.avatar.sm { width: 40px; height: 40px; font-size: 16px; }
.sm-title { font-size: 18px !important; }
.muted-light { color: #bfdbfe; font-size: 14px; }
.date-strip { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.day-pill { padding: 6px 14px; border-radius: 99px; border: 1px solid #cbd5e1; background: white; cursor: pointer; }
.day-pill.active { background: #2563eb; color: white; border-color: #2563eb; }
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

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
  .profile-header { flex-direction: column; text-align: center; }
  .tags { justify-content: center; }
  .card.session { flex-direction: column; align-items: flex-start; gap: 15px; }
  .right { width: 100%; justify-content: space-between; }
  .vagas-info { align-items: flex-start; text-align: left; }
}
</style>