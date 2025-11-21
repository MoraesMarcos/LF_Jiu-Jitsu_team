// src/rules/aluno/preventRebooking.js

/**
 * Regra que impede um aluno de fazer novo check-in caso já exista
 * um check-in ativo no mesmo dia/horário.
 *
 * @param {Function} hasActiveBooking - função que verifica se o aluno já tem agendamento
 * @param {String} phone - telefone do aluno
 * @returns {String|null}
 */
export function preventRebooking(hasActiveBooking, phone) {
  if (hasActiveBooking(phone)) {
    return 'Você já possui um agendamento ativo. Conclua ou cancele antes de agendar novamente.'
  }
  return null
}

/**
 * Compatibilidade com versões antigas.
 * Alguns arquivos ainda chamam "alreadyBookedByUser",
 * então mantemos essa função apontando para a mesma lógica.
 *
 * @param {Function} hasActiveBooking
 * @param {String} phone
 * @returns {String|null}
 */
export function alreadyBookedByUser(hasActiveBooking, phone) {
  return preventRebooking(hasActiveBooking, phone)
}
