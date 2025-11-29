// src/rules/validateBooking.js

import { preventRebooking } from './aluno/preventRebooking.js'
import { validateDateRules } from './aluno/dateRules.js'
import { trialLimitRule } from './trialLimitRule.js'
import { checkSlotCapacity } from './aluno/slotCapacity.js'

/**
 * Valida todas as regras de agendamento de aula.
 * Retorna:
 *   - string com mensagem de erro, se algo estiver inválido
 *   - null se estiver tudo ok
 */
export function validateBooking({
  hasActiveBooking,   // função: (phone) => boolean
  phone,              // telefone do aluno
  classType,          // tipo de aula (Ex: 'Crossfit', 'Jiu-Jitsu', etc.)
  date,               // data da aula (string ou Date)
  time,               // horário da aula (string)
  hasCapacity,        // função: (classType, date, time) => boolean
  isTrialStudent,     // se é aluno de aula experimental
  currentTrialCount,  // quantas aulas experimentais já fez
}) {
  // 1) não deixar remarcar se já tem agendamento ativo
  const rebookError = preventRebooking(hasActiveBooking, phone)
  if (rebookError) return rebookError

  // 2) regras de data (passado, muito distante, etc.)
  const dateError = validateDateRules(date)
  if (dateError) return dateError

  // 3) limite de aulas experimentais
  const trialError = trialLimitRule(isTrialStudent, currentTrialCount)
  if (trialError) return trialError

  // 4) capacidade do horário
  const capacityError = checkSlotCapacity(hasCapacity, classType, date, time)
  if (capacityError) return capacityError

  // Tudo ok
  return null
}
