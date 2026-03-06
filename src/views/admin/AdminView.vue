<template>
  <main class="admin-view">
    <header class="admin-header">
      <div class="container header-inner">
        <div class="header-titles">
          <h1>Painel Administrativo</h1>
          <p>Bem-vindo, Mestre. Gerencie sua academia e seus alunos.</p>
        </div>
        <button @click="logout" class="btn btn-danger btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sair
        </button>
      </div>
    </header>

    <div class="container layout">
      <aside class="admin-menu">
        <nav>
          <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">
            <span class="icon">📅</span> Eventos
          </button>
          <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">
            <span class="icon">✍️</span> Blog
          </button>
          <button :class="{ active: currentTab === 'horarios' }" @click="currentTab = 'horarios'">
            <span class="icon">⏰</span> Horários
          </button>
          <button :class="{ active: currentTab === 'alunos' }" @click="currentTab = 'alunos'">
            <span class="icon">🥋</span> Alunos
          </button>
        </nav>
      </aside>

      <section class="admin-content">

        <div v-if="currentTab === 'eventos'" class="fade-in">
          <div class="header-action">
            <div>
              <h2>Eventos Oficiais</h2>
              <p class="sub">Gerencie os seminários e campeonatos da equipe.</p>
            </div>
            <button class="btn btn-success" @click="prepareCreateEvent">+ Novo Evento</button>
          </div>

          <div v-if="showEventForm" class="form-card">
            <h3>{{ isEditingEvent ? 'Editar Evento' : 'Novo Evento' }}</h3>
            <form @submit.prevent="saveEvent">
              <div class="form-grid">
                <div class="form-group">
                  <label>Dia (Ex: 15)</label>
                  <input v-model="eventForm.day" required maxlength="2" />
                </div>
                <div class="form-group">
                  <label>Mês (Ex: DEZ)</label>
                  <input v-model="eventForm.month" required maxlength="3" />
                </div>
              </div>
              <div class="form-group">
                <label>Título do Evento</label>
                <input v-model="eventForm.title" required />
              </div>
              <div class="form-group">
                <label>Informações (Local, Horário)</label>
                <input v-model="eventForm.info" required />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Salvar Evento</button>
                <button type="button" class="btn btn-secondary" @click="cancelEventForm">Cancelar</button>
              </div>
            </form>
          </div>

          <div class="table-container">
            <ul class="admin-list">
              <li v-for="ev in events" :key="ev.id">
                <div class="item-info">
                  <span class="date-badge">{{ ev.day }}/{{ ev.month }}</span>
                  <div class="item-text">
                    <strong>{{ ev.title }}</strong>
                    <small>{{ ev.info }}</small>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-warning btn-sm" @click="prepareEditEvent(ev)">Editar</button>
                  <button class="btn btn-danger btn-sm" @click="deleteEvent(ev.id)">Remover</button>
                </div>
              </li>
              <li v-if="events.length === 0" class="empty-state">Nenhum evento cadastrado.</li>
            </ul>
          </div>
        </div>

        <div v-if="currentTab === 'blog'" class="fade-in">
          <div class="header-action">
            <div>
              <h2>Blog e Notícias</h2>
              <p class="sub">Publique avisos e técnicas para os alunos.</p>
            </div>
            <button class="btn btn-success" @click="prepareCreatePost">+ Novo Post</button>
          </div>

          <div v-if="showBlogForm" class="form-card">
            <h3>{{ isEditingPost ? 'Editar Post' : 'Novo Post' }}</h3>
            <form @submit.prevent="savePost">
              <div class="form-group">
                <label>Título da Postagem</label>
                <input v-model="blogForm.title" required />
              </div>
              <div class="form-group">
                <label>Resumo</label>
                <textarea v-model="blogForm.excerpt" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label>URL da Imagem (Link)</label>
                <input v-model="blogForm.image" required />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Publicar</button>
                <button type="button" class="btn btn-secondary" @click="cancelBlogForm">Cancelar</button>
              </div>
            </form>
          </div>

          <div class="table-container">
            <ul class="admin-list">
              <li v-for="post in posts" :key="post.id">
                <div class="item-info">
                  <div class="item-thumb" v-if="post.image">
                    <img :src="post.image" alt="Capa" />
                  </div>
                  <div class="item-text">
                    <strong>{{ post.title }}</strong>
                    <small>{{ truncate(post.excerpt, 80) }}</small>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="btn btn-warning btn-sm" @click="prepareEditPost(post)">Editar</button>
                  <button class="btn btn-danger btn-sm" @click="deletePost(post.id)">Excluir</button>
                </div>
              </li>
              <li v-if="posts.length === 0" class="empty-state">Nenhuma postagem publicada.</li>
            </ul>
          </div>
        </div>

        <div v-if="currentTab === 'horarios'" class="fade-in">
          <div class="header-action">
            <div>
              <h2>Grade de Horários</h2>
              <p class="sub">Gerencie as turmas ativas integradas ao banco de dados.</p>
            </div>
            <button class="btn btn-success" @click="prepareCreateSchedule">+ Novo Horário</button>
          </div>

          <div v-if="showScheduleForm" class="form-card">
            <h3>{{ scheduleForm.id ? 'Editar Horário' : 'Novo Horário' }}</h3>
            <form @submit.prevent="saveSchedule">
              <div class="form-grid">
                <div class="form-group">
                  <label>Dia da Semana</label>
                  <select v-model="scheduleForm.day" required>
                    <option disabled value="">Selecione o Dia</option>
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Terça-feira">Terça-feira</option>
                    <option value="Quarta-feira">Quarta-feira</option>
                    <option value="Quinta-feira">Quinta-feira</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Horário</label>
                  <input v-model="scheduleForm.time" type="time" required />
                </div>
              </div>
              <div class="form-group">
                <label>Modalidade da Turma</label>
                <input v-model="scheduleForm.modality" placeholder="Ex: Adulto Iniciante, Kids, Feminino" required />
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Salvar Horário</button>
                <button type="button" class="btn btn-secondary" @click="cancelScheduleForm">Cancelar</button>
              </div>
            </form>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Dia da Semana</th>
                  <th>Horário</th>
                  <th>Modalidade</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cls in sortedSchedules" :key="cls.id">
                  <td class="font-medium">{{ cls.day }}</td>
                  <td class="mono">{{ cls.time }}</td>
                  <td><span class="badge badge-blue">{{ cls.modality }}</span></td>
                  <td class="td-actions">
                    <button class="btn btn-warning btn-sm" @click="editSchedule(cls)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="deleteSchedule(cls.id)">Remover</button>
                  </td>
                </tr>
                <tr v-if="!sortedSchedules.length">
                  <td colspan="4" class="empty-state">Nenhum horário cadastrado no sistema.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="currentTab === 'alunos'" class="fade-in">
          <div class="header-action">
            <div>
              <h2>Matrículas e Alunos</h2>
              <p class="sub">Gestão completa de acessos e graduações.</p>
            </div>
            <button class="btn btn-success" @click="openAlunoForm">+ Matricular Aluno</button>
          </div>

          <div v-if="showAlunoForm" class="form-card">
            <h3>{{ isEditingAluno ? 'Editar Dados do Aluno' : 'Nova Matrícula' }}</h3>
            <form @submit.prevent="saveAluno">
              
              <div class="form-group">
                <label>Nome Completo</label>
                <input v-model="alunoForm.name" placeholder="Ex: Rickson Gracie" required />
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>Graduação (Faixa)</label>
                  <select v-model="alunoForm.faixa" required>
                    <option value="" disabled>Selecione a Faixa</option>
                    <option value="Branca">Branca</option>
                    <option value="Azul">Azul</option>
                    <option value="Roxa">Roxa</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Preta">Preta</option>
                    <option value="Coral">Coral</option>
                    <option value="Vermelha">Vermelha</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Telefone / WhatsApp</label>
                  <input v-model="alunoForm.telefone" placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div class="preview-alert" v-if="alunoForm.name && !isEditingAluno">
                <div class="alert-icon">ℹ️</div>
                <div class="alert-content">
                  <strong>Credenciais geradas automaticamente:</strong><br/>
                  <span>Login: <b>lf.{{ alunoForm.name.toLowerCase().replace(/\s+/g, '') }}@lf.com</b></span><br/>
                  <span>Senha provisória: <b>123</b></span>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  {{ isEditingAluno ? 'Salvar Alterações' : 'Confirmar Matrícula' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="cancelAlunoForm">Cancelar</button>
              </div>
            </form>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nome do Aluno</th>
                  <th>Login de Acesso</th>
                  <th>Faixa</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in alunosApiList" :key="aluno.id">
                  <td class="font-medium">{{ aluno.name }}</td>
                  <td class="mono text-muted">{{ aluno.username }}</td>
                  <td><span :class="['badge', getBadgeColor(aluno.faixa)]">{{ aluno.faixa }}</span></td>
                  <td class="td-actions">
                    <button class="btn btn-warning btn-sm" @click="editAluno(aluno)">Editar</button>
                    <button class="btn btn-danger btn-sm" @click="deleteAluno(aluno.id)">Remover</button>
                  </td>
                </tr>
                <tr v-if="alunosApiList.length === 0">
                  <td colspan="4" class="empty-state">Nenhum aluno cadastrado no banco de dados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { authStore } from '@/store/authStore'
import { eventStore } from '@/store/eventStore'
import { blogStore } from '@/store/blogStore'

const router = useRouter()
const currentTab = ref('alunos')
const API_BASE_URL = 'http://localhost:8081'

function logout() {
  authStore.logout()
  router.push('/admin/login')
}

// Funções utilitárias para UI
function getBadgeColor(faixa) {
  const f = (faixa || '').toLowerCase();
  if (f.includes('azul')) return 'badge-blue';
  if (f.includes('roxa')) return 'badge-purple';
  if (f.includes('marrom')) return 'badge-brown';
  if (f.includes('preta') || f.includes('coral') || f.includes('vermelha')) return 'badge-dark';
  return 'badge-light'; // Branca padrão
}

// ==============================================
// EVENTOS
// ==============================================
const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const isEditingEvent = ref(false)
const eventForm = reactive({ id: null, day: '', month: '', title: '', info: '' })

function prepareCreateEvent() { isEditingEvent.value = false; Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' }); showEventForm.value = true }
function prepareEditEvent(ev) { isEditingEvent.value = true; Object.assign(eventForm, ev); showEventForm.value = true }
function saveEvent() { isEditingEvent.value ? eventStore.updateEvent({ ...eventForm }) : eventStore.addEvent({ ...eventForm }); showEventForm.value = false }
function cancelEventForm() { showEventForm.value = false }
function deleteEvent(id) { if (confirm('Excluir evento?')) eventStore.removeEvent(id) }

// ==============================================
// BLOG
// ==============================================
const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const isEditingPost = ref(false)
const blogForm = reactive({ id: null, title: '', excerpt: '', image: '' })

function prepareCreatePost() { isEditingPost.value = false; Object.assign(blogForm, { id: null, title: '', excerpt: '', image: '' }); showBlogForm.value = true }
function prepareEditPost(post) { isEditingPost.value = true; Object.assign(blogForm, post); showBlogForm.value = true }
function savePost() { isEditingPost.value ? blogStore.updateBlogPost({ ...blogForm }) : blogStore.addBlogPost({ ...blogForm }); showBlogForm.value = false }
function cancelBlogForm() { showBlogForm.value = false }
function deletePost(id) { if (confirm('Excluir post?')) blogStore.removeBlogPost(id) }
function truncate(text, len) { return text.length > len ? text.substring(0, len) + '...' : text }

// ==============================================
// HORÁRIOS / TURMAS
// ==============================================
const sortedSchedules = ref([])
const showScheduleForm = ref(false)
const scheduleForm = reactive({ id: null, day: '', time: '', modality: '' })

async function carregarTurmas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/turmas`)
    sortedSchedules.value = response.data.map(t => ({
      id: t.id,
      day: t.diasSemana,
      time: t.horarioInicio ? t.horarioInicio.substring(0, 5) : '', 
      modality: t.nivel || t.modalidade?.nome || 'Geral'
    }))
  } catch (error) { console.error("Erro ao buscar turmas:", error) }
}

function prepareCreateSchedule() { Object.assign(scheduleForm, { id: null, day: '', time: '', modality: '' }); showScheduleForm.value = true }
function editSchedule(cls) { Object.assign(scheduleForm, cls); showScheduleForm.value = true }
async function saveSchedule() {
  try {
    const payload = { nome: scheduleForm.modality, nivel: scheduleForm.modality, diasSemana: scheduleForm.day, horarioInicio: scheduleForm.time + ":00", horarioFim: "23:59:00", instrutorId: 1, modalidadeId: 1 }
    scheduleForm.id ? await axios.put(`${API_BASE_URL}/turmas/${scheduleForm.id}`, payload) : await axios.post(`${API_BASE_URL}/turmas`, payload)
    showScheduleForm.value = false; await carregarTurmas()
  } catch (error) { alert("Erro ao salvar horário. Verifique se o Instrutor ID 1 e Modalidade ID 1 existem no banco.") }
}
async function deleteSchedule(id) { if (confirm('Remover horário permanentemente?')) { await axios.delete(`${API_BASE_URL}/turmas/${id}`); await carregarTurmas() } }
function cancelScheduleForm() { showScheduleForm.value = false }

// ==============================================
// ALUNOS
// ==============================================
const alunosApiList = ref([])
const showAlunoForm = ref(false)
const isEditingAluno = ref(false)
const alunoForm = reactive({ id: null, name: '', faixa: '', telefone: '', objetivo: '' })

async function carregarAlunos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/alunos`)
    alunosApiList.value = response.data.map(a => ({
      id: a.id, name: a.nome,
      username: a.usuario?.email || `lf.${a.nome.toLowerCase().replace(/\s+/g, '')}@lf.com`,
      faixa: a.faixaAtual || 'Branca', telefone: a.telefone || '', objetivo: a.objetivo || ''
    }))
  } catch (error) { console.error("Erro ao buscar alunos:", error) }
}

