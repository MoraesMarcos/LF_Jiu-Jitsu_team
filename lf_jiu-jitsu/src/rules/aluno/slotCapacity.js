// src/rules/aluno/slotCapacity.js
export function checkSlotCapacity(hasCapacity, classType, date, time) {
  if (!hasCapacity(classType, date, time)) {
    return 'Este horário está lotado. Por favor, selecione outro.'
  }
  return null
}
