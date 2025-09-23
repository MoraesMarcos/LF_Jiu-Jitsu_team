<template>
    <section class="instructors">
        <div class="container">
            <h2>Aprenda com os Melhores</h2>
            <div class="carousel">
                <div class="carousel-arrow" @click="prev">&lt;</div>
                <div class="carousel-wrapper">
                    <div 
                        class="carousel-track" 
                        :style="trackStyle"
                        :class="{ 'no-transition': isResetting }"
                        @transitionend="handleTransitionEnd"
                    >
                        <InstructorCard 
                            v-for="(instructor, index) in extendedInstructors" 
                            :key="index" 
                            :instructor="instructor" 
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
import InstructorCard from '@/components/InstrutorCard.vue';

import instrutorPrincipal from '@/assets/images/instrutores/instrutor_principal.png';
import instrutorAdulto from '@/assets/images/instrutores/instrutor_adulto.jpg';
import instrutoraFemininoKids from '@/assets/images/instrutores/instrutor_kids_feminino.png';
import instrutorAuxiliar from '@/assets/images/instrutores/instrutor_auxiliar.jpg';

const instructors = ref([
    { name: 'Instrutor Principal', rank: 'Faixa Preta', image: instrutorPrincipal },
    { name: 'Instrutor Adultos', rank: 'Faixa Roxa', image: instrutorAdulto },
    { name: 'Instrutora Feminino/Kids', rank: 'Faixa Roxa', image: instrutoraFemininoKids },
    { name: 'Auxiliar Técnico', rank: 'Faixa Azul', image: instrutorAuxiliar }
]);

const cardWidth = 260;
const gap = 30;
const scrollAmount = cardWidth + gap;
const visibleCards = 3; 
const clonesCount = visibleCards; 

const currentIndex = ref(clonesCount); 
const isResetting = ref(false);
let autoplayInterval = null;

const extendedInstructors = computed(() => {
    const startClones = instructors.value.slice(-clonesCount); 
    const endClones = instructors.value.slice(0, clonesCount);   
    return [...startClones, ...instructors.value, ...endClones];
});

const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * scrollAmount}px)`
}));

const advanceSlide = (direction) => {
    if (isResetting.value) return; 
    currentIndex.value += direction;
    resetAutoplay();
};

const next = () => advanceSlide(1);
const prev = () => advanceSlide(-1);

const handleTransitionEnd = () => {
    
    if (currentIndex.value >= instructors.value.length + clonesCount) {
        isResetting.value = true;
        currentIndex.value = clonesCount;
    }
   
    if (currentIndex.value < clonesCount) {
        isResetting.value = true;
        currentIndex.value = instructors.value.length + clonesCount - 1;
    }
   
    setTimeout(() => {
        isResetting.value = false;
    }, 50);
};

const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(next, 3000);
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
.instructors { 
    background-color: var(--light-gray); 
}
.carousel { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    gap: 30px; 
}
.carousel-wrapper { 
    width: 870px; 
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
}
</style>