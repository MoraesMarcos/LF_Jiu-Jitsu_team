<template>
  <section class="pricing-section">
    <div class="container">
      <div class="pricing-grid">
        <PlanCard 
          v-for="plan in plans" 
          :key="plan.name" 
          :plan="plan"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import PlanCard from '@/components/PlanoCard.vue';

const plans = ref([
    { name: 'Plano Básico', price: 'R$180', period: 'mês', features: ['Aulas 2x por semana', 'Turmas de iniciantes'], featured: false },
    { name: 'Plano Total', price: 'R$250', period: 'mês', features: ['Acesso livre a todas as aulas', 'Turmas de iniciantes e avançados', 'Acesso ao conteúdo exclusivo'], featured: true },
    { name: 'Plano Anual', price: 'R$2200', period: 'ano', features: ['Desconto especial', 'Acesso livre por 12 meses'], featured: false }
]);
</script>

<style scoped>
.pricing-section {
  padding: 60px 0 80px; /* Adicionado um pouco mais de espaço embaixo */
}
.pricing-grid {
  display: flex;
  justify-content: center;
  
  /* --- CORREÇÃO APLICADA AQUI --- */
  align-items: stretch; /* Garante que todos os cards estiquem para a mesma altura */
  
  gap: 30px;
  flex-wrap: wrap; 
}
</style>