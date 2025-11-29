<template>
  <div class="faq-item" :class="{ open: isOpen }">
    <div class="faq-question" @click="toggle">
      <h3>{{ item.question }}</h3>
      <span class="icon">{{ isOpen ? '-' : '+' }}</span>
    </div>
    <div v-if="isOpen" class="faq-answer">
      <p>{{ item.answer }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  item: Object
});

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.faq-item {
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}
.faq-item.open {
  border-color: var(--primary-blue);
}
.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.faq-question h3 {
  font-size: 18px;
  font-weight: 600;
}
.faq-question .icon {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-blue);
}
.faq-answer {
  margin-top: 15px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}
</style>