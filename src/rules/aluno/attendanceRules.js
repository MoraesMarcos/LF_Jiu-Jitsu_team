import { alreadyBookedByUser } from './preventRebooking.js'
import { validateDateRules } from './dateRules.js'
import { checkSlotCapacity } from './slotCapacity.js'

/**
 * Regra completa do check-in do aluno.
 *
 * @param {Object} params
 * @param {string} params.phone
 * @param {Function} params.hasActiveBooking
 * @param {string} params.date
 * @param {string} params.time
 * @param {string} params.classType
 * @param {Function} params.hasCapacity
 *
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateAttendance (params) {
  const {
    phone,
    hasActiveBooking,
    date,
    classType,
    time,
    hasCapacity
  } = params

  // 1) Já tem presença ativa para esse aluno?
  const rebookingMsg = alreadyBookedByUser(hasActiveBooking, phone)
  if (rebookingMsg) {
    return { ok: false, message: rebookingMsg }
  }

  // 2) Regras de data/horário
  const dateMsg = validateDateRules(date, time)
  if (dateMsg) {
    return { ok: false, message: dateMsg }
  }

  // 3) Capacidade
  const capacityMsg = checkSlotCapacity(hasCapacity, classType, date, time)
  if (capacityMsg) {
    return { ok: false, message: capacityMsg }
  }

  return { ok: true }
}
