<template>
  <main class="blog-view">
    <PageHeader title="Blog LF Jiu-Jitsu"
      subtitle="Notícias, dicas e novidades sobre o mundo do Jiu-Jitsu e nossa equipe." />

    <section class="content-area">
      <div class="container layout-grid">

        <div class="main-column">
          <h2 class="section-title">Últimas Postagens</h2>

          <div class="posts-grid">
            <ArticleCard v-for="(post, index) in visiblePosts" :key="index" :title="post.title" :excerpt="post.excerpt"
              :image="post.image" />
          </div>

          <div class="load-more-wrap" v-if="hasMorePosts">
            <button class="btn btn-secondary" @click="loadMore">
              Carregar mais postagens
            </button>
          </div>
        </div>

        <aside class="sidebar">
          <div class="sidebar-card">
            <h3>📅 Próximos Eventos</h3>
            <ul class="event-list">
              <li v-for="(event, index) in events" :key="index" class="event-item">
                <div class="event-date">
                  <span class="day">{{ event.day }}</span>
                  <span class="month">{{ event.month }}</span>
                </div>
                <div class="event-info">
                  <h4>{{ event.title }}</h4>
                  <p>{{ event.info }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="sidebar-cta">
            <h3>Quer participar?</h3>
            <p>Alguns eventos são abertos ao público. Agende uma visita!</p>
            <button class="btn btn-primary" @click="$emit('openTrialModal')">Fale Conosco</button>
          </div>
        </aside>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { blogStore } from '@/store/blogStore.js'
import { eventStore } from '@/store/eventStore.js'

defineEmits(['openTrialModal'])

// --- Lógica de Paginação do Blog ---

// Quantos posts mostramos inicialmente
const itemsToShow = ref(6)
// Quantos posts adicionamos a cada clique no botão
const itemsToLoad = 3

// Computed que retorna todos os posts da store
const allPosts = computed(() => blogStore.posts)

// Computed que "corta" a lista para mostrar apenas a quantidade atual
const visiblePosts = computed(() => {
  return allPosts.value.slice(0, itemsToShow.value)
})

// Verifica se ainda tem posts para mostrar (para esconder o botão quando acabar)
const hasMorePosts = computed(() => {
  return itemsToShow.value < allPosts.value.length
})

// Função chamada ao clicar no botão
function loadMore() {
  itemsToShow.value += itemsToLoad
}

// --- Lógica de Eventos ---
const events = computed(() => eventStore.events)
</script>

<style scoped>
.content-area {
  padding: 60px 0;
  background-color: #f8fafc;
}

.layout-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 40px;
  align-items: start;
}

.section-title {
  margin-bottom: 24px;
  font-size: 24px;
  color: var(--primary-navy);
  border-left: 4px solid var(--accent-blue);
  padding-left: 12px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Estilo do botão Carregar Mais */
.load-more-wrap {
  margin-top: 40px;
  text-align: center;
}

.load-more-wrap .btn {
  padding: 12px 30px;
  cursor: pointer;
}

/* --- Sidebar Styles --- */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.sidebar-card h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--primary-navy);
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
}

.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.event-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.event-date {
  background-color: #eef2ff;
  color: var(--accent-blue);
  border-radius: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #c7d2fe;
}

.event-date .day {
  font-weight: 800;
  font-size: 18px;
  line-height: 1;
}

.event-date .month {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
}

.event-info h4 {
  font-size: 15px;
  margin: 0 0 6px;
  color: #0f172a;
  font-weight: 700;
}

.event-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.sidebar-cta {
  background: var(--primary-navy);
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.sidebar-cta h3 {
  color: white;
  margin-bottom: 8px;
}

.sidebar-cta p {
  color: #cbd5e1;
  font-size: 14px;
  margin-bottom: 16px;
}

.sidebar-cta .btn {
  width: 100%;
  font-size: 14px;
}

@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>