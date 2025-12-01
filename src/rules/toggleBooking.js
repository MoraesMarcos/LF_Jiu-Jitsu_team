import { validateDateRules } from './aluno/dateRules.js'
import { checkSlotCapacity } from './aluno/slotCapacity.js'

/**
 * @param {Object} session 
 * @param {string|number} userId 
 * @param {Date} now
 * @returns {{ok: boolean, message: string}}
 */

export function toggleBookingWithRules (session, userId, now = new Date()) {
  const isCheckingIn = !session.attendees.includes(userId)

  if (!isCheckingIn) {
    const index = session.attendees.indexOf(userId)
    if (index > -1) {
      session.attendees.splice(index, 1)
    }
    return { ok: true, message: 'Presença cancelada.' }
  }

  const dateError = validateDateRules(session.date, session.time, now)
  if (dateError) {
    return { ok: false, message: dateError }
  }

  const hasCapacity = () =>
    session.attendees.length < (session.capacity || 20)

  const capError = checkSlotCapacity(hasCapacity, null, null, null)
  if (capError) {
    return { ok: false, message: capError }
  }

  session.attendees.push(userId)
  return { ok: true, message: 'Check-in realizado com sucesso!' }
}
