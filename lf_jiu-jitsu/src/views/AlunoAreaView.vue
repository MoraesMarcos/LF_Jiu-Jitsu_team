<template>
  <main class="aluno">
    <!-- ========== AUTH ========== -->
    <section v-if="!logado" class="auth-shell">
      <aside class="auth-left">
        <div class="brand-wrap">
          <div class="brand-title">LF Jiu-Jitsu</div>
          <div class="brand-subtitle">Domine a arte suave.</div>
        </div>
      </aside>

      <section class="auth-right">
        <div class="auth-toplink">
          <RouterLink to="/" class="back-link">← Voltar para o site</RouterLink>
        </div>

        <div class="auth-card">
          <header class="auth-head">
            <h1>Área do Aluno</h1>
            <p class="muted">Bem-vindo de volta! Acesse sua conta.</p>
          </header>

          <form @submit.prevent="entrar" class="auth-form" novalidate>
            <label class="auth-label">
              <span class="label-caption">E-MAIL</span>
              <input
                v-model.trim="login.email"
                type="email"
                placeholder="seuemail@exemplo.com"
                :class="['input-base', { 'input--invalid': !!emailError }]"
                @blur="onEmailBlur"
                @input="onEmailInput"
                autocomplete="email"
              />
              <small v-if="emailError" class="error">{{ emailError }}</small>
            </label>

            <label class="auth-label">
              <span class="label-caption">SENHA</span>
              <input
                v-model="login.senha"
                type="password"
                placeholder="•••••••"
                :class="['input-base', { 'input--invalid': !!senhaError }]"
                @blur="onSenhaBlur"
                @input="onSenhaInput"
                autocomplete="current-password"
              />
              <small v-if="senhaError" class="error">{{ senhaError }}</small>
            </label>

            <div class="auth-row-right">
              <RouterLink to="/recuperar-senha" class="link tiny">Esqueceu sua senha?</RouterLink>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            <p v-if="erroLogin" class="error mt-8">{{ erroLogin }}</p>

            <p class="muted center mt-16">
              Ainda não é membro?
              <RouterLink to="/planos" class="link strong">Conheça nossos planos.</RouterLink>
            </p>
          </form>
        </div>
      </section>
    </section>

    <!-- ========== ÁREA LOGADA / LAYOUT ========== -->
    <section v-else class="container">
      <header class="page-head">
        <h1>Área do Aluno</h1>
        <p class="muted">Acompanhe suas aulas, pagamentos e atualize seus dados.</p>
      </header>

      <!-- Navegação interna da Área do Aluno -->
      <nav class="aluno-tabs">
        <RouterLink :to="{ name: 'area-aluno' }" class="tab" :class="{ active: isDashboard }">Dashboard</RouterLink>
        <RouterLink :to="{ name: 'area-aluno-agenda' }" class="tab" :class="{ active: isAgenda }">Agenda / Check-in</RouterLink>
      </nav>

      <!-- Conteúdo das rotas filhas OU dashboard embutido -->
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component v-if="!isDashboard" :is="Component" />
        </Transition>
      </RouterView>

      <!-- Dashboard embutido (rota name === 'area-aluno') -->
      <section v-if="isDashboard" class="dashboard">
        <div class="grid-2">
          <!-- Perfil -->
          <article class="card profile">
            <div class="profile-head">
              <div class="avatar" :title="aluno.nome">{{ iniciais }}</div>
              <div>
                <h2>{{ aluno.nome }}</h2>
                <p class="muted">Faixa: {{ aluno.faixa }} · Plano: {{ aluno.plano }}</p>
              </div>
            </div>
            <ul class="keyvals">
              <li><span>Frequência (mês)</span><strong>{{ frequencia }}</strong></li>
              <li><span>Vencimento do Plano</span><strong :class="{ danger: vencido }">{{ aluno.vencimento }}</strong></li>
              <li><span>Presenças no ano</span><strong>{{ aluno.presencasAno }}</strong></li>
            </ul>
          </article>

          <!-- Pagamentos -->
          <article class="card payments">
            <h3>Pagamentos</h3>
            <table class="table">
              <thead>
                <tr><th>Mês</th><th>Valor</th><th>Status</th></tr>
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
            <button class="btn btn-secondary" @click="gerarBoleto">Gerar boleto/PIX do mês atual</button>
          </article>
        </div>

        <div class="grid-2">
          <!-- Próximas aulas -->
          <article class="card classes">
            <h3>Próximas Aulas</h3>
            <ul class="list">
              <li v-for="(aula, idx) in proximasAulas" :key="idx" class="list-item">
                <div>
                  <strong>{{ aula.dia }} · {{ aula.hora }}</strong>
                  <div class="muted">{{ aula.modalidade }} — Instrutor: {{ aula.prof }}</div>
                </div>
                <button
                  class="btn sm"
                  :class="{ 'btn-primary': !aula.confirmado }"
                  @click="toggleConfirmar(aula)"
                >
                  {{ aula.confirmado ? 'Confirmado' : 'Confirmar presença' }}
                </button>
              </li>
            </ul>
          </article>

          <!-- Avisos -->
          <article class="card notices">
            <h3>Avisos</h3>
            <ul class="bullets">
              <li v-for="(n, i) in avisos" :key="i">{{ n }}</li>
            </ul>
          </article>
        </div>

        <!-- Atualização de dados -->
        <article class="card update">
          <h3>Atualizar Dados</h3>
          <form class="form" @submit.prevent="salvarPerfil" novalidate>
            <div class="grid-3">
              <label>
                Nome
                <input v-model.trim="alunoEdicao.nome" type="text" required />
                <small v-if="perfilErrors.nome" class="error">{{ perfilErrors.nome }}</small>
              </label>
              <label>
                Telefone (WhatsApp)
                <input v-model.trim="alunoEdicao.telefone" type="tel" placeholder="(00) 90000-0000" />
                <small v-if="perfilErrors.telefone" class="error">{{ perfilErrors.telefone }}</small>
              </label>
              <label>
                E-mail
                <input v-model.trim="alunoEdicao.email" type="email" required />
                <small v-if="perfilErrors.email" class="error">{{ perfilErrors.email }}</small>
              </label>
            </div>

            <div class="grid-2">
              <label>
                Objetivo no Jiu-Jitsu
                <select v-model="alunoEdicao.objetivo">
                  <option value="saude">Saúde e condicionamento</option>
                  <option value="defesa">Defesa pessoal</option>
                  <option value="competicao">Competição</option>
                  <option value="recreativo">Recreativo</option>
                </select>
              </label>
              <label class="row" style="gap:8px">
                <input type="checkbox" v-model="alunoEdicao.whatsapp" />
                Notificações por WhatsApp
              </label>
            </div>

            <div class="row">
              <button class="btn btn-primary" type="submit">Salvar alterações</button>
              <button class="btn" type="button" @click="resetarEdicao">Cancelar</button>
            </div>
            <p v-if="salvo" class="ok">✅ Dados atualizados com sucesso.</p>
          </form>
        </article>

        <div class="row end">
          <button class="btn danger" @click="sair">Sair da conta</button>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  validateLogin,
  togglePresenceWithRules,
  canGenerateInvoice,
  validateProfile
} from '@/rules'

