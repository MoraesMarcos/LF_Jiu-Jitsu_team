<template>
    <section class="about">
        <div class="container">
            <div class="about-image">
                <img src="@/assets/images/publico/foto_equipe.jpeg" alt="Foto da equipe">
            </div>
            <div class="about-content">
                <h2>Nossa Casa, Sua Família</h2>
                <p>Acreditamos que o Jiu-Jitsu vai além do tatame. Construímos um ambiente de respeito mútuo, onde cada aluno é parte fundamental da nossa equipe. Venha fazer parte.</p>
                <RouterLink to="/sobre" class="btn btn-secondary">Conheça Nossa História</RouterLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.about .container {
    display: flex;
    align-items: center;
    gap: 80px;
}
.about .about-image {
    flex: 1;
    height: 400px;
    background-color: var(--border-color);
    border-radius: 12px;
    overflow: hidden; 
}
.about .about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.about .about-content {
    flex: 1;
}
.about .about-content h2 {
    text-align: left;
    margin-bottom: 20px;
}
.about .about-content p {
    margin-bottom: 30px;
}
</style>