<template>
    <section class="plans">
        <div class="container">
            <h2>Planos que se Encaixam na sua Rotina</h2>
            <div class="carousel">
                <div class="carousel-arrow" @click="prev">&lt;</div>
                <div class="carousel-wrapper">
                    <div 
                        class="carousel-track" 
                        :style="trackStyle"
                        :class="{ 'no-transition': isResetting }"
                    >
                        <PlanCard 
                            v-for="(plan, index) in extendedPlans" 
                            :key="index" 
                            :plan="plan" 
                        />
                    </div>
                </div>
                <div class="carousel-arrow" @click="next">&gt;</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PlanCard from '@/components/PlanoCard.vue';

const plans = ref([
    { name: 'Plano Básico', price: 'R$180', period: 'mês', features: ['Aulas 2x por semana', 'Turmas de iniciantes'], featured: false },
    { name: 'Plano Total', price: 'R$250', period: 'mês', features: ['Acesso livre a todas as aulas', 'Turmas de iniciantes e avançados', 'Acesso ao conteúdo exclusivo'], featured: true },
    { name: 'Plano Anual', price: 'R$2200', period: 'ano', features: ['Desconto especial', 'Acesso livre por 12 meses'], featured: false }
]);

const currentIndex = ref(0);
const cardWidth = 300;
const gap = 30;
const scrollAmount = cardWidth + gap;
let autoplayInterval = null;
const isResetting = ref(false);

const extendedPlans = computed(() => [...plans.value, plans.value[0]]);

const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * scrollAmount}px)`
}));

const advanceSlide = () => {
    currentIndex.value++;
    if (currentIndex.value >= plans.value.length) {
        setTimeout(() => {
            isResetting.value = true;
            currentIndex.value = 0;
            setTimeout(() => {
                isResetting.value = false;
            }, 50);
        }, 500);
    }
};

const next = () => {
    advanceSlide();
    resetAutoplay();
};

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
    resetAutoplay();
};

const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(advanceSlide, 3000);
};

const stopAutoplay = () => {
    clearInterval(autoplayInterval);
};

const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
};

onMounted(startAutoplay);
onUnmounted(stopAutoplay);
</script>

<style scoped>
.no-transition {
    transition: none !important;
}
.plans {
    overflow-x: hidden; 
}
.carousel {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
}
.carousel-wrapper {
    width: 300px; 
    overflow: hidden; 
}
.carousel-track {
    display: flex;
    gap: 30px;
    transition: transform 0.5s ease-in-out; 
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
:deep(.plan-card.featured) {
    transform: scale(1.0);
}
</style>