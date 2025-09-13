<template>
  <section class="page-header">
    <div class="container">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
});
</script>

<style scoped>
.page-header {
  background-color: var(--light-gray);
  text-align: center;
  padding: 60px 0;
}
.page-header h1 {
  font-size: 48px;
  margin-bottom: 10px;
}
.page-header p {
  font-size: 18px;
  color: var(--text-light);
}
</style>