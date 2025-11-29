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
      <aside class="admin-menu" aria-label="Menu administrativo">
        <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">📅 Eventos</button>
        <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">✍️ Blog</button>
        <button :class="{ active: currentTab === 'horarios' }" @click="currentTab = 'horarios'">⏰ Horários</button>
        <button :class="{ active: currentTab === 'alunos' }" @click="currentTab = 'alunos'">🥋 Alunos</button>
      </aside>

      <section class="admin-content">

        <div v-if="currentTab === 'eventos'">
          <div class="header-action">
            <h2>Gerenciar Eventos</h2>
            <button class="btn-add" @click="prepareCreateEvent">+ Novo Evento</button>
          </div>
          <div v-if="showEventForm" class="form-card">
            <h3>{{ eventForm.id ? 'Editar evento' : 'Novo evento' }}</h3>
            <form @submit.prevent="saveEvent">
              <div class="row">
                <input v-model="eventForm.day" placeholder="Dia" required class="input-small" />
                <input v-model="eventForm.month" placeholder="Mês" required class="input-small" />
              </div>
              <input v-model="eventForm.title" placeholder="Título" required />
              <input v-model="eventForm.info" placeholder="Infos" required />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="showEventForm = false">Cancelar</button>
              </div>
            </form>
          </div>
          <ul class="admin-list">
            <li v-for="ev in events" :key="ev.id">
              <div><strong>{{ ev.day }}/{{ ev.month }}</strong> - {{ ev.title }}</div>
              <div class="item-actions">
                <button class="btn-link" @click="editEvent(ev)">Editar</button>
                <button class="btn-delete" @click="deleteEvent(ev.id)">Excluir</button>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="currentTab === 'blog'">
          <div class="header-action">
            <h2>Gerenciar Blog</h2>
            <button class="btn-add" @click="prepareCreatePost">+ Novo Post</button>
          </div>
          <div v-if="showBlogForm" class="form-card">
            <h3>{{ blogForm.id ? 'Editar post' : 'Novo post' }}</h3>
            <form @submit.prevent="savePost">
              <input v-model="blogForm.title" placeholder="Título" required />
              <textarea v-model="blogForm.excerpt" placeholder="Resumo" rows="3"></textarea>
              <input v-model="blogForm.image" placeholder="URL da Imagem" />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="showBlogForm = false">Cancelar</button>
              </div>
            </form>
          </div>
          <ul class="admin-list">
            <li v-for="p in posts" :key="p.id">
              <div><strong>{{ p.title }}</strong></div>
              <div class="item-actions">
                <button class="btn-link" @click="editPost(p)">Editar</button>
                <button class="btn-delete" @click="deletePost(p.id)">Excluir</button>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="currentTab === 'horarios'">
          <div class="header-action">
            <div>
              <h2>Grade de Horários</h2>
              <p class="sub">Adicione, edite ou remova horários da grade oficial.</p>
            </div>
            <button class="btn-add" @click="prepareCreateSchedule">+ Novo Horário</button>
          </div>

          <div v-if="showScheduleForm" class="form-card">
            <h3>{{ scheduleForm.id ? 'Editar Horário' : 'Novo Horário' }}</h3>
            <form @submit.prevent="saveSchedule">
              <div class="row">
                <select v-model="scheduleForm.day" required>
                  <option disabled value="">Dia da Semana</option>
                  <option>Segunda-feira</option>
                  <option>Terça-feira</option>
                  <option>Quarta-feira</option>
                  <option>Quinta-feira</option>
                  <option>Sexta-feira</option>
                  <option>Sábado</option>
                  <option>Domingo</option>
                </select>
                <input v-model="scheduleForm.time" type="time" required class="input-small" />
              </div>
              <input v-model="scheduleForm.modality" placeholder="Modalidade (Ex: Adulto, Kids, Feminino)" required />
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="cancelScheduleForm">Cancelar</button>
              </div>
            </form>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th>Modalidade</th>
                <th style="width: 140px">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cls in sortedSchedules" :key="cls.id">
                <td>{{ cls.day }}</td>
                <td class="mono">{{ cls.time }}</td>
                <td><span class="badge">{{ cls.modality }}</span></td>
                <td class="td-actions">
                  <button class="btn-link small" @click="editSchedule(cls)">Editar</button>
                  <button class="btn-delete small" @click="deleteSchedule(cls.id)">Remover</button>
                </td>
              </tr>
              <tr v-if="!sortedSchedules.length">
                <td colspan="4" class="empty">Nenhum horário cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="currentTab === 'alunos'">
          <div class="header-action">
            <h2>Gerenciar Alunos</h2>
            <button class="btn-add" @click="openAlunoForm">+ Matricular</button>
          </div>
          <div v-if="showAlunoForm" class="form-card">
            <h3>{{ alunoForm.id ? 'Editar' : 'Novo' }} Aluno</h3>
            <form @submit.prevent="saveAluno">
              <input v-model="alunoForm.name" placeholder="Nome" required />
              <div class="row">
                <select v-model="alunoForm.faixa">
                  <option>Branca</option>
                  <option>Azul</option>
                  <option>Roxa</option>
                </select>
                <select v-model="alunoForm.plan">
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
                <select v-model="alunoForm.perfilTreino">
                  <option value="adulto">Adulto</option>
                  <option value="kids">Kids</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-save">Salvar</button>
                <button type="button" class="btn-cancel" @click="showAlunoForm = false">Cancelar</button>
              </div>
            </form>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Faixa</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunos" :key="aluno.id">
                <td>{{ aluno.nome }}</td>
                <td class="mono">{{ aluno.login }}</td>
                <td>{{ aluno.faixa }}</td>
                <td>
                  <button class="btn-link small" @click="editAluno(aluno)">Editar</button>
                  <button class="btn-delete small" @click="deleteAluno(aluno.id)">X</button>
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
import { scheduleStore } from '@/store/scheduleStore'
import { alunosStore } from '@/store/alunosStore'

