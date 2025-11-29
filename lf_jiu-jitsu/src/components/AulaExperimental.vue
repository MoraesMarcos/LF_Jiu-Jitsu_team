<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card" role="dialog" aria-modal="true">

          <template v-if="viewState === 'form'">
            <header class="modal-header">
              <h2>Agendar Aula Experimental</h2>
              <button class="icon-close" @click="closeModal" aria-label="Fechar">×</button>
            </header>

            <section class="modal-body">
              <p class="muted">
                Preencha seus dados e escolha a turma, dia e horário. Entraremos em contato pelo WhatsApp para confirmar.
              </p>

              <div v-if="toastError" class="alert alert-error">
                {{ toastError }}
              </div>

              <form @submit.prevent="submit">

                <label class="label">Nome completo *</label>
                <input 
                  v-model="form.name" 
                  @blur="validateField('name')"
                  :class="['input', { 'input--invalid': !!errors.name }]" 
                  placeholder="Seu nome completo"
                  autocomplete="name" 
                />
                <p v-if="errors.name" class="input-error">{{ errors.name }}</p>

                <label class="label mt">WhatsApp/Telefone *</label>
                <input 
                  v-model="form.phone" 
                  @input="aplicarMascaraTelefone"
                  @blur="validateField('phone')"
                  :class="['input', { 'input--invalid': !!errors.phone }]" 
                  placeholder="(81) 99999-0000" 
                  type="tel"
                  maxlength="15"
                  autocomplete="tel" 
                />
                <p v-if="errors.phone" class="input-error">{{ errors.phone }}</p>

                <label class="label mt">Tipo de aula *</label>
                <select 
                  v-model="form.classType" 
                  @change="onChangeClassType" 
                  @blur="validateField('classType')"
                  :class="['input', { 'input--invalid': !!errors.classType }]"
                >
                  <option disabled value="">Selecione a turma</option>
                  <option v-for="opt in classTypes" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <p v-if="errors.classType" class="input-error">{{ errors.classType }}</p>

                <div v-if="availableDays.length" class="mt">
                  <label class="label">Escolha o dia *</label>
                  <div class="selector-group">
                    <button 
                      type="button" 
                      v-for="day in availableDays" 
                      :key="day.date"
                      :class="['selector', { selected: form.date === day.date }]" 
                      @click="selectDay(day.date)"
                    >
                      {{ day.label }}
                    </button>
                  </div>
                  <p v-if="errors.date" class="input-error">{{ errors.date }}</p>
                </div>

                <div v-if="availableTimes.length" class="mt">
                  <label class="label">Escolha o horário *</label>
                  <div class="selector-group">
                    <button 
                      type="button" 
                      v-for="t in availableTimes" 
                      :key="t" 
                      :disabled="disableTime(t)"
                      :class="['selector', { selected: form.time === t, disabled: disableTime(t) }]"
                      @click="selectTime(t)"
                    >
                      {{ t }}
                    </button>
                  </div>
                  <p v-if="errors.time" class="input-error">{{ errors.time }}</p>
                </div>

                <div class="actions mt-lg">
                  <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    {{ isLoading ? 'Enviando...' : 'Agendar Aula' }}
                  </button>
                  <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isLoading">
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          </template>

          <template v-else>
            <section class="success-wrap">
              <div class="success-icon">✔</div>
              <h3>Tudo certo, {{ firstName }}!</h3>
              <p>Seu agendamento foi recebido! Em breve nossa equipe entrará em contato pelo WhatsApp para confirmar os detalhes.</p>
              <button class="btn btn-primary mt" @click="closeModal">Fechar</button>
            </section>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { isRequired, minChars, onlyLettersSpaces, normalizePhone } from '@/utils/validators'
import { useBookings } from '@/composables/useBookings'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const viewState = ref('form')
const isLoading = ref(false)
const toastError = ref('')

const form = reactive({
  name: '',
  phone: '',
  classType: '',
  date: '',
  time: '',
})

const errors = reactive({
  name: null,
  phone: null,
  classType: null,
  date: null,
  time: null,
})

// --- NOVA FUNÇÃO DE MÁSCARA ---
function aplicarMascaraTelefone(e) {
  let v = e.target.value.replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)

  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2")
  } else if (v.length > 0) {
    v = v.replace(/^(\d*)/, "($1")
  }

  form.phone = v
  // Validação em tempo real (opcional, pode tirar se preferir validar só no blur)
  if (v.length > 0 && v.length < 14) {
    errors.phone = 'Telefone incompleto'
  } else {
    errors.phone = null
  }
}

// Regras
const rules = {
  name: [(v) => isRequired(v), minChars(3), onlyLettersSpaces],
  phone: [(v) => isRequired(v)], 
  classType: [isRequired],
  date: [isRequired],
  time: [isRequired],
}

