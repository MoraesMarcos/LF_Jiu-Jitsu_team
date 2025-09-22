<template>
  <article class="instructor-card">
    <div class="photo"></div>
    <div class="name">{{ instructor.name }}</div>
    <div class="rank">{{ instructor.rank }}</div>
  </article>
</template>

<script setup>
defineProps({
  instructor: Object
});
</script>

<style scoped>
.instructor-card { background-color: var(--white); border: 1px solid var(--border-color); border-radius: 12px; padding: 30px; text-align: center; width: 260px; flex-shrink: 0; }
.photo { width: 100px; height: 100px; border-radius: 50%; background-color: #D1D5DB; margin: 0 auto 20px; }
.name { font-size: 20px; font-weight: bold; color: var(--dark-gray); margin-bottom: 5px; }
.rank { color: var(--text-light); }
</style>
