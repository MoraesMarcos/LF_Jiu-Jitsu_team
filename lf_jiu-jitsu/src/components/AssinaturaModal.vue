<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">

      <template v-if="viewState === 'form'">
        <button class="close-button" @click="closeModal">×</button>

        <h2>Formulário de Inscrição</h2>
        <p class="subtitle">Você está se inscrevendo no <strong>{{ plan.name }}</strong>.</p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input type="text" id="name" v-model="formData.name" required placeholder="Seu nome completo">
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="formData.email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label for="whatsapp">WhatsApp (com DDD)</label>
            <input type="tel" id="whatsapp" v-model="formData.whatsapp" placeholder="(11) 99999-9999" required>
          </div>

          <button type="submit" class="submit-button" :disabled="isLoading">
            {{ isLoading ? 'Enviando...' : 'Enviar Inscrição' }}
          </button>
        </form>
      </template>

      <template v-else>
        <div class="success-wrap">
          <div class="success-icon">✔</div>
          <h3>Obrigado, {{ firstName }}!</h3>
          <p>Sua inscrição no <strong>{{ plan.name }}</strong> foi recebida com sucesso.</p>
          <p class="small-text">Nossa equipe entrará em contato pelo WhatsApp em breve para finalizar sua matrícula.</p>

          <button class="submit-button mt-20" @click="closeModal">Fechar</button>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const viewState = ref('form'); // 'form' ou 'success'
const isLoading = ref(false);

const formData = ref({
  name: '',
  email: '',
  whatsapp: ''
});

// Pega apenas o primeiro nome para a mensagem de sucesso
const firstName = computed(() => {
  return formData.value.name.split(' ')[0];
});

const handleSubmit = () => {
  isLoading.value = true;

  // Simula o envio para o backend
  setTimeout(() => {
    isLoading.value = false;
    viewState.value = 'success'; // Troca a tela para sucesso
  }, 1000);
};

const closeModal = () => {
  emit('close');
  // Reseta o estado quando fecha, para a próxima vez
  setTimeout(() => {
    viewState.value = 'form';
    formData.value = { name: '', email: '', whatsapp: '' };
  }, 300);
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
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #94a3b8;
  line-height: 1;
}

h2 {
  margin-top: 0;
  margin-bottom: 5px;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.submit-button {
  width: 100%;
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.submit-button:hover {
  background-color: #2563eb;
}

.submit-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* Estilos da Tela de Sucesso (Igual Aula Experimental) */
.success-wrap {
  text-align: center;
  padding: 20px 10px;
}

.success-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-size: 32px;
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
}

.success-wrap h3 {
  font-size: 22px;
  color: #0f172a;
  margin-bottom: 10px;
}

.success-wrap p {
  color: #475569;
  line-height: 1.5;
  margin-bottom: 10px;
}

.small-text {
  font-size: 13px;
  color: #64748b;
}

.mt-20 {
  margin-top: 20px;
}
</style>