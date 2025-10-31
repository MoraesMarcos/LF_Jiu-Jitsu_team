<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-col">
        <div class="logo">LF Jiu-Jitsu</div>
        <p>Rua da Cohab, 123<br>Catende, PE</p>
      </div>

      <div class="footer-col">
        <h4>Navegação</h4>
        <ul>
          <li><RouterLink to="/sobre">Sobre</RouterLink></li>
          <li><RouterLink to="/horarios">Horários</RouterLink></li>
          <li><RouterLink to="/planos">Planos</RouterLink></li>
          <li><RouterLink to="/instrutores">Instrutores</RouterLink></li>
          <li><RouterLink to="/admin">Acesso Admin</RouterLink></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Siga-nos</h4>
        <div class="footer-socials">
          <a
            href="https://www.instagram.com/the_brothers.catendebjj"
            target="_blank"
            title="Instagram"
          >
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon-instagram"
            >
              <path
                d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm4.75-2.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>

.footer {
  background-color: var(--dark-gray);
  color: var(--white);
  padding: 60px 0;
}

.footer .container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-col {
  flex: 1;
  min-width: 200px;
  padding: 0 15px;
}

.footer-col .logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.footer-col p {
  color: #9ca3af;
}

.footer-col h4 {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--white);
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li {
  margin-bottom: 10px;
}

.footer-col a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-col a:hover {
  color: var(--white);
}

.footer-socials {
  display: flex;
  gap: 15px;
  align-items: center;
}

.footer-socials a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--medium-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, background-color 0.3s;
}

.footer-socials a:hover {
  background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
  transform: scale(1.1);
}

.icon-instagram {
  width: 22px;
  height: 22px;
  color: #ffffff;
}
</style>