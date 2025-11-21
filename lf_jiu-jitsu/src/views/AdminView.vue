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
            <aside class="admin-menu">
                <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">📅
                    Eventos</button>
                <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">✍️ Blog</button>
                <button :class="{ active: currentTab === 'horarios' }" @click="currentTab = 'horarios'">⏰
                    Horários</button>
                <button :class="{ active: currentTab === 'alunos' }" @click="currentTab = 'alunos'">🥋 Alunos</button>
            </aside>

            <section class="admin-content">

                <div v-if="currentTab === 'eventos'">
                    <div class="header-action">
                        <h2>Gerenciar Eventos</h2>
                        <button class="btn-add" @click="prepareCreateEvent">+ Novo Evento</button>
                    </div>
                    <div v-if="showEventForm" class="form-card">
                        <h3>{{ isEditing ? 'Editar' : 'Novo' }}</h3>
                        <form @submit.prevent="saveEvent">
                            <div class="row">
                                <input v-model="eventForm.day" placeholder="Dia (15)" required class="input-small">
                                <input v-model="eventForm.month" placeholder="Mês (DEZ)" required class="input-small">
                            </div>
                            <input v-model="eventForm.title" placeholder="Título" required>
                            <input v-model="eventForm.info" placeholder="Infos" required>
                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel"
                                    @click="showEventForm = false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <ul class="admin-list">
                        <li v-for="ev in events" :key="ev.id">
                            <div><strong>{{ ev.day }}/{{ ev.month }}</strong> - {{ ev.title }}</div>
                            <div class="item-actions">
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
                        <form @submit.prevent="savePost">
                            <input v-model="blogForm.title" placeholder="Título" required>
                            <textarea v-model="blogForm.excerpt" placeholder="Resumo" rows="3" required></textarea>
                            <input v-model="blogForm.image" placeholder="URL Imagem" required>
                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel" @click="showBlogForm = false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <ul class="admin-list">
                        <li v-for="post in posts" :key="post.id">
                            <div>{{ post.title }}</div>
                            <button class="btn-delete" @click="deletePost(post.id)">Excluir</button>
                        </li>
                    </ul>
                </div>

                <div v-if="currentTab === 'horarios'">
                    <div class="header-action">
                        <h2>Grade</h2>
                    </div>
                    <p>Gerenciamento de horários (Use a store scheduleStore já configurada anteriormente).</p>
                </div>

                <div v-if="currentTab === 'alunos'">
                    <div class="header-action">
                        <h2>Gerenciar Alunos</h2>
                        <button class="btn-add" @click="showAlunoForm = true">+ Matricular Aluno</button>
                    </div>

                    <div v-if="showAlunoForm" class="form-card">
                        <h3>Novo Aluno</h3>
                        <form @submit.prevent="saveAluno">
                            <input v-model="alunoForm.name" placeholder="Nome Completo" required>
                            <select v-model="alunoForm.plan" required>
                                <option value="" disabled>Selecione o Plano</option>
                                <option value="Mensal">Mensal</option>
                                <option value="Trimestral">Trimestral</option>
                                <option value="Anual">Anual</option>
                                <option value="Kids">Kids</option>
                            </select>

                            <p class="preview-login" v-if="alunoForm.name">
                                Login será: <strong>lf.{{ alunoForm.name.toLowerCase().replace(/\s+/g, '')
                                    }}</strong><br>
                                Senha padrão: <strong>123</strong>
                            </p>

                            <div class="form-actions">
                                <button type="submit" class="btn-save">Matricular</button>
                                <button type="button" class="btn-cancel"
                                    @click="showAlunoForm = false">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Login</th>
                                <th>Plano</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="aluno in alunos" :key="aluno.id">
                                <td>{{ aluno.name }}</td>
                                <td class="mono">{{ aluno.username }}</td>
                                <td><span class="badge">{{ aluno.plan }}</span></td>
                                <td>
                                    <button class="btn-delete small" @click="deleteAluno(aluno.id)">Remover</button>
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
const currentTab = ref('alunos') // Começa na aba Alunos para facilitar
const isEditing = ref(false)

// Logout Admin
function logout() {
    authStore.logout()
    router.push('/admin/login')
}

// --- Alunos ---
const alunos = computed(() => alunosStore.list)
const showAlunoForm = ref(false)
const alunoForm = reactive({ name: '', plan: '' })

function saveAluno() {
    alunosStore.addAluno({ ...alunoForm })
    showAlunoForm.value = false
    alunoForm.name = ''
    alunoForm.plan = ''
    alert('Aluno matriculado com sucesso!')
}

function deleteAluno(id) {
    if (confirm('Tem certeza que deseja remover este aluno? O acesso dele será revogado.')) {
        alunosStore.removeAluno(id)
    }
}

// --- Eventos (Simplificado para brevidade, lógica completa mantida) ---
const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const eventForm = reactive({ id: null, day: '', month: '', title: '', info: '' })
function prepareCreateEvent() { Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' }); showEventForm.value = true }
function saveEvent() { eventStore.addEvent({ ...eventForm }); showEventForm.value = false }
function deleteEvent(id) { eventStore.removeEvent(id) }

// --- Blog ---
const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const blogForm = reactive({ id: null, title: '', excerpt: '', image: '' })
function prepareCreatePost() { showBlogForm.value = true }
function savePost() { blogStore.addBlogPost({ ...blogForm }); showBlogForm.value = false }
function deletePost(id) { blogStore.removeBlogPost(id) }
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
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 15px;
}

.btn-add {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
}

/* Form */
.form-card {
    background: #f8fafc;
    padding: 20px;
    border-radius: 10px;
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
    border-radius: 6px;
}

.row {
    display: flex;
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
    border-radius: 6px;
    cursor: pointer;
}

.btn-cancel {
    background: #94a3b8;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.preview-login {
    font-size: 13px;
    color: #64748b;
    background: #e2e8f0;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 10px;
}

/* Lists */
.admin-list {
    list-style: none;
    padding: 0;
}

.admin-list li {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: white;
    border-bottom: 1px solid #f1f5f9;
}

.btn-delete {
    background: #ef4444;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-delete.small {
    font-size: 12px;
    padding: 4px 8px;
}

/* Tabela de Alunos */
.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
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
}

.mono {
    font-family: monospace;
    color: var(--accent-blue);
    font-weight: bold;
}

.badge {
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
</style>