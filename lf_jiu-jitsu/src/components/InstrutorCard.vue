<template>
  <article class="instructor-card">
    <img :src="instructor.image" :alt="`Foto do instrutor ${instructor.name}`" class="photo" />
    <div class="name">{{ instructor.name }}</div>
    <div class="rank">{{ instructor.rank }}</div>
    
    <RouterLink 
      :to="{ name: 'instrutor-detalhe', params: { slug: instructor.slug } }" 
      class="saber-mais"
    >
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
  border: 1px solid var(--border-color); 
  border-radius: 12px; 
  padding: 30px; 
  text-align: center; 
  width: 260px; 
  flex-shrink: 0; 
  display: flex; 
  flex-direction: column; 
}
.photo { 
    width: 100px; 
    height: 100px; 
    border-radius: 50%; 
    object-fit: cover;
    margin: 0 auto 20px; 
}
.name { 
  font-size: 20px; 
  font-weight: bold; 
  color: var(--dark-gray); 
  margin-bottom: 5px; 
}
.rank { 
  color: var(--text-light); 
  flex-grow: 1; 
}

.saber-mais {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  border: 1px solid var(--primary-blue);
  border-radius: 6px;
  color: var(--primary-blue);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}
.saber-mais:hover {
  background-color: var(--primary-blue);
  color: var(--white);
}
</style>