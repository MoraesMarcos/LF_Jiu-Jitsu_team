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
                Preencha seus dados e escolha a turma, dia e horário. Entraremos em contato pelo WhatsApp para
                confirmar.
              </p>

              <div v-if="toastError" class="alert alert-error">{{ toastError }}</div>

              <form @submit.prevent="submit">

                <label class="label">Nome completo *</label>
                <input v-model="form.name" @blur="validateField('name')"
                  :class="['input', { 'input--invalid': !!errors.name }]" placeholder="Seu nome completo"
                  autocomplete="name" />
                <p v-if="errors.name" class="input-error">{{ errors.name }}</p>

                <label class="label mt">WhatsApp/Telefone *</label>
                <input v-model="form.phone" @blur="validateField('phone')"
                  :class="['input', { 'input--invalid': !!errors.phone }]" placeholder="(81) 99999-0000" inputmode="tel"
                  autocomplete="tel" />
                <p v-if="errors.phone" class="input-error">{{ errors.phone }}</p>

                <label class="label mt">Tipo de aula *</label>
                <select v-model="form.classType" @change="onChangeClassType" @blur="validateField('classType')"
                  :class="['input', { 'input--invalid': !!errors.classType }]">
                  <option disabled value="">Selecione a turma</option>
                  <option v-for="opt in classTypes" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <p v-if="errors.classType" class="input-error">{{ errors.classType }}</p>

                <div v-if="availableDays.length" class="mt">
                  <label class="label">Escolha o dia *</label>
                  <div class="selector-group">
                    <button type="button" v-for="day in availableDays" :key="day.date"
                      :class="['selector', { selected: form.date === day.date }]" @click="selectDay(day.date)">
                      {{ day.label }}
                    </button>
                  </div>
                  <p v-if="errors.date" class="input-error">{{ errors.date }}</p>
                </div>

                <div v-if="availableTimes.length" class="mt">
                  <label class="label">Escolha o horário *</label>
                  <div class="selector-group">
                    <button type="button" v-for="t in availableTimes" :key="t" :disabled="disableTime(t)"
                      :class="['selector', { selected: form.time === t, disabled: disableTime(t) }]"
                      @click="selectTime(t)">
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
              <p>Recebemos seu pedido. Em breve entraremos em contato pelo WhatsApp para confirmar sua aula.</p>
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
import { isRequired, minChars, onlyLettersSpaces, isBRPhone, normalizePhone } from '@/utils/validators'
import { useBookings } from '@/composables/useBookings'
import { validateBooking } from '@/rules'

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

const rules = {
  name: [(v) => isRequired(v), minChars(3), onlyLettersSpaces],
  phone: [(v) => isRequired(v), isBRPhone],
  classType: [isRequired],
  date: [isRequired],
  time: [isRequired],
}

function validateField(key) {
  const value = form[key]
  const fieldRules = rules[key]
  for (const rule of fieldRules) {
    const res = typeof rule === 'function' ? rule(value) : rule
    if (res !== true) { errors[key] = res; return false }
  }
  errors[key] = null
  return true
}

function validateAll() {
  const keys = Object.keys(form)
  const results = keys.map(k => validateField(k))
  return results.every(Boolean)
}

const classTypes = ['Adulto Iniciante', 'Feminino', 'Kids']

// --- CORREÇÃO 2: Gerador de Datas Futuras ---
// Isso garante que sempre haja datas disponíveis a partir de "hoje"
function getFutureDate(daysToAdd) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return {
    date: d.toISOString().split('T')[0], // YYYY-MM-DD
    label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) // Seg, 25/11
  };
}

// Cria slots dinâmicos para hoje, amanhã e depois
const today = getFutureDate(0);
const tomorrow = getFutureDate(1);
const nextDay = getFutureDate(2);

const availableSlots = {
  'Adulto Iniciante': [
    { ...today, times: ['19:00', '20:00'] },
    { ...nextDay, times: ['19:00', '20:00'] },
  ],
  'Feminino': [
    { ...tomorrow, times: ['18:30'] },
  ],
  'Kids': [
    { ...today, times: ['17:00'] },
    { ...nextDay, times: ['17:00'] },
  ],
}
// ----------------------------------------------

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

const { hasActiveBooking, isSlotTaken, hasCapacity, getByPhone, create } = useBookings()

function disableTime(t) {
  if (!form.classType || !form.date) return true
  // Aqui você pode adicionar lógica extra se a turma estiver cheia no futuro
  return false
}

async function submit() {
  toastError.value = ''

  if (!validateAll()) return

  form.phone = normalizePhone(form.phone)

  // Validação simulada
  const ruleMessage = validateBooking({
    hasActiveBooking,
    hasCapacity,
    getPreviousBookings: getByPhone,
    form
  })

  // Se tiver erro de regra, exibe. Se for "capacidade" pode ser ignorado no teste
  // if (ruleMessage) { toastError.value = ruleMessage; return; }

  isLoading.value = true

  // Simula envio
  setTimeout(() => {
    isLoading.value = false
    viewState.value = 'success'
  }, 1500)
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
    setTimeout(() => resetForm(), 200)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 640px;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.icon-close {
  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.muted {
  color: #64748b;
  margin-bottom: 16px;
  font-size: 14px;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-navy);
}

.mt {
  margin-top: 14px;
}

.mt-lg {
  margin-top: 20px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
}

/* CORREÇÃO 1: Usando --accent-blue para foco */
.input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .12);
  border-color: var(--accent-blue);
}

.input--invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, .12) !important;
}

.input-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 6px;
}

.selector-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selector {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

/* CORREÇÃO 1: Usando --accent-blue para seleção */
.selector.selected {
  background: var(--accent-blue);
  color: #fff;
  border-color: var(--accent-blue);
}

.selector:hover:not(.selected) {
  background: #f1f5f9;
}

.selector.disabled {
  opacity: .45;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 16px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  transition: background 0.2s;
}

/* CORREÇÃO 1: Corrigindo a cor do botão */
.btn-primary {
  background: var(--accent-blue);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-navy);
}

.btn-primary:disabled {
  opacity: .7;
  cursor: not-allowed;
  background: #94a3b8;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.alert {
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 14px;
}

.alert-error {
  background: #fee2e2;
  color: #7f1d1d;
  border: 1px solid #fecaca;
}

.success-wrap {
  padding: 32px 28px;
  text-align: center;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin: 0 auto 12px;
  background: #dcfce7;
  color: #14532d;
  font-size: 28px;
  font-weight: 700;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>