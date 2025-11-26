/**
 * Regra que impede um aluno de fazer novo check-in caso já exista
 * um check-in ativo.
 *
 * @param {Function} hasActiveBooking - função que verifica se o aluno já tem agendamento
 * @param {String} phone - telefone do aluno (identificador)
 * @returns {String|null}
 */
export function preventRebooking (hasActiveBooking, phone) {
  if (hasActiveBooking(phone)) {
    return 'Você já possui um agendamento ativo. Conclua ou cancele antes de agendar novamente.'
  }
  return null
}

/**
 * Compatibilidade com versões antigas.
 */
export function alreadyBookedByUser (hasActiveBooking, phone) {
  return preventRebooking(hasActiveBooking, phone)
}
