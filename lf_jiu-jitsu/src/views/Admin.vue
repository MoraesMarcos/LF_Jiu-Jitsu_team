<template>
  <main class="admin">
  
    <section v-if="!logado" class="auth-shell">
      <aside class="auth-left">
        <div class="brand-wrap">
          <div class="brand-title">LF Jiu-Jitsu</div>
          <div class="brand-subtitle">Painel Administrativo</div>
        </div>
      </aside>

      <section class="auth-right">
        <div class="auth-toplink">
          <a href="/" class="back-link">← Voltar para o site</a>
        </div>

        <div class="auth-card">
          <header class="auth-head">
            <h1>Acesso Admin</h1>
            <p class="muted">Área restrita. Use suas credenciais.</p>
          </header>

          <form @submit.prevent="entrar" class="auth-form">
            <label class="auth-label">
              <span class="label-caption">USUÁRIO / E-MAIL</span>
              <input
                v-model.trim="login.email"
                type="text"
                placeholder="admin@lfjiujitsu.com"
                required
              />
            </label>

            <label class="auth-label">
              <span class="label-caption">SENHA</span>
              <input
                v-model="login.senha"
                type="password"
                placeholder="•••••••"
                required
              />
            </label>

            <div class="auth-row-right">
              <a href="#" class="link tiny" @click.prevent="recuperarSenha">
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" class="btn btn-primary btn-block">
              Entrar
            </button>

            <p v-if="erroLogin" class="error mt-8">{{ erroLogin }}</p>

            <p class="muted center mt-16 tiny">
              Uso exclusivo da coordenação / professores.
            </p>
          </form>
        </div>
      </section>
    </section>

    <section v-else class="container">
      <header class="page-head">
        <h1>Painel Administrativo</h1>
        <p class="muted">
          Gerencie alunos, mensalidades, presença e avisos.
        </p>
      </header>

      <section class="dashboard">

        <div class="grid-3">
          <article class="card">
            <h3>Alunos ativos</h3>
            <p class="big">{{ resumo.alunosAtivos }}</p>
            <p class="muted tiny">Com matrícula em dia</p>
          </article>

          <article class="card">
            <h3>Pagamentos pendentes</h3>
            <p class="big danger">{{ resumo.pagamentosPendentes }}</p>
            <p class="muted tiny">Últimos 30 dias</p>
          </article>

          <article class="card">
            <h3>Próxima cobrança</h3>
            <p class="big">{{ resumo.vencimentoProximo }}</p>
            <p class="muted tiny">Turma infantil • Plano mensal</p>
          </article>
        </div>

        <article class="card mt-20">
          <div class="row space-between center-mobile">
            <h3>Alunos e Situação</h3>
            <button class="btn btn-primary sm" @click="cadastrarAluno">
              + Novo aluno
            </button>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Faixa</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Vencimento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in alunos" :key="i">
                <td><strong>{{ a.nome }}</strong></td>
                <td>{{ a.faixa }}</td>
                <td>{{ a.plano }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      ok: a.status === 'Em dia',
                      warn: a.status === 'Pendente'
                    }"
                  >
                    {{ a.status }}
                  </span>
                </td>
                <td :class="{ danger: a.status === 'Pendente' }">
                  {{ a.vencimento }}
                </td>
                <td>
                  <button class="btn sm" @click="editarAluno(a)">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="card mt-20">
          <h3>Avisos gerais</h3>
          <ul class="list">
            <li
              v-for="(aviso, idx) in avisos"
              :key="idx"
              class="list-item"
            >
              <div>
                <strong>{{ aviso.titulo }}</strong>
                <div class="muted tiny">{{ aviso.msg }}</div>
              </div>
              <button class="btn sm" @click="removerAviso(idx)">Remover</button>
            </li>
          </ul>

          <div class="row mt-16">
            <input
              v-model="novoAvisoTitulo"
              type="text"
              placeholder="Ex: Campeonato interno"
            />
            <input
              v-model="novoAvisoMsg"
              type="text"
              placeholder="Ex: Sábado 9h • obrigatório kimono"
            />
            <button class="btn btn-secondary sm" @click="adicionarAviso">
              Publicar aviso
            </button>
          </div>
        </article>

        <div class="row end mt-20">
          <button class="btn danger" @click="sair">Sair do painel</button>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const logado = ref(false)
const login = ref({ email: '', senha: '' })
const erroLogin = ref('')

const resumo = ref({
  alunosAtivos: 27,
  pagamentosPendentes: 3,
  vencimentoProximo: '10/11/2025'
})

