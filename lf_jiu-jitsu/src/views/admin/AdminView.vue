<template>
  <main class="admin-view">
    <div class="admin-header">
      <div class="container">
        <h1>Painel Administrativo</h1>
        <p>Bem-vindo, Mestre. Gerencie sua academia aqui.</p>
        <button @click="logout" class="btn-logout">Sair</button>
      </div>
    </div>

    <div class="container layout">
      <!-- MENU LATERAL -->
      <aside class="admin-menu" aria-label="Menu administrativo">
        <button
          :class="{ active: currentTab === 'eventos' }"
          @click="currentTab = 'eventos'"
        >
          📅 Eventos
        </button>
        <button
          :class="{ active: currentTab === 'blog' }"
          @click="currentTab = 'blog'"
        >
          ✍️ Blog
        </button>
        <button
          :class="{ active: currentTab === 'horarios' }"
          @click="currentTab = 'horarios'"
        >
          ⏰ Horários
        </button>
        <button
          :class="{ active: currentTab === 'alunos' }"
          @click="currentTab = 'alunos'"
        >
          🥋 Alunos
        </button>
      </aside>

      <!-- CONTEÚDO PRINCIPAL -->
      <section class="admin-content">
        <!-- EVENTOS -->
        <div v-if="currentTab === 'eventos'">
          <div class="header-action">
            <div>
              <h2>Gerenciar Eventos</h2>
              <p class="sub">
                Eventos exibidos na home (ex.: exames de faixa, campeonatos,
                aulas especiais).
              </p>
            </div>
            <button class="btn-add" @click="prepareCreateEvent">
              + Novo Evento
            </button>
          </div>

          <div v-if="showEventForm" class="form-card">
            <h3>{{ eventForm.id ? 'Editar evento' : 'Novo evento' }}</h3>
            <form @submit.prevent="saveEvent">
              <div class="row">
                <input
                  v-model="eventForm.day"
                  placeholder="Dia (15)"
                  required
                  class="input-small"
                />
                <input
                  v-model="eventForm.month"
                  placeholder="Mês (DEZ)"
                  required
                  class="input-small"
                />
              </div>
              <input v-model="eventForm.title" placeholder="Título" required />
              <input v-model="eventForm.info" placeholder="Infos" required />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button
                  type="button"
                  class="btn-cancel"
                  @click="cancelEventForm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <ul class="admin-list" aria-label="Lista de eventos">
            <li v-for="ev in events" :key="ev.id">
              <div>
                <strong>{{ ev.day }}/{{ ev.month }}</strong> — {{ ev.title }}
                <span class="muted"> · {{ ev.info }}</span>
              </div>
              <div class="item-actions">
                <button class="btn-link" @click="editEvent(ev)">Editar</button>
                <button class="btn-delete" @click="deleteEvent(ev.id)">
                  Excluir
                </button>
              </div>
            </li>
            <li v-if="!events.length" class="empty">
              Nenhum evento cadastrado ainda.
            </li>
          </ul>
        </div>

        <!-- BLOG -->
        <div v-if="currentTab === 'blog'">
          <div class="header-action">
            <div>
              <h2>Gerenciar Blog</h2>
              <p class="sub">
                Publicações que aparecem na seção de notícias do site.
              </p>
            </div>
            <button class="btn-add" @click="prepareCreatePost">
              + Novo Post
            </button>
          </div>

          <div v-if="showBlogForm" class="form-card">
            <h3>{{ blogForm.id ? 'Editar post' : 'Novo post' }}</h3>
            <form @submit.prevent="savePost">
              <input
                v-model="blogForm.title"
                placeholder="Título"
                required
              />
              <textarea
                v-model="blogForm.excerpt"
                placeholder="Resumo"
                rows="3"
                required
              ></textarea>
              <input
                v-model="blogForm.image"
                placeholder="URL da imagem de capa"
                required
              />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button
                  type="button"
                  class="btn-cancel"
                  @click="cancelBlogForm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <ul class="admin-list" aria-label="Lista de posts">
            <li v-for="post in posts" :key="post.id">
              <div>
                <strong>{{ post.title }}</strong>
                <span class="muted"
                  > · {{ post.excerpt?.slice(0, 60) }}...</span
                >
              </div>
              <div class="item-actions">
                <button class="btn-link" @click="editPost(post)">Editar</button>
                <button class="btn-delete" @click="deletePost(post.id)">
                  Excluir
                </button>
              </div>
            </li>
            <li v-if="!posts.length" class="empty">
              Nenhum post publicado ainda.
            </li>
          </ul>
        </div>

        <!-- HORÁRIOS -->
        <div v-if="currentTab === 'horarios'">
          <div class="header-action">
            <div>
              <h2>Grade de Horários</h2>
              <p class="sub">
                Nesta PoC, a grade é gerenciada pela
                <strong>scheduleStore</strong> e exibida na página pública de
                horários. Aqui é apenas um resumo visual.
              </p>
            </div>
          </div>

          <div class="form-card">
            <p>
              • Use a aba <strong>Horários</strong> do site para conferir como a
              grade está sendo mostrada aos alunos.<br />
              • Em uma versão completa, esta tela permitiria criar, editar e
              remover horários agrupando por:
            </p>
            <ul class="bullet">
              <li>Turma (Adulto, Kids, Feminina, Mista)</li>
              <li>Dia da semana e horário</li>
              <li>Instrutor responsável</li>
            </ul>
            <p class="muted">
              (mantive apenas a explicação para não conflitar com a store já
              configurada que você comentou ✍️)
            </p>
          </div>
        </div>

        <!-- ALUNOS -->
        <div v-if="currentTab === 'alunos'">
          <div class="header-action">
            <div>
              <h2>Gerenciar Alunos</h2>
              <p class="sub">
                Cadastros usados na Área do Aluno e na lista de presença /
                check-in.
              </p>
            </div>
            <button class="btn-add" @click="openAlunoForm">
              + Matricular Aluno
            </button>
          </div>

          <!-- FORM DE ALUNO -->
          <div v-if="showAlunoForm" class="form-card">
            <h3>{{ alunoForm.id ? 'Editar aluno' : 'Nova matrícula' }}</h3>
            <form @submit.prevent="saveAluno">
              <input
                v-model="alunoForm.name"
                placeholder="Nome Completo"
                required
              />

              <div class="row">
                <select v-model="alunoForm.faixa" required>
                  <option disabled value="">Faixa</option>
                  <option>Branca</option>
                  <option>Azul</option>
                  <option>Roxa</option>
                  <option>Marrom</option>
                  <option>Preta</option>
                </select>

                <select v-model="alunoForm.plan" required>
                  <option disabled value="">Plano</option>
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>

                <select v-model="alunoForm.perfilTreino" required>
                  <option disabled value="">Perfil / Turma</option>
                  <option value="adulto">Adulto</option>
                  <option value="kids">Kids</option>
                  <option value="feminino">Feminina</option>
                  <option value="misto">Mista</option>
                </select>
              </div>

              <p class="preview-login" v-if="alunoForm.name">
                Login será:
                <strong>{{ gerarUsername(alunoForm.name) }}</strong><br />
                Senha padrão:
                <strong>123</strong> (somente PoC)
              </p>

              <div class="form-actions">
                <button type="submit" class="btn-save">
                  {{ alunoForm.id ? 'Salvar alterações' : 'Matricular' }}
                </button>
                <button
                  type="button"
                  class="btn-cancel"
                  @click="cancelAlunoForm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <!-- TABELA DE ALUNOS -->
          <table class="data-table" aria-label="Tabela de alunos matriculados">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Faixa</th>
                <th>Plano</th>
                <th>Perfil / Turma</th>
                <th style="width: 130px">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunos" :key="aluno.id">
                <td>{{ aluno.nome }}</td>
                <td class="mono">{{ aluno.login }}</td>
                <td>{{ aluno.faixa }}</td>
                <td>
                  <span class="badge">{{ aluno.plano }}</span>
                </td>
                <td>{{ labelPerfil(aluno.perfilTreino) }}</td>
                <td>
                  <button
                    class="btn-link small"
                    type="button"
                    @click="editAluno(aluno)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn-delete small"
                    type="button"
                    @click="deleteAluno(aluno.id)"
                  >
                    Remover
                  </button>
                </td>
              </tr>
              <tr v-if="!alunos.length">
                <td colspan="6" class="empty">Nenhum aluno cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/store/authStore'