// ===== estado de auth =====
const logado = ref(false)
const login = ref({ email: '', senha: '' })
const erroLogin = ref('')
const emailError = ref('')
const senhaError = ref('')

// rota atual para decidir se mostra dashboard embutido
const route = useRoute()
const isDashboard = computed(() => route.name === 'area-aluno')
const isAgenda = computed(() => route.name === 'area-aluno-agenda' || route.name === 'area-aluno-agenda-detalhe')

onMounted(() => {
  logado.value = localStorage.getItem('aluno_logado') === '1'
  if (logado.value) inicializarDados()
})

// ===== validações de login =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
function onEmailBlur() {
  if (!login.value.email) emailError.value = 'Campo obrigatório.'
  else if (!emailRegex.test(login.value.email)) emailError.value = 'Informe um e-mail válido.'
  else emailError.value = ''
}
function onEmailInput() { if (login.value.email) emailError.value = '' }

function onSenhaBlur() {
  if (!login.value.senha) senhaError.value = 'Campo obrigatório.'
  else if (String(login.value.senha).length < 4) senhaError.value = 'A senha deve ter pelo menos 4 caracteres.'
  else senhaError.value = ''
}
function onSenhaInput() { if (login.value.senha) senhaError.value = '' }

function entrar() {
  erroLogin.value = ''
  onEmailBlur(); onSenhaBlur()
  if (emailError.value || senhaError.value) return

  const msg = validateLogin({ email: login.value.email, senha: login.value.senha })
  if (msg) { erroLogin.value = msg; return }

  logado.value = true
  localStorage.setItem('aluno_logado', '1')
  inicializarDados()
}
function sair() {
  logado.value = false
  localStorage.removeItem('aluno_logado')
}

