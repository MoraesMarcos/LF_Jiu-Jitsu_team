export function preventRebooking(hasActiveBooking, phone) {
if (hasActiveBooking(phone)) {
return 'Você já possui um agendamento ativo. Conclua ou cancele antes de agendar novamente.'
}
return null
}