<template>
    <article class="article-card">
        <div class="article-image"></div>
        <div class="article-content">
            <h3>{{ title }}</h3>
            <p>{{ excerpt }}</p>
        </div>
    </article>
</template>

<script setup>
defineProps({
    title: String,
    excerpt: String
});
</script>

<style scoped>
.article-card {
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    width: 100%;
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.article-image {
    width: 100%;
    height: 200px;
    background-color: #D1D5DB;
}

.article-content {
    padding: 20px;
}

.article-content h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.article-content p {
    font-size: 14px;
    color: var(--text-light);
}
</style>