// ===== dados de exemplo (mock) =====
const aluno = ref({
  nome: 'Aluno LF',
  faixa: 'Branca',
  plano: 'Mensal',
  vencimento: '10/11/2025',
  presencasAno: 48,
})
const iniciais = computed(() =>
  aluno.value.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
)
const vencido = computed(() => false)
const frequencia = ref(0)

const pagamentos = ref([
  { mes: 'Set/2025', valor: 62.0, status: 'Pago' },
  { mes: 'Out/2025', valor: 62.0, status: 'Pago' },
  { mes: 'Nov/2025', valor: 62.0, status: 'Pendente' },
])

const proximasAulas = ref([
  { dia: 'Seg (Hoje)', hora: '19:00', modalidade: 'Jiu-Jitsu Gi', prof: 'Sensei Lucas', confirmado: false },
  { dia: 'Qua',        hora: '19:00', modalidade: 'No-Gi',        prof: 'Sensei João',  confirmado: false },
  { dia: 'Sex',        hora: '18:30', modalidade: 'Fundamentos',  prof: 'Sensei Ana',   confirmado: true  },
])

const avisos = ref([
  'Treino extra sábado às 9h.',
  'Trazer garrafa de água e kimono limpo.',
  'Campeonato regional em duas semanas.',
])

function inicializarDados() {
  frequencia.value = proximasAulas.value.filter(a => a.confirmado).length + 6
}

function toggleConfirmar(aula) {
  const res = togglePresenceWithRules(aula)
  if (!res.ok) { alert(res.message); return }
  inicializarDados()
}

function gerarBoleto() {
  const res = canGenerateInvoice(pagamentos.value)
  if (!res.ok) { alert(res.message); return }
  alert(`Boleto/PIX gerado para ${res.pendente.mes} no valor de R$ ${res.pendente.valor.toFixed(2)}.`)
}

// ===== edição de perfil =====
const alunoEdicao = ref({
  nome: aluno.value.nome,
  telefone: '',
  email: 'aluno@lfjiujitsu.com',
  objetivo: 'saude',
  whatsapp: true,
})
const perfilErrors = ref({ nome: null, email: null, telefone: null })
const salvo = ref(false)

function salvarPerfil() {
  const { ok, errors } = validateProfile(alunoEdicao.value)
  perfilErrors.value = errors
  if (!ok) return

  aluno.value.nome = alunoEdicao.value.nome
  salvo.value = true
  setTimeout(() => (salvo.value = false), 2500)
}
function resetarEdicao() {
  alunoEdicao.value = {
    nome: aluno.value.nome,
    telefone: '',
    email: 'aluno@lfjiujitsu.com',
    objetivo: 'saude',
    whatsapp: true,
  }
}
</script>

