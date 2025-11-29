<template>
  <article class="card">
    <div class="media" v-if="image">
      <img :src="image" :alt="title" loading="lazy" />
    </div>

    <div class="content">
      <h3 class="title">{{ title }}</h3>
      <p class="excerpt">{{ excerpt }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  image: { type: String, required: false },
})
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: box-shadow .2s ease, transform .2s ease;
}
.card:hover {
  box-shadow: 0 10px 24px rgba(0,0,0,.08);
  transform: translateY(-2px);
}

.media {
  width: 100%;
  height: 220px;
  overflow: hidden;
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content {
  padding: 16px;
}
.title {
  font-size: 1.125rem;
  line-height: 1.4;
  margin: 0 0 8px;
}
.excerpt {
  color: #4b5563;
  margin: 0;
}
.readmore {
  display: inline-block;
  margin-top: 12px;
  font-weight: 600;
  color: #1d4ed8;
}
</style>
