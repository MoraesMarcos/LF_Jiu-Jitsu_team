export function validateLogin ({ email, senha }) {
  if (!email) return 'Informe um e-mail.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'Informe um e-mail válido.'
  }
  if (!senha || String(senha).length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.'
  }
  return ''
}
