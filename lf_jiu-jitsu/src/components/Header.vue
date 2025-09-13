<template>
    <header class="header">
        <div class="container">
            <RouterLink to="/" class="logo">LF Jiu-Jitsu</RouterLink>
            <nav>
                <ul>
                    <li><RouterLink to="/sobre">Sobre</RouterLink></li>
                    <li><RouterLink to="/horarios">Horários</RouterLink></li>
                    <li><RouterLink to="/planos">Planos</RouterLink></li>
                    <li><RouterLink to="/blog">Blog</RouterLink></li>
                    <li><RouterLink to="/contato">Contato</RouterLink></li>
                </ul>
            </nav>
            <div class="actions">
                <a href="#" class="login-link">Área do Aluno</a>
                <button @click="$emit('openTrialModal')" class="btn btn-primary">
                    Agendar Aula
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineEmits(['openTrialModal']);
</script>

<style scoped>

.header {
    background-color: var(--white);
    border-bottom: 1px solid var(--border-color);
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}
.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header .logo {
    font-size: 24px;
    font-weight: bold;
    color: var(--dark-gray);
}
.header nav ul {
    display: flex;
    list-style: none;
    gap: 30px;
}
.header .actions {
    display: flex;
    align-items: center;
    gap: 20px;
}
.header .actions .login-link {
    font-size: 16px;
    color: var(--text-light);
}
</style>