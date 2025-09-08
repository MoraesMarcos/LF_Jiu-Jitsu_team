<template>
    <section class="instrutor">
        <div class="container">
            <h2>Aprenda com os Melhores</h2>
            <div class="carousel">
                <div class="carousel-arrow" @click="prev">&lt;</div>

                <div class="carousel-wrapper">
                    <div
                        class="carousel-track"
                        :style="trackStyle"
                        :class="{ 'no-transition': isResetting }"
                    >
                        <article v-for="(instructor, index) in extendedInstructors" :key="index" class="instructor-card">
                            <div class="photo"></div>
                            <div class="name">{{ instructor.name }}</div>
                            <div class="rank">{{ instructor.rank }}</div>
                        </article>
                    </div>
                </div>

                <div class="carousel-arrow" @click="next">&gt;</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const instructors = ref([
    { name: 'Instrutor Principal', rank: 'Faixa Preta 3º Grau' },
    { name: 'Segundo Instrutor', rank: 'Faixa Preta' },
    { name: 'Instrutor Kids', rank: 'Faixa Marrom' },
    { name: 'Instrutora Feminino', rank: 'Faixa Roxa' },
    { name: 'Auxiliar Técnico', rank: 'Faixa Azul' }
]);

const currentIndex = ref(0);
const cardWidth = 260;
const gap = 30;
const scrollAmount = cardWidth + gap;
let autoplayInterval = null;
const isResetting = ref(false);

const extendedInstructors = computed(() => [...instructors.value, ...instructors.value.slice(0, 3)]);

const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * scrollAmount}px)`
}));

const advanceSlide = () => {
    currentIndex.value++;

    if (currentIndex.value >= instructors.value.length) {
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
    autoplayInterval = setInterval(() => {
        advanceSlide();
    }, 3000); 
};

const stopAutoplay = () => {
    clearInterval(autoplayInterval);
};

const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
};

onMounted(() => {
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
});
</script>

<style scoped>

.no-transition {
    transition: none !important;
}
.instructors {
    background-color: var(--light-gray);
    overflow: hidden;
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
    z-index: 10;
}
.instructor-card {
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    width: 260px;
    flex-shrink: 0;
}
.instructor-card .photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #D1D5DB;
    margin: 0 auto 20px;
}
.instructor-card .name {
    font-size: 20px;
    font-weight: bold;
    color: var(--dark-gray);
    margin-bottom: 5px;
}
.instructor-card .rank {
    color: var(--text-light);
}
</style>