import { eventStore } from '@/store/eventStore'
import { blogStore } from '@/store/blogStore'
import { alunosStore } from '@/store/alunosStore'

const router = useRouter()
const currentTab = ref('alunos')
const isEditing = ref(false)

// LOGOUT
function logout () {
  authStore.logout()
  router.push('/admin/login')
}

/* =======================
   ALUNOS
   ======================= */

const alunos = computed(() => alunosStore.lista) // do store que montamos antes

const showAlunoForm = ref(false)
const alunoForm = reactive({
  id: null,
  name: '',
  faixa: '',
  plan: '',
  perfilTreino: ''
})

const labelPerfil = (p) => {
  if (p === 'adulto') return 'Turma Adulto'
  if (p === 'kids') return 'Turma Kids'
  if (p === 'feminino') return 'Turma Feminina'
  if (p === 'misto') return 'Turma Mista'
  return p || ''
}

const gerarUsername = (nome) =>
  'lf.' +
  (nome || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')

function openAlunoForm () {
  resetAlunoForm()
  showAlunoForm.value = true
}

function resetAlunoForm () {
  Object.assign(alunoForm, {
    id: null,
    name: '',
    faixa: '',
    plan: '',
    perfilTreino: ''
  })
  isEditing.value = false
}

function saveAluno () {
  const payload = {
    id:
      alunoForm.id ??
      (alunos.value.length
        ? Math.max(...alunos.value.map((a) => a.id)) + 1
        : 1),
    nome: alunoForm.name,
    login: gerarUsername(alunoForm.name),
    faixa: alunoForm.faixa,
    plano: alunoForm.plan,
    perfilTreino: alunoForm.perfilTreino
  }

  if (isEditing.value) {
    const idx = alunosStore.lista.findIndex((a) => a.id === alunoForm.id)
    if (idx !== -1) alunosStore.lista[idx] = payload
  } else {
    alunosStore.lista.push(payload)
  }

  showAlunoForm.value = false
  resetAlunoForm()
}

function editAluno (aluno) {
  Object.assign(alunoForm, {
    id: aluno.id,
    name: aluno.nome,
    faixa: aluno.faixa,
    plan: aluno.plano,
    perfilTreino: aluno.perfilTreino
  })
  isEditing.value = true
  showAlunoForm.value = true
}

function cancelAlunoForm () {
  showAlunoForm.value = false
  resetAlunoForm()
}

function deleteAluno (id) {
  if (
    confirm(
      'Tem certeza que deseja remover este aluno? O acesso dele à área do aluno será revogado.'
    )
  ) {
    const idx = alunosStore.lista.findIndex((a) => a.id === id)
    if (idx !== -1) alunosStore.lista.splice(idx, 1)
  }
}

/* =======================
   EVENTOS
   ======================= */

const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const eventForm = reactive({
  id: null,
  day: '',
  month: '',
  title: '',
  info: ''
})

function prepareCreateEvent () {
  Object.assign(eventForm, {
    id: null,
    day: '',
    month: '',
    title: '',
    info: ''
  })
  isEditing.value = false
  showEventForm.value = true
}

function editEvent (ev) {
  Object.assign(eventForm, { ...ev })
  isEditing.value = true
  showEventForm.value = true
}

function saveEvent () {
  if (isEditing.value && eventForm.id != null) {
    eventStore.updateEvent({ ...eventForm })
  } else {
    eventStore.addEvent({ ...eventForm })
  }
  showEventForm.value = false
}

function cancelEventForm () {
  showEventForm.value = false
}

function deleteEvent (id) {
  if (confirm('Excluir este evento?')) {
    eventStore.removeEvent(id)
  }
}

/* =======================
   BLOG
   ======================= */

const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const blogForm = reactive({
  id: null,
  title: '',
  excerpt: '',
  image: ''
})

function prepareCreatePost () {
  Object.assign(blogForm, {
    id: null,
    title: '',
    excerpt: '',
    image: ''
  })
  isEditing.value = false
  showBlogForm.value = true
}

function editPost (post) {
  Object.assign(blogForm, { ...post })
  isEditing.value = true
  showBlogForm.value = true
}

function savePost () {
  if (isEditing.value && blogForm.id != null) {
    blogStore.updateBlogPost({ ...blogForm })
  } else {
    blogStore.addBlogPost({ ...blogForm })
  }
  showBlogForm.value = false
}

function cancelBlogForm () {
  showBlogForm.value = false
}

function deletePost (id) {
  if (confirm('Excluir este post do blog?')) {
    blogStore.removeBlogPost(id)
  }
}
</script>

<style scoped>
.admin-header {
  background: var(--primary-navy);
  color: white;
  padding: 30px 0;
  margin-bottom: 30px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 30px;
  min-height: 600px;
}

.btn-logout {
  float: right;
  background: #ef4444;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Menu */
.admin-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-menu button {
  text-align: left;
  padding: 12px 16px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: #475569;
}

.admin-menu button.active {
  background: var(--accent-blue);
  color: white;
}

/* Content */
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 15px;
}

.header-action .sub {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #6b7280;
}

.btn-add {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
}

/* Form */
.form-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #cbd5e1;
  margin-bottom: 20px;
}

.form-card input,
.form-card select,
.form-card textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  font-size: 0.95rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.input-small {
  width: 100px !important;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.btn-save {
  background: var(--accent-blue);
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.btn-cancel {
  background: #94a3b8;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.preview-login {
  font-size: 13px;
  color: #64748b;
  background: #e2e8f0;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* Lists */
.admin-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.admin-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.item-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
}

.btn-delete.small {
  font-size: 12px;
  padding: 4px 8px;
}

.btn-link {
  background: transparent;
  border: none;
  color: var(--accent-blue);
  cursor: pointer;
  padding: 0;
}

.btn-link.small {
  font-size: 12px;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 14px;
}

.muted {
  color: #9ca3af;
  font-size: 0.85rem;
}

/* Tabela de Alunos */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
}

.mono {
  font-family: monospace;
  color: var(--accent-blue);
  font-weight: bold;
}

.badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.bullet {
  margin-top: 8px;
  padding-left: 20px;
}

.bullet li {
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .header-action {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
