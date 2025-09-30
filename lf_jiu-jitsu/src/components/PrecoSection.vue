<template>
  <SubscriptionModal 
    v-if="isModalVisible"
    :plan="selectedPlan"
    @close="isModalVisible = false" 
  />

  <section class="pricing-section">
    <div class="container">
      <div class="pricing-grid">
        <PlanoCard 
          v-for="plan in plans" 
          :key="plan.name" 
          :plan="plan"
          action="modal"  @select-plan="handlePlanSelection"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import PlanoCard from '@/components/PlanoCard.vue';
import SubscriptionModal from '@/components/AssinaturaModal.vue';

const isModalVisible = ref(false);
const selectedPlan = ref(null);

const handlePlanSelection = (plan) => {
  selectedPlan.value = plan;
  isModalVisible.value = true;
};

const plans = ref([
    { name: 'Plano Trimestral', price: 'R$52,00', period: 'mês', features: ['Aulas 4x por semana', 'Turmas de iniciantes'], featured: false },
    { name: 'Plano Anual', price: 'R$47,90', period: 'mês', features: ['Aulas 4x por semana','Acesso a todos os treinos comerciais', 'Turmas do nível iniciante ao avançado', 'Vantagens Exclusivas'], featured: true },
    { name: 'Plano Mensal', price: 'R$62,00', period: 'mês', features: ['Ideal para período de experiência'], featured: false }
]);
</script>

<style scoped>
.pricing-section {
  padding: 60px 0 80px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.pricing-grid {
  display: flex;
  justify-content: center;
  align-items: stretch; 
  gap: 30px;
  flex-wrap: wrap; 
}
</style>