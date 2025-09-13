<template>
  <section class="cta-section">
    <div class="container">
      <h2>Pronto para Começar sua Jornada?</h2>
      <p>Sua primeira aula é o primeiro passo para uma grande transformação.</p>
      <a href="#" class="btn btn-primary">Agende sua Aula Grátis</a>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
.cta-section {
  background-color: var(--dark-gray);
  color: var(--white);
  padding: 80px 0;
}

.cta-section .container {
  
  display: flex;
  flex-direction: column; 
  align-items: center;   
  text-align: center;    
}

.cta-section h2 {
  color: var(--white);
  font-size: 36px;
  margin-bottom: 15px;
}

.cta-section p {
  color: #D1D5DB;
  margin-bottom: 30px;
  max-width: 500px; 
}

.cta-section .btn {
  font-size: 18px;
  padding: 15px A30px;
}
</style>