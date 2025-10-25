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
                    <li><RouterLink to="/admin/login">Acesso Admin</RouterLink></li> 
                </ul>
            </div>
            <div class="footer-col">
                <h4>Siga-nos</h4>
                <div class="footer-socials">
                    <a href="https://www.instagram.com/the_brothers.catendebjj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"></a>
                    
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>

import { RouterLink } from 'vue-router';
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
}
.footer-col {
    flex: 1;
    padding: 0 15px;
}
.footer-col .logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}
.footer-col p {
    color: #9CA3AF;
}
.footer-col h4 {
    font-size: 18px;
    margin-bottom: 20px;
    color: var(--white);
}
.footer-col ul {
    list-style: none;
}
.footer-col li {
    margin-bottom: 10px;
}
.footer-col a {
    color: #9CA3AF;
    transition: color 0.3s;
}
.footer-col a:hover {
    color: var(--white);
}
.footer-socials {
    display: flex;
    gap: 15px;
}
.footer-socials a {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--medium-gray);
}
</style>