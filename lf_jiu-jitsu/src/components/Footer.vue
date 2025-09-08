<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-col">
                <div class="logo">LF Jiu-Jitsu</div>
                <p>Rua Exemplo, 123<br>Sua Cidade, BR</p>
            </div>
            <div class="footer-col">
                <h4>Navegação</h4>
                <ul>
                    <li><a href="#">Sobre</a></li>
                    <li><a href="#">Horários</a></li>
                    <li><a href="#">Planos</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Siga-nos</h4>
                <div class="footer-socials">
                    <a href="#"></a>
                    <a href="#"></a>
                    <a href="#"></a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
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