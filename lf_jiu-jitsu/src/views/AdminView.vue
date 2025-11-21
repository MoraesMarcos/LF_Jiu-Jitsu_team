<template>
    <main class="admin-view">
        <div class="admin-header">
            <div class="container">
                <h1>Painel Administrativo</h1>
                <p>Controle total sobre conteúdo e alunos.</p>
            </div>
        </div>

        <div class="container layout">

            <aside class="admin-menu">
                <button :class="{ active: currentTab === 'eventos' }" @click="currentTab = 'eventos'">📅
                    Eventos</button>
                <button :class="{ active: currentTab === 'blog' }" @click="currentTab = 'blog'">✍️ Blog</button>
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
                            <input v-model="eventForm.title" placeholder="Título do Evento" required>
                            <input v-model="eventForm.info" placeholder="Informações (horário, local)" required>

                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel" @click="cancelEventForm">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <ul class="admin-list">
                        <li v-for="ev in events" :key="ev.id">
                            <div class="item-info">
                                <strong>{{ ev.day }}/{{ ev.month }}</strong> - {{ ev.title }}
                                <br><small>{{ ev.info }}</small>
                            </div>
                            <div class="item-actions">
                                <button class="btn-edit" @click="prepareEditEvent(ev)">Editar</button>
                                <button class="btn-delete" @click="deleteEvent(ev.id)">Excluir</button>
                            </div>
                        </li>
                    </ul>
                    <p class="hint">Nota: O sistema mantém automaticamente os 4 eventos mais recentes no topo.</p>
                </div>

                <div v-if="currentTab === 'blog'">
                    <div class="header-action">
                        <h2>Gerenciar Blog</h2>
                        <button class="btn-add" @click="prepareCreatePost">+ Novo Post</button>
                    </div>

                    <div v-if="showBlogForm" class="form-card">
                        <h3>{{ isEditing ? 'Editar Post' : 'Novo Post' }}</h3>
                        <form @submit.prevent="savePost">
                            <input v-model="blogForm.title" placeholder="Título da Postagem" required>
                            <textarea v-model="blogForm.excerpt" placeholder="Resumo da postagem" rows="3"
                                required></textarea>
                            <input v-model="blogForm.image" placeholder="URL da Imagem (https://...)" required>

                            <div class="form-actions">
                                <button type="submit" class="btn-save">Salvar</button>
                                <button type="button" class="btn-cancel" @click="cancelBlogForm">Cancelar</button>
                            </div>
                        </form>
                    </div>

                    <ul class="admin-list">
                        <li v-for="post in posts" :key="post.id">
                            <div class="item-thumb" v-if="post.image">
                                <img :src="post.image" alt="Thumb">
                            </div>
                            <div class="item-info">
                                <strong>{{ post.title }}</strong>
                                <br><small>{{ truncate(post.excerpt, 60) }}</small>
                            </div>
                            <div class="item-actions">
                                <button class="btn-edit" @click="prepareEditPost(post)">Editar</button>
                                <button class="btn-delete" @click="deletePost(post.id)">Excluir</button>
                            </div>
                        </li>
                    </ul>
                </div>

            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { eventStore } from '@/store/eventStore'
import { blogStore } from '@/store/blogStore'

const currentTab = ref('eventos')
const isEditing = ref(false)

const events = computed(() => eventStore.events)
const showEventForm = ref(false)
const eventForm = reactive({ id: null, day: '', month: '', title: '', info: '' })

function prepareCreateEvent() {
    isEditing.value = false
    Object.assign(eventForm, { id: null, day: '', month: '', title: '', info: '' })
    showEventForm.value = true
}

function prepareEditEvent(ev) {
    isEditing.value = true
    Object.assign(eventForm, ev)
    showEventForm.value = true
}

function saveEvent() {
    if (isEditing.value) {
        eventStore.updateEvent({ ...eventForm })
    } else {
        eventStore.addEvent({ ...eventForm })
    }
    showEventForm.value = false
}

function deleteEvent(id) {
    if (confirm('Tem certeza que deseja excluir?')) eventStore.removeEvent(id)
}

function cancelEventForm() {
    showEventForm.value = false
}

const posts = computed(() => blogStore.posts)
const showBlogForm = ref(false)
const blogForm = reactive({ id: null, title: '', excerpt: '', image: '' })

function prepareCreatePost() {
    isEditing.value = false
    Object.assign(blogForm, { id: null, title: '', excerpt: '', image: '' })
    showBlogForm.value = true
}

function prepareEditPost(post) {
    isEditing.value = true
    Object.assign(blogForm, post)
    showBlogForm.value = true
}

function savePost() {
    if (isEditing.value) {
        blogStore.updateBlogPost({ ...blogForm })
    } else {
        blogStore.addBlogPost({ ...blogForm })
    }
    showBlogForm.value = false
}

function deletePost(id) {
    if (confirm('Excluir esta postagem?')) blogStore.removeBlogPost(id)
}

function cancelBlogForm() {
    showBlogForm.value = false
}

function truncate(text, len) {
    return text.length > len ? text.substring(0, len) + '...' : text
}
</script>

<style scoped>
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
    transition: all 0.2s;
}

.admin-menu button:hover {
    background: #e2e8f0;
}

.admin-menu button.active {
    background: var(--accent-blue);
    color: white;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

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

.form-card {
    background: #f8fafc;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    margin-bottom: 30px;
}

.form-card input,
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

.item-thumb img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
}

.admin-list li:hover {
    background: #f8fafc;
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

.hint {
    font-size: 12px;
    color: #64748b;
    margin-top: 10px;
    font-style: italic;
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