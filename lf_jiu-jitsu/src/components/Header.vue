<template>
  <header class="header">
    <div class="container">
      <RouterLink to="/" class="logo" aria-label="LF Jiu-Jitsu - Início">
        <img src="@/assets/images/logo.jpeg" alt="Logo da LF Jiu-Jitsu" />
      </RouterLink>

      <nav class="nav">
        <ul>
          <li><RouterLink to="/sobre">Sobre</RouterLink></li>
          <li><RouterLink to="/horarios">Horários</RouterLink></li>
          <li><RouterLink to="/planos">Planos</RouterLink></li>
          <li><RouterLink to="/blog">Blog</RouterLink></li>
          <li><RouterLink to="/contato">Contato</RouterLink></li>
        </ul>
      </nav>

      <div class="actions">
        <!-- ✅ RouterLink em vez de <a href="#"> -->
        <RouterLink :to="{ name: 'area-aluno' }" class="login-link">
          Área do Aluno
        </RouterLink>

        <!-- type="button" para não submeter nenhum form por engano -->
        <button type="button" @click="$emit('openTrialModal')" class="btn btn-primary">
          Agendar Aula
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
defineEmits(['openTrialModal'])
</script>

<style scoped>
.header {
  background: var(--white, #fff);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.logo img {
  height: 50px;
  width: auto;
  display: block;
}

.nav ul {
  display: flex;
  list-style: none;
  gap: 30px;
  padding: 0;
  margin: 0;
}
.nav :deep(a) {
  color: #0f172a;
  text-decoration: none;
  font-weight: 500;
}
.nav :deep(a.router-link-active) {
  color: #1d4ed8;             /* link ativo */
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.login-link {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;
}
.btn.btn-primary {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1d4ed8;
  background: #1d4ed8;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.btn.btn-primary:focus,
.login-link:focus,
.nav :deep(a:focus) {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}
</style>
