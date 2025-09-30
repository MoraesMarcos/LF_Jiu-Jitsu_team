<template>
  <main class="aluno">
    <section class="container">
      <header class="page-head">
        <h1>Área do Aluno</h1>
        <p class="muted">Acompanhe suas aulas, pagamentos e atualize seus dados.</p>
      </header>

      <section v-if="!logado" class="card login">
        <h2>Entrar</h2>
        <form @submit.prevent="entrar" class="form">
          <div class="grid-2">
            <label>
              E-mail
              <input v-model.trim="login.email" type="email" placeholder="email@gmail.com" required />
            </label>
            <label>
              Senha
              <input v-model="login.senha" type="password" placeholder="••••••••" required />
            </label>
          </div>
          <div class="row">
            <label class="remember">
              <input type="checkbox" v-model="lembrar" />
              Lembrar de mim
            </label>
            <a class="link" href="#" @click.prevent="recuperarSenha">Esqueci minha senha</a>
          </div>
          <button class="btn btn-primary" type="submit">Acessar</button>
          <p v-if="erroLogin" class="error">{{ erroLogin }}</p>
        </form>
      </section>

      <section v-else class="dashboard">
  
        <div class="grid-2">
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
              <li><span>Vencimento do Plano</span><strong :class="{'danger': vencido}">{{ aluno.vencimento }}</strong></li>
              <li><span>Presenças no ano</span><strong>{{ aluno.presencasAno }}</strong></li>
            </ul>
          </article>

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
                    <span class="badge" :class="{'ok': p.status==='Pago', 'warn': p.status==='Pendente'}">
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
          <article class="card classes">
            <h3>Próximas Aulas</h3>
            <ul class="list">
              <li v-for="(aula, idx) in proximasAulas" :key="idx" class="list-item">
                <div>
                  <strong>{{ aula.dia }} · {{ aula.hora }}</strong>
                  <div class="muted">{{ aula.modalidade }} — Instrutor: {{ aula.prof }}</div>
                </div>
                <button class="btn sm" :class="{'btn-primary': !aula.confirmado}" @click="toggleConfirmar(aula)">
                  {{ aula.confirmado ? 'Confirmado' : 'Confirmar presença' }}
                </button>
              </li>
            </ul>
          </article>

          <article class="card notices">
            <h3>Avisos</h3>
            <ul class="bullets">
              <li v-for="(n, i) in avisos" :key="i">{{ n }}</li>
            </ul>
          </article>
        </div>

        <article class="card update">
          <h3>Atualizar Dados</h3>
          <form class="form" @submit.prevent="salvarPerfil">
            <div class="grid-3">
              <label>
                Nome
                <input v-model.trim="alunoEdicao.nome" type="text" required />
              </label>
              <label>
                Telefone (WhatsApp)
                <input v-model.trim="alunoEdicao.telefone" type="tel" placeholder="(00) 90000-0000" />
              </label>
              <label>
                E-mail
                <input v-model.trim="alunoEdicao.email" type="email" required />
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
              <label>
                Notificações por WhatsApp
                <input type="checkbox" v-model="alunoEdicao.whatsapp" />
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

const logado = ref(false)
const lembrar = ref(true)
const login = ref({ email: '', senha: '' })
const erroLogin = ref('')

onMounted(() => {
  logado.value = localStorage.getItem('aluno_logado') === '1'
  if (logado.value) inicializarDados()
})

function entrar() {
  erroLogin.value = ''
  if (!login.value.email || login.value.senha.length < 4) {
    erroLogin.value = 'Verifique seu e-mail e senha.'
    return
  }
  logado.value = true
  if (lembrar.value) localStorage.setItem('aluno_logado', '1')
  inicializarDados()
}
function sair() {
  logado.value = false
  localStorage.removeItem('aluno_logado')
}

const aluno = ref({
  nome: 'Aluno LF',
  faixa: 'Branca',
  plano: 'Mensal',
  vencimento: '10/11/2025',
  presencasAno: 48,
})
const iniciais = computed(() =>
  aluno.value.nome
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)
const vencido = computed(() => false)
const frequencia = ref(0)

const pagamentos = ref([
  { mes: 'Set/2025', valor: 120, status: 'Pago' },
  { mes: 'Out/2025', valor: 120, status: 'Pago' },
  { mes: 'Nov/2025', valor: 120, status: 'Pendente' },
])

const proximasAulas = ref([
  { dia: 'Seg (Hoje)', hora: '19:00', modalidade: 'Jiu-Jitsu Gi', prof: 'Sensei Lucas', confirmado: false },
  { dia: 'Qua', hora: '19:00', modalidade: 'No-Gi', prof: 'Sensei João', confirmado: false },
  { dia: 'Sex', hora: '18:30', modalidade: 'Fundamentos', prof: 'Sensei Ana', confirmado: true },
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
  aula.confirmado = !aula.confirmado
  inicializarDados()
}

function gerarBoleto() {
  alert('Boleto/PIX gerado!')
}

const alunoEdicao = ref({
  nome: aluno.value.nome,
  telefone: '',
  email: 'aluno@lfjiujitsu.com',
  objetivo: 'saude',
  whatsapp: true,
})
const salvo = ref(false)

function salvarPerfil() {
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

function recuperarSenha() {
  alert('Enviamos instruções de recuperação para seu e-mail.')
}
</script>

<style scoped>
.container { max-width: 1140px; margin: 0 auto; padding: 0 16px; }
.aluno { padding: 40px 0 96px; }
.page-head h1 { margin: 0; }
.page-head .muted { color: #64748b; margin-top: 6px; }

.card {
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 16px; box-shadow: 0 6px 16px rgba(0,0,0,.04);
}
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.row { display: flex; align-items: center; gap: 12px; }
.end { justify-content: flex-end; }

.login h2 { margin: 0 0 8px; }
.form { display: grid; gap: 12px; }
.grid-2 .form, .grid-3 .form { grid-column: 1 / -1; }
.remember { display: flex; align-items: center; gap: 8px; }
.error { color: #b91c1c; }

.profile-head { display: flex; gap: 12px; align-items: center; }
.avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: #e5efff; color: #1d4ed8; display: grid; place-items: center;
  font-weight: 800;
}
.keyvals { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 8px; }
.keyvals li { display: flex; justify-content: space-between; border-top: 1px dashed #e5e7eb; padding-top: 8px; }
.danger { color: #b91c1c; }

.table { width: 100%; border-collapse: collapse; margin-top: 8px; }
.table th, .table td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
.badge { padding: 4px 8px; border-radius: 999px; font-weight: 700; font-size: 12px; }
.badge.ok { background: #dcfce7; color: #14532d; }
.badge.warn { background: #fff7ed; color: #9a3412; }

.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }

.bullets { margin: 8px 0 0; padding-left: 18px; }

.ok { color: #14532d; }

input, select, textarea {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; font-size: 16px;
}
input:focus, select:focus, textarea:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96,165,250,.25); outline: none; }

.btn { padding: 10px 14px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; }
.btn.sm { padding: 6px 10px; }
.btn-primary { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
.btn-secondary { background: #e5efff; color: #1d4ed8; border-color: #bfd3ff; }
.btn.danger { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
.link { color: #1d4ed8; }

.muted { color: #64748b; }

@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
}
</style>