function openAlunoForm() { isEditingAluno.value = false; Object.assign(alunoForm, { id: null, name: '', faixa: '', telefone: '', objetivo: '' }); showAlunoForm.value = true }
function editAluno(aluno) { isEditingAluno.value = true; Object.assign(alunoForm, aluno); showAlunoForm.value = true }
async function saveAluno() {
  try {
    if (isEditingAluno.value) {
      await axios.put(`${API_BASE_URL}/alunos/${alunoForm.id}`, { nome: alunoForm.name, faixa: alunoForm.faixa, telefone: alunoForm.telefone, objetivo: alunoForm.objetivo })
    } else {
      await axios.post(`${API_BASE_URL}/alunos`, { nome: alunoForm.name, email: `lf.${alunoForm.name.toLowerCase().replace(/\s+/g, '')}@lf.com`, senha: '123', faixa: alunoForm.faixa, telefone: alunoForm.telefone, objetivo: 'Treinar Jiu-Jitsu' })
    }
    showAlunoForm.value = false; await carregarAlunos()
  } catch (error) { alert("Erro ao salvar os dados do aluno.") }
}
async function deleteAluno(id) { if (confirm('Tem certeza que deseja apagar este aluno do banco de dados? A ação não pode ser desfeita.')) { await axios.delete(`${API_BASE_URL}/alunos/${id}`); await carregarAlunos() } }
function cancelAlunoForm() { showAlunoForm.value = false }

