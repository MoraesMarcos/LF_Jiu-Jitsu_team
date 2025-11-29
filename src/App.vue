<template>
  <Header @openTrialModal="openModal" />
  <RouterView @openTrialModal="openModal" />
  <Footer />
  <AulaExperimental v-model="isModalOpen" />
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AulaExperimental from '@/components/AulaExperimental.vue'

const isModalOpen = ref(false)
const openModal = () => { isModalOpen.value = true }
</script>
