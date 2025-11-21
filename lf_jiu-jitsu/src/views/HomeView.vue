<template>
  <main>
    <Hero @openTrialModal="openModal" />

    <Modalidades />
    <AboutSection />
    <InstrutorSection />

    <PlanoSection @openTrialModal="$emit('openTrialModal')" />

    <CtaSection @openTrialModal="openModal" />
  </main>
</template>

<script setup>
import AboutSection from '@/components/AboutSection.vue';
import CtaSection from '@/components/CtaSection.vue';
import InstrutorSection from '@/components/InstrutorSection.vue';
import Modalidades from '@/components/Modalidades.vue';
import PlanoSection from '@/components/PlanoSection.vue';
import Hero from '@/components/Hero.vue';

const emit = defineEmits(['openTrialModal']);

const openModal = () => {
  // Repassa o evento para o componente pai (App.vue)
  emit('openTrialModal');
};
</script>