<style scoped>
/* animação */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---------- Auth ---------- */
.auth-shell {
  display: grid;
  grid-template-columns: minmax(240px, 480px) 1fr;
  min-height: 100vh;
  background: #f6f7fb;
}
.auth-left {
  background: #121a24;
  color: #cbd5e1;
  display: grid;
  place-items: center;
  padding: 32px 16px;
}
.brand-wrap { text-align: center; }
.brand-title { color:#e2e8f0; font-weight: 800; font-size: 28px; letter-spacing:.4px; }
.brand-subtitle { color:#9aa8b6; margin-top: 8px; }

.auth-right { background:#fff; display:grid; grid-template-rows:auto 1fr; padding:32px 24px; }
.auth-toplink { max-width:480px; margin:0 auto 8px; width:100%; }
.back-link { color:#64748b; font-size:13px; text-decoration:none; }
.back-link:hover { text-decoration: underline; }

.auth-card { max-width:480px; width:100%; margin:0 auto; padding:16px 4px 32px; }
.auth-head h1 { margin:0 0 4px; font-size:28px; }
.auth-head .muted { margin:0 0 20px; }

.auth-form { display:grid; gap:14px; }
.auth-label { display:grid; gap:6px; }
.label-caption { font-size:11px; letter-spacing:.06em; color:#94a3b8; font-weight:700; }

.input-base {
  width:100%; height:40px; border:1px solid #e5e7eb; border-radius:10px;
  padding:8px 12px; font-size:14.5px; background:#fff;
  transition:border-color .15s ease, box-shadow .15s ease;
}
.input-base:focus { border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,.25); outline:none; }
.input--invalid { border-color:#ef4444 !important; box-shadow:0 0 0 3px rgba(239,68,68,.12) !important; }

.auth-row-right { display:flex; justify-content:flex-end; margin-top:-4px; }
.tiny { font-size:12px; }
.strong { font-weight:700; }
.btn-block { width:100%; height:42px; }
.mt-8 { margin-top:8px; }
.mt-16 { margin-top:16px; }
.center { text-align:center; }

/* ---------- Área logada ---------- */
.container { max-width:1140px; margin:0 auto; padding:0 16px; }
.aluno { padding:0; }
.page-head h1 { margin:0; }
.page-head .muted { color:#64748b; margin-top:6px; }

.aluno-tabs { display:flex; gap:10px; margin:16px 0 8px; }
.aluno-tabs .tab {
  padding:8px 14px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; text-decoration:none; color:#0f172a;
}
.aluno-tabs .tab.active { background:#eef2ff; color:#1d4ed8; border-color:#bfd3ff; }

.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; box-shadow:0 6px 16px rgba(0,0,0,.04); }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px; }
.grid-3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; }
.row { display:flex; align-items:center; gap:12px; }
.end { justify-content:flex-end; }

.form { display:grid; gap:12px; }

.profile-head { display:flex; gap:12px; align-items:center; }
.avatar { width:56px; height:56px; border-radius:50%; background:#e5efff; color:#1d4ed8; display:grid; place-items:center; font-weight:800; }

.keyvals { list-style:none; margin:12px 0 0; padding:0; display:grid; gap:8px; }
.keyvals li { display:flex; justify-content:space-between; border-top:1px dashed #e5e7eb; padding-top:8px; }
.danger { color:#b91c1c; }

.table { width:100%; border-collapse:collapse; margin-top:8px; }
.table th, .table td { text-align:left; padding:8px; border-bottom:1px solid #e5e7eb; }
.badge { padding:4px 8px; border-radius:999px; font-weight:700; font-size:12px; }
.badge.ok { background:#dcfce7; color:#14532d; }
.badge.warn { background:#fff7ed; color:#9a3412; }

.list { list-style:none; margin:0; padding:0; display:grid; gap:10px; }
.list-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; }

.bullets { margin:8px 0 0; padding-left:18px; }

.ok { color:#14532d; }

input, select, textarea {
  width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-size:16px;
}
input:focus, select:focus, textarea:focus { border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,.25); outline:none; }

.btn { padding:10px 14px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn.sm { padding:6px 10px; }
.btn-primary { background:#1d4ed8; color:#fff; border-color:#1d4ed8; }
.btn-secondary { background:#e5efff; color:#1d4ed8; border-color:#bfd3ff; }
.btn.danger { background:#fee2e2; color:#991b1b; border-color:#fecaca; }
.link { color:#1d4ed8; }

.muted { color:#64748b; }
.error { color:#b91c1c; font-size:12.5px; margin-top:4px; display:inline-block; }

@media (max-width: 960px) {
  .auth-shell { grid-template-columns:1fr; }
  .auth-left { min-height:220px; }
  .auth-right { padding:24px 16px; }
}
@media (max-width: 900px) {
  .grid-2 { grid-template-columns:1fr; }
  .grid-3 { grid-template-columns:1fr; }
}
</style>
