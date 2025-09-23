<template>
  <Header @openTrialModal="openModal" />
  
  <RouterView @openTrialModal="openModal" />
  
  <Footer />

  <AulaExperimental v-model="isModalOpen" />
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import AulaExperimental from '@/components/AulaExperimental.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style>
@import '@/assets/main.css';
</style>