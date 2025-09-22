<template>
  <main>
    <Hero @openTrialModal="$emit('openTrialModal')" />
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

defineEmits(['openTrialModal']);
</script>