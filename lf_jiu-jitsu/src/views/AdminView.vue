<template>
    <main class="admin-view">
        <div class="admin-header">
            <div class="container">
                <h1>Painel Administrativo</h1>
                <p>Controle total sobre conteúdo e grade de aulas.</p>
            </div>
        </div>

        <div class="container layout">

            <aside class="admin-menu">
                <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">📅
                    Eventos</button>
                <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">✍️ Blog</button>
                <button :class="{ active: currentTab === 'horarios' }" @click="currentTab = 'horarios'">⏰
                    Horários</button>
                <button :class="{ active: currentTab === 'alunos' }" @click="currentTab = 'alunos'">🥋 Alunos (Em
                    breve)</button>
            </aside>

            <section class="admin-content">

                <div v-if="currentTab === 'eventos'">
                    <div class="header-action">
                        <h2>Gerenciar Eventos</h2>
                        <button class="btn-add" @click="prepareCreateEvent">+ Novo Evento</button>
                    </div>
                    <div v-if="showEventForm" class="form-card">
                        <h3>{{ isEditing ? 'Editar Evento' : 'Novo Evento' }}</h3>
                        <form @submit.prevent="saveEvent">
                            <div class="row">
                                <input v-model="eventForm.day" placeholder="Dia (ex: 15)" required maxlength="2"
                                    class="input-small">
                                <input v-model="eventForm.month" placeholder="Mês (ex: DEZ)" required maxlength="3"
                                    class="input-small">
                            </div>
                            <input v-model="eventForm.title" placeholder="Título" required>
                            <input v-model="eventForm.info" placeholder="Informações" required>
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
                                <button class="btn-edit" @click="prepareEditEvent(ev)">Editar</button>
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
                        <h3>{{ isEditing ? 'Editar Post' : 'Novo Post' }}</h3>
                        <form @submit.prevent="savePost">
                            <input v-model="blogForm.title" placeholder="Título" required>
                            <textarea v-model="blogForm.excerpt" placeholder="Resumo" rows="3" required></textarea>
                            <input v-model="blogForm.image" placeholder="URL da Imagem" required>
                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel" @click="showBlogForm = false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <ul class="admin-list">
                        <li v-for="post in posts" :key="post.id">
                            <div><strong>{{ post.title }}</strong></div>
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
                        <button class="btn-add" @click="prepareCreateClass">+ Nova Aula</button>
                    </div>

                    <div v-if="showClassForm" class="form-card">
                        <h3>{{ isEditing ? 'Editar Aula' : 'Nova Aula' }}</h3>
                        <form @submit.prevent="saveClass">
                            <select v-model="classForm.day" required>
                                <option disabled value="">Selecione o Dia</option>
                                <option v-for="day in daysOfWeek" :key="day" :value="day">{{ day }}</option>
                            </select>

                            <div class="row">
                                <input type="time" v-model="classForm.time" required>
                                <select v-model="classForm.modality" required>
                                    <option disabled value="">Modalidade</option>
                                    <option value="Adulto">Adulto</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="No-Gi">No-Gi (Sem Kimono)</option>
                                </select>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel"
                                    @click="showClassForm = false">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <div class="schedule-list">
                        <div v-for="(group, day) in groupedClasses" :key="day" class="day-group">
                            <h4>{{ day }}</h4>
                            <ul>
                                <li v-for="cls in group" :key="cls.id">
                                    <span>🕑 {{ cls.time }} - <strong>{{ cls.modality }}</strong></span>
                                    <div class="mini-actions">
                                        <button @click="prepareEditClass(cls)">✏️</button>
                                        <button @click="deleteClass(cls.id)" class="danger">🗑️</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { eventStore } from '@/store/eventStore'
import { blogStore } from '@/store/blogStore'
import { scheduleStore } from '@/store/scheduleStore'

const currentTab = ref('horarios') // Começa na aba nova para testar
const isEditing = ref(false)

