<template>
  <main>
    <Hero />
    <Modalidades />
    <AboutSection />
    <InstrutorSection />
    <PlanoSection />
  </main>
</template>

<script setup>
import AboutSection from '@/components/AboutSection.vue';
import Modalidades from '@/components/Modalidades.vue';
import Hero from '@/components/Hero.vue';
import InstrutorSection from '@/components/InstrutorSection.vue';
import PlanoSection from '@/components/PlanoSection.vue';
</script>