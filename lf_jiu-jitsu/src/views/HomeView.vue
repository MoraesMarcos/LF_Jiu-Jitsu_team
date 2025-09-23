<template>
  <main>
    <Hero @openTrialModal="openModal" />
    <Modalidades />
    <AboutSection />
    <InstrutorSection />
    <PlanoSection @openTrialModal="$emit('openTrialModal')" />
    <CtaSection />
  </main>
</template>

<script setup>
import AboutSection from '@/components/AboutSection.vue';
import CtaSection from '@/components/CtaSection.vue';
import InstrutorSection from '@/components/InstrutorSection.vue';
import Modalidades from '@/components/Modalidades.vue';
import PlanoSection from '@/components/PlanoSection.vue';
import Hero from '@/components/Hero.vue';

// Defina o evento que será emitido para o componente pai (App.vue)
const emit = defineEmits(['openTrialModal']);

// O método openModal é acionado ao receber o evento de Hero.vue
const openModal = () => {
  // Emite o evento para o componente App.vue
  emit('openTrialModal');
};
</script>