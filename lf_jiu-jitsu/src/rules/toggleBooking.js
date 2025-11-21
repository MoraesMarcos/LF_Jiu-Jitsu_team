import { validateDateRules } from './aluno/dateRules.js'
import { checkSlotCapacity } from './aluno/slotCapacity.js'

export function toggleBookingWithRules(session, userId, now = new Date()) {
    const isCheckingIn = !session.attendees.includes(userId)

    if (!isCheckingIn) {
        // Lógica de Cancelamento (remover usuário)
        const index = session.attendees.indexOf(userId)
        if (index > -1) {
            session.attendees.splice(index, 1)
        }
        return { ok: true, message: 'Presença cancelada.' }
    }

    // Lógica de Check-in (adicionar usuário)

    // 1. Valida Data/Hora
    const dateError = validateDateRules(session.date, session.time, now)
    if (dateError) return { ok: false, message: dateError }

    // 2. Valida Capacidade
    const hasCapacity = () => session.attendees.length < (session.capacity || 20)
    const capError = checkSlotCapacity(hasCapacity, null, null, null)
    if (capError) return { ok: false, message: capError }

    // 3. Adiciona
    session.attendees.push(userId)
    return { ok: true, message: 'Check-in realizado com sucesso!' }
}