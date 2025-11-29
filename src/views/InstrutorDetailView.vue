<template>
  <main v-if="instructor">
    <PageHeader :title="instructor.name" :subtitle="instructor.rank" />
    
    <section class="instructor-detail-section">
      <div class="container">
        <div class="detail-card">
          <div class="detail-image">
            <img :src="instructor.image" :alt="`Foto de ${instructor.name}`">
          </div>
          <div class="detail-content">
            <h2>{{ instructor.name }}</h2>
            <p class="bio">{{ instructor.bio }}</p>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="label">Idade</span>
                <span class="value">{{ instructor.idade }} anos</span>
              </div>
              <div class="stat-item">
                <span class="label">Tempo de Jiu-Jitsu</span>
                <span class="value">{{ instructor.tempoJiuJitsu }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Instagram</span>
                <a :href="`https://instagram.com/${instructor.instagram.replace('@', '')}`" target="_blank" class="value link">
                  {{ instructor.instagram }}
                </a>
              </div>
            </div>

            <RouterLink to="/instrutores" class="btn btn-secondary back-link">
              ← Voltar para a equipe
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div v-else class="container not-found">
    <PageHeader title="Ops!" subtitle="Instrutor não encontrado." />
    <RouterLink to="/instrutores" class="btn btn-primary">
      Ver todos os instrutores
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { instructorStore } from '@/store/instructorStore';
import PageHeader from '@/components/PageHeader.vue';

const route = useRoute();
const instructor = ref(null);

onMounted(() => {
  const slug = route.params.slug;
  instructor.value = instructorStore.getInstructorBySlug(slug);
});
</script>

<style scoped>
.instructor-detail-section {
  padding: 60px 0 90px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}
.not-found {
  padding-bottom: 90px;
  text-align: center;
}
.detail-card {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.detail-content {
  padding: 30px;
}
.detail-content h2 {
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 10px;
}
.bio {
  font-size: 16px;
  color: var(--text-light);
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}
.stat-item .label {
  display: block;
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
}
.stat-item .value {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-gray);
}
.stat-item .link {
  color: var(--primary-blue);
  text-decoration: none;
}
.stat-item .link:hover {
  text-decoration: underline;
}

.back-link {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .detail-image {
    height: 300px;
  }
}
</style>