<template>
  <main>
    <PageHeader 
      title="Nossa Equipe de Instrutores" 
      subtitle="Aprenda a arte suave com faixas-pretas e professores dedicados ao seu crescimento." 
    />

    <section class="team-section">
      <div class="container">
        
        <div class="instructors-grid">
          <InstructorCard 
            v-for="instructor in instructors" 
            :key="instructor.slug" 
            :instructor="instructor" 
          />
        </div>

        <div class="action-wrap">
            <RouterLink to="/horarios" class="btn btn-primary">
                Veja os Horários das Aulas
            </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import InstructorCard from '@/components/InstrutorCard.vue';
import { instructorStore } from '@/store/instructorStore';

const instructors = computed(() => instructorStore.instructors);

</script>

<style scoped>
.team-section {
    padding: 60px 0;
}
.container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 16px;
}
.instructors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    justify-items: center;
}
.action-wrap {
    text-align: center;
    margin-top: 60px;
}

:deep(.instructor-card) {
    width: 100%;
    max-width: 300px;
    box-shadow: 0 8px 16px rgba(0,0,0,.05);
}
</style>