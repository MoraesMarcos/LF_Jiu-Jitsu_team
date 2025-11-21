// src/rules/aluno/attendanceRules.js

import { alreadyBookedByUser } from './preventRebooking.js'
import { validateDateRules } from './dateRules.js'
import { checkSlotCapacity } from './slotCapacity.js'

/**
 * Regra completa do check-in do aluno.
 * Integra:
 *  1) Verificar se já existe agendamento para o mesmo horário (preventRebooking)
 *  2) Validar data/horário (dateRules)
 *  3) Validar limite de vagas da turma (slotCapacity)
 *
 * @param {Object} params
 * @param {string} params.phone               - telefone / identificador do aluno
 * @param {Function} params.hasActiveBooking  - função que recebe phone e retorna se já tem agendamento
 * @param {string} params.date                - data no formato 'AAAA-MM-DD'
 * @param {string} params.time                - hora no formato 'HH:mm'
 * @param {string} params.classType           - tipo da aula (Adulto, Kids, Feminino, etc.)
 * @param {Function} params.hasCapacity       - função que recebe (classType, date, time) e diz se há vaga
 *
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateAttendance(params) {
  const {
    phone,
    hasActiveBooking,
    date,
    classType,
    time,
    hasCapacity,
  } = params

  // 1️⃣ Já tem presença ativa para esse aluno?
  const rebookingMsg = alreadyBookedByUser(hasActiveBooking, phone)
  if (rebookingMsg) {
    return { ok: false, message: rebookingMsg }
  }

  // 2️⃣ Regras de data/horário
  const dateMsg = validateDateRules(date, time)
  if (dateMsg) {
    return { ok: false, message: dateMsg }
  }

  // 3️⃣ Capacidade de vagas na turma
  const capacityMsg = checkSlotCapacity(hasCapacity, classType, date, time)
  if (capacityMsg) {
    return { ok: false, message: capacityMsg }
  }

  // Tudo ok
  return { ok: true }
}
