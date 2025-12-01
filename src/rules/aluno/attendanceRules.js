import { alreadyBookedByUser } from './preventRebooking.js'
import { validateDateRules } from './dateRules.js'
import { checkSlotCapacity } from './slotCapacity.js'

/**

 * @param {Object} params
 * @param {string} params.phone
 * @param {Function} params.hasActiveBooking
 * @param {string} params.date
 * @param {string} params.time
 * @param {string} params.classType
 * @param {Function} params.hasCapacity
 
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

  const rebookingMsg = alreadyBookedByUser(hasActiveBooking, phone)
  if (rebookingMsg) {
    return { ok: false, message: rebookingMsg }
  }

  const dateMsg = validateDateRules(date, time)
  if (dateMsg) {
    return { ok: false, message: dateMsg }
  }

  const capacityMsg = checkSlotCapacity(hasCapacity, classType, date, time)
  if (capacityMsg) {
    return { ok: false, message: capacityMsg }
  }

  return { ok: true }
}
