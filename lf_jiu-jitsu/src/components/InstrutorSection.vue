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
                        <!-- O v-for agora usa a lista estendida com clones no início e no fim -->
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

// --- DADOS ---
const instructors = ref([
    { name: 'Instrutor Principal', rank: 'Faixa Preta 3º Grau' },
    { name: 'Segundo Instrutor', rank: 'Faixa Preta' },
    { name: 'Instrutor Kids', rank: 'Faixa Marrom' },
    { name: 'Instrutora Feminino', rank: 'Faixa Roxa' },
    { name: 'Auxiliar Técnico', rank: 'Faixa Azul' }
]);

// --- VARIÁVEIS DE CONTROLE ---
const cardWidth = 260;
const gap = 30;
const scrollAmount = cardWidth + gap;
const visibleCards = 3; // Quantos cards são visíveis de uma vez
const clonesCount = visibleCards; // Número de clones em cada ponta

const currentIndex = ref(clonesCount); // Começa nos primeiros itens reais
const isResetting = ref(false);
let autoplayInterval = null;

// --- LÓGICA DO LOOP INFINITO (CLONAGEM) ---
const extendedInstructors = computed(() => {
    const startClones = instructors.value.slice(-clonesCount); // Pega os últimos para colocar no início
    const endClones = instructors.value.slice(0, clonesCount);   // Pega os primeiros para colocar no fim
    return [...startClones, ...instructors.value, ...endClones];
});

// --- ESTILO DINÂMICO ---
const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * scrollAmount}px)`
}));

// --- FUNÇÕES DE NAVEGAÇÃO ---
const advanceSlide = (direction) => {
    if (isResetting.value) return; // Previne múltiplos cliques durante o reset
    currentIndex.value += direction;
    resetAutoplay();
};

const next = () => advanceSlide(1);
const prev = () => advanceSlide(-1);

// Função que "pula" de volta para o item real após a animação do clone
const handleTransitionEnd = () => {
    // Se chegamos nos clones do final, pulamos para o início
    if (currentIndex.value >= instructors.value.length + clonesCount) {
        isResetting.value = true;
        currentIndex.value = clonesCount;
    }
    // Se chegamos nos clones do início, pulamos para o final
    if (currentIndex.value < clonesCount) {
        isResetting.value = true;
        currentIndex.value = instructors.value.length + clonesCount - 1;
    }
    // Reativa a transição um instante depois do pulo
    setTimeout(() => {
        isResetting.value = false;
    }, 50);
};

// --- LÓGICA DO AUTOPLAY ---
const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(next, 3000); // Avança a cada 3 segundos
};

const stopAutoplay = () => {
    clearInterval(autoplayInterval);
};

const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
};

// --- CICLO DE VIDA DO COMPONENTE ---
onMounted(startAutoplay);
onUnmounted(stopAutoplay);
</script>

<style scoped>
/* Classe para desativar a animação durante o "pulo" do loop */
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
    width: 870px; /* (260px card + 30px gap) * 3 - 30px gap */
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