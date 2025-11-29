<template>
  <main class="about">
    <section class="container about-wrap">
      <figure class="about-image">
        <img :src="foto4" alt="Equipe LF Jiu-Jitsu reunida no tatame" loading="lazy" />
      </figure>

      <div class="about-content">
        <h1>Sobre a LF Jiu-Jitsu</h1>
        <h2>Nossa Casa, Sua Família</h2>

        <p>
          Acreditamos que o Jiu-Jitsu vai além do tatame. Construímos um ambiente de respeito
          mútuo, onde cada aluno é parte fundamental da nossa equipe. Nossa trajetória é feita
          de disciplina, superação e amizade — dentro e fora do tatame.
        </p>
        <p>
          Começamos com um grupo pequeno e muita dedicação. Hoje, seguimos formando campeões
          em caráter e técnica, participando de competições regionais, estaduais e nacionais,
          sempre valorizando o fair play e o crescimento pessoal.
        </p>

        <RouterLink to="/" class="btn-back">← Voltar para a Home</RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import foto4 from '@/assets/images/publico/4.jpg'
</script>

<style scoped>

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

.about {
  padding: 64px 0 96px;
}

.about-wrap {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: center;
}

.about-image {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(0,0,0,.08);
}
.about-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.about-content h1 {
  font-size: 40px;
  line-height: 1.1;
  margin: 0 0 8px;
  color: #0f172a;
}
.about-content h2 {
  font-size: 28px;
  margin: 0 0 14px;
  color: #0f172a;
}
.about-content p {
  color: #475569;
  margin: 0 0 14px;
}

.btn-back {
  display: inline-block;
  margin-top: 8px;
  color: #1d4ed8;
  font-weight: 700;
}

@media (max-width: 900px) {
  .about-wrap {
    grid-template-columns: 1fr;
  }
  .about-content h1 {
    font-size: 32px;
  }
}
</style>
