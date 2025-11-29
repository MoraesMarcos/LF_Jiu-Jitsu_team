<template>
  <section class="faq-section">
    <div class="container">
      <h2>Perguntas Frequentes</h2>
      <div class="faq-list">
        <FaqItem v-for="(item, index) in faqItems" :key="index" :item="item" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import FaqItem from '@/components/FaqItem.vue';

const faqItems = ref([
  { question: 'Preciso de kimono para a aula experimental?', answer: 'Não, para a sua primeira aula você pode vir com uma roupa de ginástica confortável. Nós emprestamos o kimono se necessário.' },
  { question: 'Qual a idade mínima para começar a treinar?', answer: 'Temos turmas para crianças a partir dos 5 anos de idade, com aulas adaptadas para cada faixa etária.' },
  { question: 'Existem turmas exclusivamente femininas?', answer: 'Sim, possuímos horários com turmas exclusivamente femininas para proporcionar um ambiente ainda mais confortável para nossas alunas.' },
  { question: 'A academia cobra taxa de matrícula?', answer: 'Não, em nossos planos não há cobrança de taxa de matrícula ou anuidade. O valor da mensalidade é o valor final.' }
]);
</script>

<style scoped>
.faq-section {
  background-color: var(--light-gray);
  padding: 80px 0;
}
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>