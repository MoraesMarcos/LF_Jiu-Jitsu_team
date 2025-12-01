/**

 * @param {Function} hasActiveBooking 
 * @param {String} phone 
 * @returns {String|null}
 */
export function preventRebooking (hasActiveBooking, phone) {
  if (hasActiveBooking(phone)) {
    return 'Você já possui um agendamento ativo. Conclua ou cancele antes de agendar novamente.'
  }
  return null
}

export function alreadyBookedByUser (hasActiveBooking, phone) {
  return preventRebooking(hasActiveBooking, phone)
}
