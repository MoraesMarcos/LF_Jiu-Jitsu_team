<template>
  <main>
    <section class="featured-article">
      <div class="container">
        <h2>Artigo em Destaque</h2>
        <h3>Conquistas no Jiu-Jitsu Infantil</h3>
        <p>Destaques dos jovens talentos que conquistaram medalhas em campeonatos nacionais e internacionais de Jiu-Jitsu.</p>
      </div>
    </section>

    <section class="latest-articles">
      <div class="container articles-and-events-grid">
        
        <div class="articles-column">
          <h2>Últimos Artigos</h2>
          <div class="articles-grid">
            <ArticleCard
              v-for="(article, index) in latestArticles"
              :key="index"
              :title="article.title"
              :excerpt="article.excerpt"
              :image="article.image"
            />
          </div>
        </div>

        <div class="events-column">
          <h2>Próximos Eventos e Avisos</h2>
          <div class="events-list">
            <article v-for="(event, i) in events" :key="i" class="event-item">
                <span class="event-date">{{ event.date }}</span>
                <h4>{{ event.title }}</h4>
                <p class="event-desc">{{ event.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'


import img1 from '@/assets/images/publico/1.jpg'
import img2 from '@/assets/images/publico/2.jpg'
import img3 from '@/assets/images/publico/3.jpg'

const latestArticles = ref([
  {
    title: 'Sul-Americano de Jiu-Jitsu Kids 2025',
    excerpt: 'Jovem atleta conquista medalha de ouro no campeonato Sul-Americano Kids da IBJJF.',
    image: img1,
  },
  {
    title: 'Equipe de Campeões',
    excerpt: 'Equipe celebra as inúmeras medalhas conquistadas em competições nacionais e internacionais.',
    image: img2,
  },
  {
    title: 'Brasileiro de Jiu-Jitsu Kids 2025',
    excerpt: 'Jovens talentos brilham no pódio do campeonato brasileiro sem kimono.',
    image: img3,
  },
])

const events = ref([
    { date: '15 NOV', title: 'Campeonato Interno', description: 'Inscrições abertas na secretaria. Premiação para todas as categorias.' },
    { date: '25 DEZ', title: 'Confraternização Anual', description: 'Churrasco de final de ano e troca de faixas festiva.' },
    { date: '01 FEV', title: 'Semana do Iniciante', description: 'Treinos focados em fundamentos básicos e novas turmas.' },
])
</script>

<style scoped>
.featured-article {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  color: var(--white, #fff);
  padding: 80px 0;
}
.featured-article .container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}
.featured-article h2 {
  color: var(--white, #fff);
  text-align: left;
  font-size: 24px;
  margin-bottom: 5px;
}
.featured-article h3 {
  color: var(--white, #fff);
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 10px;
}
.featured-article p {
  color: #dbeafe;
  font-size: 18px;
}

.latest-articles {
  padding: 80px 0;
}
.latest-articles .container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}
.articles-and-events-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;
}


.events-column h2 {
    font-size: 28px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}
.events-list {
    display: grid;
    gap: 15px;
}
.event-item {
    padding: 15px;
    border: 1px solid var(--border-color);
    border-left: 5px solid var(--primary-blue);
    border-radius: 8px;
    background-color: var(--white);
}
.event-date {
    font-size: 12px;
    font-weight: bold;
    color: var(--primary-blue);
    display: block;
    margin-bottom: 5px;
}
.event-item h4 {
    font-size: 18px;
    margin: 0 0 5px;
}
.event-desc {
    font-size: 14px;
    color: var(--text-light);
    margin: 0;
}

@media (max-width: 900px) {
  .articles-and-events-grid {
    grid-template-columns: 1fr;
  }
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>