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
      <div class="container articles-and-sidebar-grid">
        
        <div class="articles-column">
          <h2>Últimos Artigos</h2>
          <div class="articles-grid">
            <ArticleCard
              v-for="(article, index) in displayedPosts"
              :key="index"
              :title="article.title"
              :excerpt="article.excerpt"
              :image="article.image"
            />
          </div>
          <div class="load-more-wrapper" v-if="hasMorePosts">
              <button @click="loadMore" class="btn btn-primary">
                  Carregar mais posts
              </button>
          </div>
        </div>

        <div class="sidebar-column">
          <h2>Mural de Notícias</h2>
          <div class="news-list">
            <article v-for="(news, i) in newsItems" :key="i" class="news-item">
                <h4>{{ news.title }}</h4>
                <p class="news-desc">{{ news.excerpt }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { blogStore } from '@/store/blogStore'

import { articleStore as newsStore } from '@/store/newsStore'

const postsToShow = ref(6) 

const displayedPosts = computed(() => {
  return blogStore.posts.slice(0, postsToShow.value)
})

const hasMorePosts = computed(() => {
  return postsToShow.value < blogStore.posts.length
})

const loadMore = () => {
  postsToShow.value += 6 
}

const newsItems = computed(() => newsStore.latestArticles)

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
.articles-and-sidebar-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 40px;
}

.articles-column h2 {
  font-size: 28px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 10px;
}
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 30px;
  margin-top: 20px;
}
.load-more-wrapper {
  text-align: center;
  margin-top: 40px;
}

.sidebar-column {

  position: sticky;
  top: 100px; 
  align-self: start;
}
.sidebar-column h2 {
    font-size: 28px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}
.news-list {
    display: grid;
    gap: 15px;
}
.news-item {
    padding: 15px;
    border: 1px solid var(--border-color);
    border-left: 5px solid var(--primary-blue);
    border-radius: 8px;
    background-color: var(--white);
}
.news-item h4 {
    font-size: 18px;
    margin: 0 0 5px;
}
.news-desc {
    font-size: 14px;
    color: var(--text-light);
    margin: 0;
}


@media (max-width: 900px) {
  .articles-and-sidebar-grid {
    grid-template-columns: 1fr;
  }
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sidebar-column {
    position: static;
    top: auto;
  }
}
@media (max-width: 600px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>