const router = useRouter()
const currentTab = ref('horarios')

function logout() { authStore.logout(); router.push('/admin/login') }

// --- HORÁRIOS ---
const sortedSchedules = computed(() => scheduleStore.sortedClasses)
const showScheduleForm = ref(false)
const scheduleForm = reactive({ id: null, day: '', time: '', modality: '' })

function prepareCreateSchedule() { Object.assign(scheduleForm, { id: null, day: '', time: '', modality: '' }); showScheduleForm.value = true }
function editSchedule(cls) { Object.assign(scheduleForm, { ...cls }); showScheduleForm.value = true }
function saveSchedule() {
  if (scheduleForm.id) scheduleStore.updateClass({ ...scheduleForm })
  else scheduleStore.addClass({ ...scheduleForm })
  showScheduleForm.value = false
}
function deleteSchedule(id) { if (confirm('Remover horário?')) scheduleStore.removeClass(id) }
function cancelScheduleForm() { showScheduleForm.value = false }

// --- EVENTOS ---
const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const eventForm = reactive({})
function prepareCreateEvent() { Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' }); showEventForm.value = true }
function editEvent(ev) { Object.assign(eventForm, ev); showEventForm.value = true }
function saveEvent() { if (eventForm.id) eventStore.updateEvent({ ...eventForm }); else eventStore.addEvent({ ...eventForm }); showEventForm.value = false }
function deleteEvent(id) { if (confirm('Apagar?')) eventStore.removeEvent(id) }

// --- BLOG ---
const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const blogForm = reactive({})
function prepareCreatePost() { Object.assign(blogForm, { id: null, title: '', excerpt: '', image: '' }); showBlogForm.value = true }
function editPost(p) { Object.assign(blogForm, p); showBlogForm.value = true }
function savePost() { if (blogForm.id) blogStore.updateBlogPost({ ...blogForm }); else blogStore.addBlogPost({ ...blogForm }); showBlogForm.value = false }
function deletePost(id) { if (confirm('Apagar?')) blogStore.removeBlogPost(id) }

// --- ALUNOS ---
const alunos = computed(() => alunosStore.lista)
const showAlunoForm = ref(false)
const alunoForm = reactive({})
const gerarUsername = (n) => 'lf.' + (n || '').toLowerCase().replace(/\s/g, '')

function openAlunoForm() { Object.assign(alunoForm, { id: null, name: '', faixa: '', plan: '', perfilTreino: '' }); showAlunoForm.value = true }
function editAluno(a) {
  // Mapeia 'nome' (do banco) para 'name' (do formulário)
  Object.assign(alunoForm, { id: a.id, name: a.nome, faixa: a.faixa, plan: a.plano, perfilTreino: a.perfilTreino })
  showAlunoForm.value = true
}
function saveAluno() {
  const p = {
    ...alunoForm,
    id: alunoForm.id || Date.now(),
    nome: alunoForm.name, // Salva como 'nome'
    login: gerarUsername(alunoForm.name),
    faixa: alunoForm.faixa,
    plano: alunoForm.plan,
    perfilTreino: alunoForm.perfilTreino
  }
  if (alunoForm.id) {
    const i = alunosStore.lista.findIndex(x => x.id === p.id);
    alunosStore.lista[i] = p
  } else {
    alunosStore.lista.push(p)
  }
  showAlunoForm.value = false
}
function deleteAluno(id) { if (confirm('Remover aluno?')) { const i = alunosStore.lista.findIndex(x => x.id === id); alunosStore.lista.splice(i, 1) } }
</script>

<style scoped>
.admin-header {
  background: var(--primary-navy, #020617);
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
  background: #3b82f6;
  color: white;
}

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

.form-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
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
  border-radius: 8px;
}

.row {
  display: flex;
  gap: 10px;
}

.input-small {
  width: 150px !important;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.btn-save {
  background: #3b82f6;
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

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
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

.td-actions {
  text-align: right;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
}

.btn-link {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 0 10px;
  font-size: 12px;
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

.mono {
  font-family: monospace;
  font-weight: bold;
  color: #3b82f6;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .row {
    flex-direction: column;
  }

  .input-small {
    width: 100% !important;
  }
}
</style>