const alunos = ref([
  {
    nome: 'João Silva',
    faixa: 'Branca',
    plano: 'Mensal',
    status: 'Em dia',
    vencimento: '10/11/2025'
  },
  {
    nome: 'Ana Souza',
    faixa: 'Amarela',
    plano: 'Mensal',
    status: 'Pendente',
    vencimento: '05/11/2025'
  },
  {
    nome: 'Carlos Lima',
    faixa: 'Cinza (Kids)',
    plano: 'Kids',
    status: 'Em dia',
    vencimento: '12/11/2025'
  }
])

const avisos = ref([
  { titulo: 'Treino extra', msg: 'Sábado 9h • turma competição' },
  { titulo: 'Pagamento novembro', msg: 'Regularizar até dia 10/11' }
])

const novoAvisoTitulo = ref('')
const novoAvisoMsg = ref('')

onMounted(() => {
  logado.value = localStorage.getItem('admin_logado') === '1'
})

function entrar() {
  erroLogin.value = ''

  if (
    login.value.email === 'admin@lfjiujitsu.com' &&
    login.value.senha === '1234'
  ) {
    logado.value = true
    localStorage.setItem('admin_logado', '1')
  } else {
    erroLogin.value = 'Credenciais inválidas.'
  }
}

function sair() {
  logado.value = false
  localStorage.removeItem('admin_logado')
}

function cadastrarAluno() {
  alert('⚠ Em breve: tela de cadastro de aluno.')
}

function editarAluno(aluno) {
  alert('Editar dados de ' + aluno.nome)
}

function adicionarAviso() {
  if (!novoAvisoTitulo.value || !novoAvisoMsg.value) return
  avisos.value.push({
    titulo: novoAvisoTitulo.value,
    msg: novoAvisoMsg.value
  })
  novoAvisoTitulo.value = ''
  novoAvisoMsg.value = ''
}

function removerAviso(idx) {
  avisos.value.splice(idx, 1)
}

function recuperarSenha() {
  alert('Contato com o responsável da academia para redefinir senha.')
}
</script>

<style scoped>

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
.brand-wrap {
  text-align: center;
}
.brand-title {
  color: #e2e8f0;
  font-weight: 800;
  font-size: 28px;
  letter-spacing: 0.4px;
}
.brand-subtitle {
  color: #9aa8b6;
  margin-top: 8px;
}

.auth-right {
  background: #fff;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 32px 24px;
}
.auth-toplink {
  max-width: 480px;
  margin: 0 auto 8px auto;
  width: 100%;
}
.back-link {
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}

.auth-card {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 4px 32px 4px;
}

.auth-head h1 {
  margin: 0 0 4px;
  font-size: 28px;
}
.auth-head .muted {
  margin: 0 0 20px;
}

.auth-form {
  display: grid;
  gap: 14px;
}
.auth-label {
  display: grid;
  gap: 6px;
}
.label-caption {
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #94a3b8;
  font-weight: 700;
}
.auth-form input {
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14.5px;
  background: #fff;
}
.auth-form input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25);
  outline: none;
}

.auth-row-right {
  display: flex;
  justify-content: flex-end;
  margin-top: -4px;
}

.tiny {
  font-size: 12px;
}
.strong {
  font-weight: 700;
}

.btn-block {
  width: 100%;
  height: 42px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-16 {
  margin-top: 16px;
}
.mt-20 {
  margin-top: 20px;
}
.center {
  text-align: center;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}
.admin {
  padding: 0;
}
.page-head h1 {
  margin: 0;
}
.page-head .muted {
  color: #64748b;
  margin-top: 6px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.space-between {
  justify-content: space-between;
}
.center-mobile {
  flex-wrap: wrap;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}
.table th,
.table td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}
.badge {
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}
.badge.ok {
  background: #dcfce7;
  color: #14532d;
}
.badge.warn {
  background: #fff7ed;
  color: #9a3412;
}

.big {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
}
.danger {
  color: #b91c1c;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}
.btn.sm {
  padding: 6px 10px;
  font-size: 13px;
}
.btn-primary {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}
.btn-secondary {
  background: #e5efff;
  color: #1d4ed8;
  border-color: #bfd3ff;
}
.btn.danger {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}
.link {
  color: #1d4ed8;
}

.muted {
  color: #64748b;
}

@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
  .auth-left {
    min-height: 220px;
  }
  .auth-right {
    padding: 24px 16px;
  }
}

@media (max-width: 900px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>