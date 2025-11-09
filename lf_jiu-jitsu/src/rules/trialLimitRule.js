import { withinDays } from '@/utils/validators'

export function trialLimitRule(previousBookings) {
  if (previousBookings.some(b => withinDays(b.createdAt, 30))) {
    return 'Você já realizou uma aula experimental recentemente. Aguarde 30 dias para novo agendamento.'
  }
  return null
}