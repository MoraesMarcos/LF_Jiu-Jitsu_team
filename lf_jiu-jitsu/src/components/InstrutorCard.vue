<template>
  <article class="instructor-card">
    <img :src="instructor.image" :alt="`Foto do instrutor ${instructor.name}`" class="photo" />
    <div class="name">{{ instructor.name }}</div>
    <div class="rank">{{ instructor.rank }}</div>

    <RouterLink :to="{ name: 'instrutor-detalhe', params: { slug: instructor.slug } }" class="saber-mais">
      Saber mais
    </RouterLink>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  instructor: Object
});
</script>

<style scoped>
.instructor-card {
  background-color: var(--white);
  border-radius: 16px;
  padding: 35px 25px;
  text-align: center;
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.instructor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.photo {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 20px;
  border: 4px solid var(--light-gray);
}

.name {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 5px;
}

.rank {
  color: var(--medium-gray);
  flex-grow: 1;
  font-weight: 600;
}

.saber-mais {
  display: inline-block;
  margin-top: 25px;
  padding: 10px 20px;
  border-radius: 8px;
  color: var(--accent-blue);
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  background-color: var(--off-white);
}

.saber-mais:hover {
  background-color: var(--accent-blue);
  color: var(--white);
}
</style>