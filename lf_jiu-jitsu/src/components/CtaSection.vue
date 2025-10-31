<template>
  <section class="cta-section">
    <div class="container">
      <h2>Pronto para Começar sua Jornada?</h2>
      <p>Sua primeira aula é o primeiro passo para uma grande transformação.</p>

      <div class="button-wrapper">
        <button 
          class="cta-button" 
          @click="$emit('openTrialModal')" 
          title="Agenda sua aula experimental no modal"
        >
          Agende sua Aula Grátis
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>

defineEmits(['openTrialModal']);
</script>

<style scoped>

.cta-section {
  background-color: #1e293b;
  color: white;
  padding: 60px 20px;
  text-align: center;
}
.container h2 {
  font-size: 32px;
  margin-bottom: 15px;
}
.container p {
  color: #cbd5e1;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.cta-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cta-button:hover {
  background-color: #2563eb;
}
</style>