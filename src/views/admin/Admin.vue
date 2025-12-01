<template>
  <main class="admin-view">
    <header class="admin-header">
      <div class="container header-inner">
        <div>
          <h1>Painel Administrativo</h1>
          <p>Bem-vindo, Mestre. Gerencie sua academia aqui.</p>
        </div>
        <button @click="logout" class="btn-logout">Sair</button>
      </div>
    </header>

    <div class="container layout">

      <aside class="admin-menu">
        <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">
          📅 Eventos
        </button>
        <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">
          ✍️ Blog
        </button>
        <button :class="{ active: currentTab === 'horarios' }" @click="currentTab = 'horarios'">
          ⏰ Horários
        </button>
        <button :class="{ active: currentTab === 'alunos' }" @click="currentTab = 'alunos'">
          🥋 Alunos
        </button>
      </aside>

      <section class="admin-content">

        <div v-if="currentTab === 'eventos'">
          <div class="header-action">
            <h2>Gerenciar Eventos</h2>
            <button class="btn-add" @click="prepareCreateEvent">+ Novo Evento</button>
          </div>

          <div v-if="showEventForm" class="form-card">
            <h3>{{ isEditingEvent ? 'Editar Evento' : 'Novo Evento' }}</h3>
            <form @submit.prevent="saveEvent">
              <div class="row">
                <input v-model="eventForm.day" placeholder="Dia (15)" required class="input-small" maxlength="2" />
                <input v-model="eventForm.month" placeholder="Mês (DEZ)" required class="input-small" maxlength="3" />
              </div>
              <input v-model="eventForm.title" placeholder="Título do Evento" required />
              <input v-model="eventForm.info" placeholder="Informações (horário, local)" required />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="cancelEventForm">Cancelar</button>
              </div>
            </form>
          </div>

          <ul class="admin-list">
            <li v-for="ev in events" :key="ev.id">
              <div class="item-info">
                <strong>{{ ev.day }}/{{ ev.month }}</strong> - {{ ev.title }}<br />
                <small>{{ ev.info }}</small>
              </div>
              <div class="item-actions">
                <button class="btn-edit" @click="prepareEditEvent(ev)">Editar</button>
                <button class="btn-delete" @click="deleteEvent(ev.id)">Excluir</button>
              </div>
            </li>
          </ul>
          <p class="hint">O site exibe automaticamente os eventos mais recentes na home e no blog.</p>
        </div>

        <div v-if="currentTab === 'blog'">
          <div class="header-action">
            <h2>Gerenciar Blog</h2>
            <button class="btn-add" @click="prepareCreatePost">+ Novo Post</button>
          </div>

          <div v-if="showBlogForm" class="form-card">
            <h3>{{ isEditingPost ? 'Editar Post' : 'Novo Post' }}</h3>
            <form @submit.prevent="savePost">
              <input v-model="blogForm.title" placeholder="Título da postagem" required />
              <textarea
                v-model="blogForm.excerpt"
                placeholder="Resumo da postagem"
                rows="3"
                required
              ></textarea>
              <input v-model="blogForm.image" placeholder="URL da imagem (https://...)" required />

              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="cancelBlogForm">Cancelar</button>
              </div>
            </form>
          </div>

          <ul class="admin-list">
            <li v-for="post in posts" :key="post.id">
              <div class="item-thumb" v-if="post.image">
                <img :src="post.image" alt="Thumb" />
              </div>
              <div class="item-info">
                <strong>{{ post.title }}</strong><br />
                <small>{{ truncate(post.excerpt, 60) }}</small>
              </div>
              <div class="item-actions">
                <button class="btn-edit" @click="prepareEditPost(post)">Editar</button>
                <button class="btn-delete" @click="deletePost(post.id)">Excluir</button>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="currentTab === 'horarios'">
          <div class="header-action">
            <h2>Grade de Horários</h2>
          </div>
          <p class="muted">
            Use o <strong>scheduleStore</strong> para adicionar/editar horários.  
            Nesta versão, a edição é feita diretamente pelos dados da store (mock).
          </p>
          <p class="muted">
            A tela pública de “Horários de Aulas” já consome esses dados e exibe por modalidade/dia.
          </p>
        </div>

        <div v-if="currentTab === 'alunos'">
          <div class="header-action">
            <h2>Gerenciar Alunos</h2>
            <button class="btn-add" @click="showAlunoForm = true">+ Matricular Aluno</button>
          </div>

          <div v-if="showAlunoForm" class="form-card">
            <h3>{{ isEditingAluno ? 'Editar Aluno' : 'Novo Aluno' }}</h3>
            <form @submit.prevent="saveAluno">
              <input v-model="alunoForm.name" placeholder="Nome Completo" required />
              <select v-model="alunoForm.plan" required>
                <option value="" disabled>Selecione o Plano</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Anual">Anual</option>
                <option value="Kids">Kids</option>
              </select>

              <p class="preview-login" v-if="alunoForm.name">
                Login será:
                <strong>lf.{{ alunoForm.name.toLowerCase().replace(/\s+/g, '') }}</strong><br />
                Senha padrão: <strong>123</strong>
              </p>

              <div class="form-actions">
                <button type="submit" class="btn-save">
                  {{ isEditingAluno ? 'Salvar alterações' : 'Matricular' }}
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

          <table class="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Plano</th>
                <th class="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunos" :key="aluno.id">
                <td>{{ aluno.name }}</td>
                <td class="mono">{{ aluno.username }}</td>
                <td><span class="badge">{{ aluno.plan }}</span></td>
                <td class="td-actions">
                  <button class="btn-edit small" @click="editAluno(aluno)">Editar</button>
                  <button
                    class="btn-delete small"
                    @click="deleteAluno(aluno.id)"
                  >
                    Remover
                  </button>
                </td>
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

