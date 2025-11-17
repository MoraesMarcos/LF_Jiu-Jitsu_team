export const isRequired = (v) =>
  !!(v && String(v).trim().length) || 'Campo obrigatório.'

export const minChars = (n) => (v) =>
  (String(v || '').trim().length >= n) || `Mínimo de ${n} caracteres.`

export const onlyLettersSpaces = (v) =>
  (/^[A-Za-zÀ-ÖØ-öø-ÿ'´`^~çÇ ]+$/).test(String(v || '').trim()) || 'Use apenas letras e espaços.'

export const isBRPhone = (v) =>
  (/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/).test(String(v || '').trim()) || 'Telefone inválido. Ex.: (81) 99999-0000'

export const normalizePhone = (v) => String(v || '').replace(/\D/g, '')

export const isPast = (isoDate) => {

  const today = new Date(new Date().toDateString())
  const d = new Date(isoDate + 'T00:00:00')
  return d < today
}

export const withinDays = (iso, days) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / (1000 * 60 * 60 * 24)
  return diff <= days
}

export const toISODateTime = (dateStr, timeStr) => `${dateStr}T${timeStr}:00`

export const diffInMinutes = (aISO, bDateObj = new Date()) =>
  (new Date(aISO) - bDateObj) / 60000