function validateField(key) {
  const value = form[key]
  const fieldRules = rules[key]
  if (!fieldRules) return true

  for (const rule of fieldRules) {
    const res = typeof rule === 'function' ? rule(value) : rule
    if (res !== true) { 
      errors[key] = res; 
      return false 
    }
  }
  
  // Validação extra específica para telefone
  if (key === 'phone') {
    const digits = normalizePhone(value)
    if (digits.length < 10) {
      errors.phone = 'Telefone inválido (mínimo 10 dígitos)'
      return false
    }
  }

  errors[key] = null
  return true
}

function validateAll() {
  const keys = Object.keys(rules)
  const results = keys.map(k => validateField(k))
  return results.every(Boolean)
}

// --- DADOS MOCKADOS ---
const classTypes = ['Adulto Iniciante', 'Feminino', 'Kids']

function getFutureDate(daysToAdd) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return {
    date: d.toISOString().split('T')[0],
    label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
  };
}

const today = getFutureDate(0);
const tomorrow = getFutureDate(1);
const nextDay = getFutureDate(2);

const availableSlots = {
  'Adulto Iniciante': [
    { ...today, times: ['19:00', '20:00'] },
    { ...nextDay, times: ['19:00', '20:00'] },
  ],
  'Feminino': [
    { ...today, times: ['18:00'] },
    { ...tomorrow, times: ['18:30'] },
  ],
  'Kids': [
    { ...today, times: ['17:00'] },
    { ...nextDay, times: ['17:00'] },
  ],
}

const availableDays = computed(() => {
  if (!form.classType) return []
  return availableSlots[form.classType] || []
})

const availableTimes = computed(() => {
  if (!form.classType || !form.date) return []
  const day = (availableSlots[form.classType] || []).find(d => d.date === form.date)
  return day ? day.times : []
})

const firstName = computed(() => (form.name || '').trim().split(' ')[0] || 'aluno(a)')

function onChangeClassType() {
  form.date = ''
  form.time = ''
  errors.date = null
  errors.time = null
}

function selectDay(date) {
  form.date = date
  errors.date = null
  form.time = ''
  errors.time = null
}

function selectTime(t) {
  if (disableTime(t)) return
  form.time = t
  errors.time = null
}

function disableTime(t) {
  return (!form.classType || !form.date)
}

async function submit() {
  toastError.value = ''

  if (!validateAll()) {
    console.log('Erro de validação', errors)
    return
  }

  isLoading.value = true
  
  // Simula envio
  setTimeout(() => {
    isLoading.value = false
    viewState.value = 'success'
  }, 1000)
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.classType = ''
  form.date = ''
  form.time = ''
  Object.keys(errors).forEach(k => errors[k] = null)
  toastError.value = ''
  viewState.value = 'form'
}

function closeModal() {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    setTimeout(() => resetForm(), 300)
  }
})
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, .6); display: grid; place-items: center; padding: 20px; z-index: 2000; backdrop-filter: blur(2px); }
.modal-card { width: 100%; max-width: 500px; background: #fff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, .3); overflow: hidden; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
.modal-header h2 { font-size: 20px; margin: 0; color: #0f172a; }
.icon-close { border: 0; background: transparent; font-size: 28px; line-height: 1; cursor: pointer; color: #64748b; }
.modal-body { padding: 24px; }
.muted { color: #64748b; margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
.label { display: block; font-weight: 600; margin-bottom: 6px; color: #334155; font-size: 14px; }
.mt { margin-top: 16px; }
.mt-lg { margin-top: 24px; }
.input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 15px; transition: border-color 0.2s; }
.input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, .15); }
.input--invalid { border-color: #ef4444; }
.input-error { color: #ef4444; font-size: 12px; margin-top: 4px; }
.selector-group { display: flex; flex-wrap: wrap; gap: 8px; }
.selector { padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 99px; background: #f8fafc; cursor: pointer; font-size: 14px; color: #475569; transition: all 0.2s; }
.selector.selected { background: #3b82f6; color: #fff; border-color: #3b82f6; font-weight: 600; }
.selector:hover:not(.selected):not(:disabled) { background: #e2e8f0; }
.selector:disabled { opacity: 0.5; cursor: not-allowed; }
.actions { display: flex; gap: 12px; }
.btn { flex: 1; padding: 14px; border-radius: 8px; border: 0; cursor: pointer; font-weight: 700; font-size: 16px; transition: filter 0.2s; }
.btn-primary { background: #3b82f6; color: #fff; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
.btn-secondary { background: #f1f5f9; color: #334155; }
.btn-secondary:hover { background: #e2e8f0; }
.alert { padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
.alert-error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
.success-wrap { padding: 40px 32px; text-align: center; }
.success-icon { width: 72px; height: 72px; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 32px; display: grid; place-items: center; margin: 0 auto 20px; }
.success-wrap h3 { margin: 0 0 10px; font-size: 24px; color: #0f172a; }
.success-wrap p { color: #64748b; line-height: 1.6; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>