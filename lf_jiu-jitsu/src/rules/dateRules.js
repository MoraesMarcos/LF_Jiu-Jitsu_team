import { isPast, toISODateTime, diffInMinutes } from '@/utils/validators'

export function validateDateRules(date, time) {
  if (isPast(date)) {
    return 'Não é possível agendar para um dia que já passou.'
  }

  const iso = toISODateTime(date, time)
  if (diffInMinutes(iso) < 120) {
    return 'Agende com pelo menos 2 horas de antecedência.'
  }

  return null
}