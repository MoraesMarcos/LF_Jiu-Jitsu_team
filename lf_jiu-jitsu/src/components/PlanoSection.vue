<template>
    <section class="plans-section">
        <div class="container">
            <h2>Planos que se Encaixam na sua Rotina</h2>
            <p class="subtitle">Encontre a opção perfeita para sua jornada no tatame.</p>
            
            <div class="carousel">
                <div class="carousel-arrow" @click="prev">&lt;</div>
                
                <div class="carousel-wrapper">
                    <div class="carousel-track" :style="trackStyle">
                        <PlanoCard 
                            v-for="(plan, index) in plans" 
                            :key="plan.name" 
                            :plan="plan"
                            :class="{ 'is-active': index === currentIndex }" 
                        />
                    </div>
                </div>

                <div class="carousel-arrow" @click="next">&gt;</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import PlanoCard from '@/components/PlanoCard.vue';

const plans = ref([
    { name: 'Plano Básico', price: 'R$180', period: 'mês', features: ['Aulas 2x por semana', 'Turmas de iniciantes'], featured: false },
    { name: 'Plano Total', price: 'R$250', period: 'mês', features: ['Acesso livre a todas as aulas', 'Turmas de iniciantes e avançados', 'Acesso ao conteúdo exclusivo'], featured: true },
    { name: 'Plano Anual', price: 'R$2200', period: 'ano', features: ['Desconto especial', 'Acesso livre por 12 meses'], featured: false }
]);

const currentIndex = ref(1); // Começa com o "Plano Total" (índice 1) no centro
const cardWidth = 320;
const gap = 30;

const trackStyle = computed(() => {
    // Calcula o deslocamento para centralizar o card ativo
    const wrapperWidth = 870; // A largura visível da área do carrossel
    const cardCenter = cardWidth / 2;
    const wrapperCenter = wrapperWidth / 2;
    const offset = currentIndex.value * (cardWidth + gap);
    const totalOffset = wrapperCenter - cardCenter - offset;
    return {
        transform: `translateX(${totalOffset}px)`
    };
});

const next = () => {
    if (currentIndex.value < plans.value.length - 1) {
        currentIndex.value++;
    }
};

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};
</script>

<style scoped>
.plans-section {
    background-color: var(--light-gray);
    padding: 80px 0;
    overflow-x: hidden; /* Evita barras de rolagem indesejadas */
}
.subtitle {
    text-align: center;
    margin-top: -40px;
    margin-bottom: 60px;
    color: var(--text-light);
}
.carousel {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
}
.carousel-wrapper {
    width: 870px; /* Largura para visualizar 3 cards, mesmo que desfocados */
    overflow: hidden;
    position: relative;
}
.carousel-track {
    display: flex;
    gap: 30px;
    transition: transform 0.5s ease-in-out;
    padding: 20px 0; /* Espaço para o card ativo "crescer" */
}
.carousel-arrow {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background-color: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    user-select: none;
    z-index: 10;
    flex-shrink: 0;
}
/* O seletor :deep aplica o estilo ao componente filho */
:deep(.plan-card) {
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: 0.5;
    transform: scale(0.9);
}
:deep(.plan-card.is-active) {
    opacity: 1;
    transform: scale(1.05); /* Efeito de destaque para o card central */
}
</style>
