// src/rules/aluno/dateRules.js

/**
 * Converte data (AAAA-MM-DD) e hora (HH:mm) para um Date.
 */
function toDateTime(dateStr, timeStr) {
  // Ex: '2025-11-20' + '19:00' → '2025-11-20T19:00:00'
  const iso = `${dateStr}T${timeStr}:00`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Valida regras de data/horário para check-in.
 *
 * Regras de exemplo:
 *  - data e hora obrigatórias e válidas
 *  - não permitir check-in para horário que já passou
 *  - não permitir agendar muito longe no passado/futuro (opcional)
 *
 * @param {string} dateStr - '2025-11-20'
 * @param {string} timeStr - '19:00'
 * @param {Date}   now     - data/hora atual (por padrão new Date())
 * @returns {string|null}  - mensagem de erro ou null se estiver tudo ok
 */
export function validateDateRules(dateStr, timeStr, now = new Date()) {
  if (!dateStr || !timeStr) {
    return 'Data e horário são obrigatórios.'
  }

  const slotStart = toDateTime(dateStr, timeStr)
  if (!slotStart) {
    return 'Data ou horário inválidos.'
  }

  // Não permitir check-in em horário que já passou
  if (slotStart.getTime() < now.getTime()) {
    return 'Não é possível fazer check-in para um horário que já passou.'
  }

  // (Opcional) exemplo: não deixar agendar com mais de 7 dias de antecedência
  const MAX_DIAS_ANTECEDENCIA = 7
  const diffDias = (slotStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDias > MAX_DIAS_ANTECEDENCIA) {
    return `Você só pode agendar com até ${MAX_DIAS_ANTECEDENCIA} dias de antecedência.`
  }

  return null
}
