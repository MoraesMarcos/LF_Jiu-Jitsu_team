// src/rules/index.js

// Regras de login / perfil / pagamentos (ALUNO)
export { validateLogin } from './aluno/loginRules.js'
export { validateProfile } from './aluno/profileRules.js'
export { canGenerateInvoice } from './aluno/paymentRules.js'

// Regras de presença do aluno
export { togglePresenceWithRules } from './aluno/attendanceRules.js'

// Regras de agendamento (check-in / booking)
export { validateBooking } from './validateBooking.js'
export { validateDateRules } from './aluno/dateRules.js'
export { trialLimitRule } from './trialLimitRule.js'
export { preventRebooking } from './aluno/preventRebooking.js'
export { checkSlotCapacity } from './aluno/slotCapacity.js'