// --- Eventos ---
const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const eventForm = reactive({ id: null, day: '', month: '', title: '', info: '' })

function prepareCreateEvent() { isEditing.value = false; Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' }); showEventForm.value = true }
function prepareEditEvent(ev) { isEditing.value = true; Object.assign(eventForm, ev); showEventForm.value = true }
function saveEvent() { isEditing.value ? eventStore.updateEvent({ ...eventForm }) : eventStore.addEvent({ ...eventForm }); showEventForm.value = false }
function deleteEvent(id) { if (confirm('Excluir?')) eventStore.removeEvent(id) }

// --- Blog ---
const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const blogForm = reactive({ id: null, title: '', excerpt: '', image: '' })

function prepareCreatePost() { isEditing.value = false; Object.assign(blogForm, { id: null, title: '', excerpt: '', image: '' }); showBlogForm.value = true }
function prepareEditPost(p) { isEditing.value = true; Object.assign(blogForm, p); showBlogForm.value = true }
function savePost() { isEditing.value ? blogStore.updateBlogPost({ ...blogForm }) : blogStore.addBlogPost({ ...blogForm }); showBlogForm.value = false }
function deletePost(id) { if (confirm('Excluir?')) blogStore.removeBlogPost(id) }

// --- Horários ---
const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const showClassForm = ref(false)
const classForm = reactive({ id: null, day: '', time: '', modality: '' })

// Agrupa as aulas por dia para exibir na lista
const groupedClasses = computed(() => {
    const groups = {}
    scheduleStore.sortedClasses.forEach(c => {
        if (!groups[c.day]) groups[c.day] = []
        groups[c.day].push(c)
    })
    return groups
})

function prepareCreateClass() {
    isEditing.value = false
    Object.assign(classForm, { id: null, day: '', time: '', modality: '' })
    showClassForm.value = true
}

function prepareEditClass(cls) {
    isEditing.value = true
    Object.assign(classForm, cls)
    showClassForm.value = true
}

function saveClass() {
    if (isEditing.value) {
        scheduleStore.updateClass({ ...classForm })
    } else {
        scheduleStore.addClass({ ...classForm })
    }
    showClassForm.value = false
}

function deleteClass(id) {
    if (confirm('Remover este horário?')) scheduleStore.removeClass(id)
}
</script>

<style scoped>
/* Estilos Gerais */
.admin-header {
    background: var(--primary-navy);
    color: white;
    padding: 40px 0;
    margin-bottom: 30px;
}

.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 30px;
    min-height: 600px;
}

/* Menu */
.admin-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.admin-menu button {
    text-align: left;
    padding: 15px;
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    color: #64748b;
}

.admin-menu button:hover {
    background: #e2e8f0;
}

.admin-menu button.active {
    background: var(--accent-blue);
    color: white;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* Conteúdo */
.header-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
}

.btn-add {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

/* Formulário */
.form-card {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    margin-bottom: 30px;
}

.form-card input,
.form-card textarea,
.form-card select {
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
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn-save {
    background: var(--accent-blue);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn-cancel {
    background: #94a3b8;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

/* Lista Geral */
.admin-list {
    list-style: none;
    padding: 0;
}

.admin-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 15px;
    border-bottom: 1px solid #e2e8f0;
}

.item-actions {
    display: flex;
    gap: 10px;
}

.btn-edit {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-delete {
    background: #ef4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

/* Lista de Horários (Estilo Específico) */
.day-group {
    margin-bottom: 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
}

.day-group h4 {
    margin: 0 0 10px;
    color: var(--primary-navy);
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 5px;
}

.day-group ul {
    list-style: none;
    padding: 0;
}

.day-group li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #f1f5f9;
}

.mini-actions button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
}

.mini-actions button:hover {
    transform: scale(1.2);
}

@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
    }

    .admin-menu {
        flex-direction: row;
        overflow-x: auto;
    }
}
</style>