onMounted(() => { carregarAlunos(); carregarTurmas() })
</script>

<style scoped>
/* =========================================
   VARIÁVEIS DE COR E TEMA
========================================= */
.admin-view {
  --bg-app: #f1f5f9;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --success: #10b981;
  --success-hover: #059669;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --warning: #f59e0b;
  --warning-hover: #d97706;
  
  --dark-navy: #020617;
  --sidebar-bg: #0f172a;
  --sidebar-active: #1e293b;
  
  background-color: var(--bg-app);
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-main);
  padding-bottom: 40px;
}

/* =========================================
   ESTRUTURA GLOBAL
========================================= */
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.layout { display: grid; grid-template-columns: 250px 1fr; gap: 30px; margin-top: -30px; }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* =========================================
   HEADER
========================================= */
.admin-header {
  background: var(--dark-navy);
  color: white;
  padding: 40px 0 60px 0; /* Padding extra para sobrepor os cards */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.header-inner { display: flex; justify-content: space-between; align-items: flex-start; }
.header-titles h1 { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px; }
.header-titles p { color: #94a3b8; margin: 0; font-size: 15px; }

/* =========================================
   MENU LATERAL (SIDEBAR)
========================================= */
.admin-menu nav {
  background: var(--sidebar-bg);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.admin-menu button {
  display: flex; align-items: center; gap: 12px;
  text-align: left; padding: 12px 16px;
  background: transparent; border: none; border-radius: 10px;
  font-weight: 600; font-size: 15px; color: #94a3b8;
  cursor: pointer; transition: all 0.2s ease;
}
.admin-menu button:hover { background: var(--sidebar-active); color: white; }
.admin-menu button.active {
  background: var(--primary); color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.icon { font-size: 18px; }

/* =========================================
   CABEÇALHO DA SEÇÃO & CARDS
========================================= */
.admin-content { display: flex; flex-direction: column; gap: 24px; }
.header-action {
  display: flex; justify-content: space-between; align-items: center;
  background: var(--bg-card); padding: 24px; border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}
.header-action h2 { margin: 0 0 4px 0; font-size: 22px; font-weight: 700; color: var(--text-main); }
.header-action .sub { margin: 0; color: var(--text-muted); font-size: 14px; }

.form-card {
  background: var(--bg-card); padding: 28px; border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid var(--border-color);
}
.form-card h3 { margin: 0 0 20px 0; font-size: 18px; color: var(--primary); border-bottom: 2px solid #eff6ff; padding-bottom: 10px; }

/* =========================================
   FORMULÁRIOS
========================================= */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 6px; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 12px 14px; border: 1px solid var(--border-color); border-radius: 10px;
  font-size: 15px; color: var(--text-main); background: #f8fafc; transition: all 0.2s ease;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  background: white; border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
}
.form-actions { display: flex; gap: 12px; margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 20px; }

/* Alerta visual para senhas geradas */
.preview-alert {
  display: flex; gap: 12px; background: #eff6ff; border: 1px solid #bfdbfe;
  padding: 16px; border-radius: 10px; margin-bottom: 20px; color: #1e3a8a;
}
.preview-alert .alert-content { font-size: 14px; line-height: 1.5; }

/* =========================================
   TABELAS & LISTAS
========================================= */
.table-container {
  background: var(--bg-card); border-radius: 16px; padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden;
}
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { background: #f8fafc; color: var(--text-muted); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 16px; border-bottom: 2px solid var(--border-color); }
.data-table td { padding: 16px; border-bottom: 1px solid var(--border-color); font-size: 15px; vertical-align: middle; }
.data-table tbody tr { transition: background-color 0.2s; }
.data-table tbody tr:hover { background-color: #f8fafc; }
.font-medium { font-weight: 500; }
.mono { font-family: ui-monospace, monospace; font-size: 14px; }
.text-muted { color: var(--text-muted); }
.text-right { text-align: right; }
.td-actions { text-align: right; display: flex; justify-content: flex-end; gap: 8px; }
.empty-state { text-align: center; padding: 40px !important; color: var(--text-muted); font-style: italic; }

/* Listas (Blog e Eventos) */
.admin-list { list-style: none; padding: 0; margin: 0; }
.admin-list li { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border-color); transition: background 0.2s; }
.admin-list li:hover { background: #f8fafc; }
.admin-list li:last-child { border-bottom: none; }
.item-info { display: flex; align-items: center; gap: 16px; }
.date-badge { background: #eff6ff; color: var(--primary); font-weight: 700; font-size: 14px; padding: 10px; border-radius: 10px; text-align: center; line-height: 1.2; min-width: 60px; }
.item-thumb img { width: 64px; height: 64px; object-fit: cover; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.item-text strong { display: block; font-size: 16px; color: var(--text-main); margin-bottom: 4px; }
.item-text small { color: var(--text-muted); font-size: 14px; }

/* =========================================
   BOTÕES E BADGES
========================================= */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 20px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
}
.btn:active { transform: scale(0.97); }
.btn-sm { padding: 6px 12px; font-size: 13px; border-radius: 8px; }

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-hover); box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
.btn-success { background: var(--success); color: white; }
.btn-success:hover { background: var(--success-hover); box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
.btn-danger { background: var(--danger); color: white; }
.btn-danger:hover { background: var(--danger-hover); box-shadow: 0 4px 12px rgba(239,68,68,0.2); }
.btn-warning { background: var(--warning); color: white; }
.btn-warning:hover { background: var(--warning-hover); box-shadow: 0 4px 12px rgba(245,158,11,0.2); }
.btn-secondary { background: #e2e8f0; color: #475569; }
.btn-secondary:hover { background: #cbd5e1; color: var(--text-main); }
.btn-logout { background: transparent; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; }
.btn-logout:hover { background: rgba(239,68,68,0.9); border-color: transparent; }

/* Badges (Pílulas de status) */
.badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-light { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
.badge-blue { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
.badge-purple { background: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
.badge-brown { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; } /* Marrom improvisado com amber */
.badge-dark { background: #0f172a; color: #f8fafc; }

/* =========================================
   RESPONSIVIDADE
========================================= */
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; margin-top: 20px; }
  .admin-menu nav { flex-direction: row; overflow-x: auto; padding: 10px; border-radius: 12px; }
  .admin-menu button { white-space: nowrap; padding: 10px 14px; }
  .admin-header { padding: 30px 0; }
  .header-inner { flex-direction: column; gap: 16px; }
  .form-grid { grid-template-columns: 1fr; }
  .data-table, .data-table tbody, .data-table tr, .data-table td { display: block; width: 100%; }
  .data-table thead { display: none; }
  .data-table tr { border-bottom: 2px solid var(--border-color); padding: 16px 0; }
  .data-table td { border: none; padding: 8px 16px; text-align: right; display: flex; justify-content: space-between; align-items: center; }
  .data-table td::before { content: attr(data-label); font-weight: 600; color: var(--text-muted); }
  .td-actions { justify-content: flex-end; }
}
</style>