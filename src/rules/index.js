// src/rules/index.js
export { validateLogin } from './aluno/loginRules.js'
export { validateProfile } from './aluno/profileRules.js'
export { canGenerateInvoice } from './aluno/paymentRules.js'

export { validateAttendance } from './aluno/attendanceRules.js'

export { validateBooking } from './validateBooking.js'
export { validateDateRules } from './aluno/dateRules.js'
export { trialLimitRule } from './trialLimitRule.js'
export { preventRebooking } from './aluno/preventRebooking.js'
export { checkSlotCapacity } from './aluno/slotCapacity.js'

// Export oficial
export { toggleBookingWithRules } from './toggleBooking.js'

// Alias para não quebrar nenhum import antigo:
export { toggleBookingWithRules as togglePresenceWithRules } from './toggleBooking.js'
