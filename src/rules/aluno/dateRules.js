/**
 * Converte data (AAAA-MM-DD) e hora (HH:mm) para um Date.
 */
function toDateTime (dateStr, timeStr) {
  const iso = `${dateStr}T${timeStr}:00`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Valida regras de data/horário para check-in.
 *
 * - data e hora obrigatórias e válidas
 * - não permitir check-in para horário que já passou
 * - não permitir agendar com mais de 7 dias de antecedência
 */
export function validateDateRules (dateStr, timeStr, now = new Date()) {
  if (!dateStr || !timeStr) {
    return 'Data e horário são obrigatórios.'
  }

  const slotStart = toDateTime(dateStr, timeStr)
  if (!slotStart) {
    return 'Data ou horário inválidos.'
  }

  if (slotStart.getTime() < now.getTime()) {
    return 'Não é possível fazer check-in para um horário que já passou.'
  }

  const MAX_DIAS_ANTECEDENCIA = 7
  const diffDias =
    (slotStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDias > MAX_DIAS_ANTECEDENCIA) {
    return `Você só pode agendar com até ${MAX_DIAS_ANTECEDENCIA} dias de antecedência.`
  }

  return null
}
