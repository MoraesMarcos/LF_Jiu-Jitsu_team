<template>
    <header class="header">
        <div class="container">
            <RouterLink to="/" class="logo">
                <img src="@/assets/images/logo.jpeg" alt="Logo da LF Jiu-Jitsu">
            </RouterLink>

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
                <a href="#" class="btn btn-primary">Agendar Aula</a>
            </div>
        </div>
    </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
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
.logo {
    display: flex;
    align-items: center;
}
.logo img {
    height: 50px; /* Ajuste a altura da sua logo aqui */
    width: auto;
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