<template>
    <main>
        <section class="featured-article">
            <div class="container">
                <h2>Artigo em Destaque</h2>
                <h3>Título do Artigo Principal</h3>
                <p>Este é um pequeno trecho para o artigo em destaque, que atrairá a atenção do leitor.</p>
            </div>
        </section>

        <section class="latest-articles">
            <div class="container">
                <h2>Últimos Artigos</h2>
                <div class="articles-grid">
                    <ArticleCard v-for="(article, index) in latestArticles" :key="index" :title="article.title"
                        :excerpt="article.excerpt" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import ArticleCard from '@/components/ArticleCard.vue';

const latestArticles = ref([
    { title: 'Título do Artigo', excerpt: 'Pequeno trecho sobre o artigo...' },
    { title: 'Título do Artigo', excerpt: 'Pequeno trecho sobre o artigo...' },
    { title: 'Título do Artigo', excerpt: 'Pequeno trecho sobre o artigo...' }
]);
</script>

<style scoped>
.featured-article {
    background-color: var(--primary-blue);
    color: var(--white);
    padding: 80px 0;
}

.featured-article .container {
    max-width: 900px;
}

.featured-article h2 {
    color: var(--white);
    text-align: left;
    font-size: 24px;
    margin-bottom: 5px;
}

.featured-article h3 {
    color: var(--white);
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 10px;
}

.featured-article p {
    color: #DBEAFE;
    font-size: 18px;
}

.latest-articles {
    padding: 80px 0;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 1140px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .articles-grid {
        grid-template-columns: 1fr;
    }
}
</style>