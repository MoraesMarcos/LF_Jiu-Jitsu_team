<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/Header.vue'
import TheFooter from '@/components/Footer.vue'
</script>

<style>
@import '@/assets/main.css';
</style>