function logout() {
  authStore.logout()
  router.push('/admin/login')
}

const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const isEditingEvent = ref(false)
const eventForm = reactive({ id: null, day: '', month: '', title: '', info: '' })

function prepareCreateEvent() {
  isEditingEvent.value = false
  Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' })
  showEventForm.value = true
}
function prepareEditEvent(ev) {
  isEditingEvent.value = true
  Object.assign(eventForm, ev)
  showEventForm.value = true
}
function saveEvent() {
  if (isEditingEvent.value) {
    eventStore.updateEvent({ ...eventForm })
  } else {
    eventStore.addEvent({ ...eventForm })
  }
  showEventForm.value = false
}
function cancelEventForm() {
  showEventForm.value = false
}
function deleteEvent(id) {
  if (confirm('Tem certeza que deseja excluir este evento?')) {
    eventStore.removeEvent(id)
  }
}

const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const isEditingPost = ref(false)
const blogForm = reactive({ id: null, title: '', excerpt: '', image: '' })

function prepareCreatePost() {
  isEditingPost.value = false
  Object.assign(blogForm, { id: null, title: '', excerpt: '', image: '' })
  showBlogForm.value = true
}
function prepareEditPost(post) {
  isEditingPost.value = true
  Object.assign(blogForm, post)
  showBlogForm.value = true
}
function savePost() {
  if (isEditingPost.value) {
    blogStore.updateBlogPost({ ...blogForm })
  } else {
    blogStore.addBlogPost({ ...blogForm })
  }
  showBlogForm.value = false
}
function cancelBlogForm() {
  showBlogForm.value = false
}
function deletePost(id) {
  if (confirm('Excluir esta postagem?')) {
    blogStore.removeBlogPost(id)
  }
}
function truncate(text, len) {
  return text.length > len ? text.substring(0, len) + '...' : text
}

const alunos = computed(() => alunosStore.list)
const showAlunoForm = ref(false)
const isEditingAluno = ref(false)
const alunoForm = reactive({ id: null, name: '', plan: '' })

function saveAluno() {
  if (isEditingAluno.value) {
    alunosStore.updateAluno({ ...alunoForm })
  } else {
    alunosStore.addAluno({ ...alunoForm })
  }
  showAlunoForm.value = false
  isEditingAluno.value = false
  alunoForm.id = null
  alunoForm.name = ''
  alunoForm.plan = ''
}
function cancelAlunoForm() {
  showAlunoForm.value = false
  isEditingAluno.value = false
}
function editAluno(aluno) {
  isEditingAluno.value = true
  showAlunoForm.value = true
  Object.assign(alunoForm, aluno)
}
function deleteAluno(id) {
  if (confirm('Tem certeza que deseja remover este aluno? O acesso dele será revogado.')) {
    alunosStore.removeAluno(id)
  }
}
</script>

<style scoped>
.admin-header {
  background: var(--primary-navy, #020617);
  color: white;
  padding: 26px 0;
  margin-bottom: 26px;
}
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 18px;
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  min-height: 560px;
}
.btn-logout {
  background: #ef4444;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.admin-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.admin-menu button {
  text-align: left;
  padding: 10px 16px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  color: #9ca3af;
  font-size: 14px;
}
.admin-menu button.active {
  background: #1d4ed8;
  color: white;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.45);
}

.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}
.btn-add {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.form-card {
  background: #f8fafc;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  margin-bottom: 20px;
}
.form-card input,
.form-card textarea,
.form-card select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 9px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
}
.row {
  display: flex;
  gap: 8px;
}
.input-small {
  width: 100px !important;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.btn-save {
  background: #1d4ed8;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}
.btn-cancel {
  background: #94a3b8;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

.admin-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.admin-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
}
.item-thumb img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 12px;
}
.item-info {
  flex: 1;
}
.item-actions {
  display: flex;
  gap: 8px;
}
.btn-edit,
.btn-delete {
  border: none;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
}
.btn-edit {
  background: #f59e0b;
  color: white;
}
.btn-delete {
  background: #ef4444;
  color: white;
}
.btn-edit.small,
.btn-delete.small {
  padding: 4px 8px;
}

.hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
  font-style: italic;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-top: 10px;
}
.data-table th,
.data-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}
.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
}
.th-actions,
.td-actions {
  text-align: right;
}
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: #1d4ed8;
}
.badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.preview-login {
  font-size: 13px;
  color: #64748b;
  background: #e5e7eb;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .admin-menu {
    flex-direction: row;
    overflow-x: auto;
  }
}
</style>
