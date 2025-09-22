<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-card" @click.stop>
          
          <div v-if="viewState === 'form'" class="modal-content">
            <div class="modal-header">
              <div>
                <h2>Agende sua Aula Experimental</h2>
                <p>É rápido, fácil e o primeiro passo para começar.</p>
              </div>
              <button class="close-button" @click="closeModal">✕</button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">NOME COMPLETO *</label>
                <input type="text" id="name" v-model="form.name" placeholder="Seu nome aqui" required />
              </div>

              <div class="form-group">
                  <label for="phone">WHATSAPP / TELEFONE *</label>
                  <input type="tel" id="phone" v-model="form.phone" placeholder="(XX) XXXXX-XXXX" required />
              </div>
              <div class="form-group">
                  <label>QUAL TIPO DE AULA? *</label>
                  <div class="selector-group">
                      <button 
                        type="button" 
                        v-for="classType in classTypes" 
                        :key="classType"
                        :class="{ selected: selectedClassType === classType }"
                        @click="selectClassType(classType)"
                      >
                        {{ classType }}
                      </button>
                  </div>
              </div>
              
              <div class="form-group" v-if="selectedClassType">
                  <label>ESCOLHA O DIA *</label>
                  <div class="selector-group">
                      <button 
                        type="button" 
                        v-for="day in availableDays" 
                        :key="day.date"
                        :class="{ selected: selectedDay === day.date }"
                        @click="selectDay(day.date)"
                      >
                        {{ day.label }}
                      </button>
                  </div>
              </div>

              <div class="form-group" v-if="selectedDay">
                  <label>ESCOLHA O HORÁRIO (VAGAS PARA INICIANTES) *</label>
                  <div class="selector-group">
                       <button 
                        type="button" 
                        v-for="time in availableTimes" 
                        :key="time"
                        :class="{ selected: selectedTime === time }"
                        @click="selectTime(time)"
                      >
                        {{ time }}
                      </button>
                  </div>
              </div>
              
              <button type="submit" class="btn btn-primary submit-btn" :disabled="isLoading">
                {{ isLoading ? 'Enviando...' : 'Confirmar Agendamento' }}
              </button>
            </form>
          </div>

          <div v-if="viewState === 'success'" class="modal-content success-view">
            <div class="success-icon">✓</div>
            <h2>Agendamento Confirmado!</h2>
            <p>
              Tudo certo, {{ form.name }}! Entraremos em contato pelo WhatsApp em breve.
              <br>Mal podemos esperar para te ver no tatame.
            </p>
            <button class="btn btn-primary" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const viewState = ref('form');
const isLoading = ref(false);

// Objeto do formulário ATUALIZADO (sem email)
const form = reactive({
  name: '',
  phone: ''
});

// Lógica de agendamento (sem alterações aqui)
const classTypes = ref(['Adulto', 'Feminino', 'Kids']);
const selectedClassType = ref(null);
const availableSlots = ref({
    Adulto: [
        { date: '2025-09-22', label: 'Seg, 22/09', times: ['07:00', '18:00', '19:30'] },
        { date: '2025-09-23', label: 'Ter, 23/09', times: ['18:00', '19:30'] },
        { date: '2025-09-24', label: 'Qua, 24/09', times: ['07:00', '19:30'] }
    ],
    Feminino: [
        { date: '2025-09-23', label: 'Ter, 23/09', times: ['19:00'] },
        { date: '2025-09-25', label: 'Qui, 25/09', times: ['19:00'] }
    ],
    Kids: [
        { date: '2025-09-22', label: 'Seg, 22/09', times: ['17:00'] },
        { date: '2025-09-24', label: 'Qua, 24/09', times: ['17:00'] }
    ]
});
const selectedDay = ref(null);
const selectedTime = ref(null);
const availableDays = computed(() => {
    if (!selectedClassType.value) return [];
    return availableSlots.value[selectedClassType.value];
});
const availableTimes = computed(() => {
    if (!selectedDay.value) return [];
    const dayData = availableDays.value.find(d => d.date === selectedDay.value);
    return dayData ? dayData.times : [];
});
const selectClassType = (type) => {
    selectedClassType.value = type;
    selectedDay.value = null;
    selectedTime.value = null;
};
const selectDay = (date) => {
    selectedDay.value = date;
    selectedTime.value = null;
};
const selectTime = (time) => {
    selectedTime.value = time;
};

// Validação ATUALIZADA (sem verificação de email)
const handleSubmit = async () => {
  if (!form.name || !form.phone || !selectedClassType.value || !selectedDay.value || !selectedTime.value) {
      alert('Por favor, preencha todos os campos e selecione um tipo de aula, dia e horário.');
      return;
  }
  
  isLoading.value = true;
  
  console.log('Enviando dados:', {
    ...form,
    classType: selectedClassType.value,
    day: selectedDay.value,
    time: selectedTime.value
  });
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  isLoading.value = false;
  viewState.value = 'success';
};

// Reset do formulário ATUALIZADO (sem email)
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      viewState.value = 'form';
      form.name = '';
      form.phone = '';
      selectedClassType.value = null;
      selectedDay.value = null;
      selectedTime.value = null;
    }, 300);
  }
});
</script>

<style scoped>
.modal-card {
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content {
  padding: 25px 35px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}
.form-group {
  margin-bottom: 18px;
}
.modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(31,41,55,.6);display:flex;justify-content:center;align-items:center;z-index:1000}.modal-card{background-color:#fff;border-radius:16px;width:90%;max-width:700px;box-shadow:0 10px 25px rgba(0,0,0,.1);transform:scale(1)}.modal-header h2{font-size:28px;text-align:left;margin-bottom:5px}.modal-header p{font-size:16px;color:var(--text-light)}.close-button{background:0 0;border:none;font-size:24px;color:#9ca3af;cursor:pointer}.form-group label{display:block;font-size:14px;font-weight:700;color:var(--medium-gray);margin-bottom:8px}.form-group input{width:100%;padding:12px 15px;border:1px solid #d1d5db;border-radius:8px;font-size:15px}.selector-group{display:flex;gap:10px;flex-wrap:wrap}.selector-group button{padding:10px 20px;border:1px solid #d1d5db;background-color:#fff;border-radius:20px;font-size:15px;cursor:pointer;transition:all .2s}.selector-group button.selected{background-color:#dbeafe;border-color:var(--primary-blue);color:var(--primary-blue);font-weight:700}.submit-btn{width:100%;padding:15px;margin-top:20px}.submit-btn:disabled{background-color:#9ca3af;cursor:not-allowed}.success-view{text-align:center;padding:60px 40px}.success-icon{width:70px;height:70px;border-radius:50%;background-color:#d1fae5;color:#10b981;font-size:40px;font-weight:700;display:flex;justify-content:center;align-items:center;margin:0 auto 20px}.success-view h2{font-size:28px;margin-bottom:15px}.success-view p{margin-bottom:30px;line-height:1.6}.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .3s ease}.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
</style>