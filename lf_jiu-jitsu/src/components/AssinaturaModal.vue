<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      
      <h2>Formulário de Inscrição</h2>
      <p>Você está se inscrevendo no <strong>{{ plan.name }}</strong>.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input type="text" id="name" v-model="formData.name" required>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="formData.email" required>
        </div>
        <div class="form-group">
          <label for="whatsapp">WhatsApp (com DDD)</label>
          <input type="tel" id="whatsapp" v-model="formData.whatsapp" placeholder="(11) 99999-9999" required>
        </div>
        <button type="submit" class="submit-button">Enviar Inscrição</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const formData = ref({
  name: '',
  email: '',
  whatsapp: ''
});

const handleSubmit = () => {
  console.log('Dados do formulário:', formData.value);
  console.log('Plano selecionado:', props.plan.name);
  
  alert(`Obrigado, ${formData.value.name}! Sua inscrição no ${props.plan.name} foi enviada. Entraremos em contato em breve.`);
  
  formData.value = { name: '', email: '', whatsapp: '' };
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}
h2 {
  margin-top: 0;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
</style>