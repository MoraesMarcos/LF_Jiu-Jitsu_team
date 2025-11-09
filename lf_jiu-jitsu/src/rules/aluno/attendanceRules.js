export function canConfirmPresence(aula) {
  if (aula.confirmado) {
    return { ok: false, message: 'Esta aula já foi confirmada.' }
  }

  if (aula.passado) {
    return { ok: false, message: 'Não é possível confirmar presença em uma aula que já passou.' }
  }
  return { ok: true }
}

export function togglePresenceWithRules(aula) {

  if (aula.confirmado) {
    aula.confirmado = false
    return { ok: true, message: 'Confirmação removida.' }
  }

  const check = canConfirmPresence(aula)
  if (!check.ok) return check

  aula.confirmado = true
  return { ok: true, message: 'Presença confirmada!' }
}