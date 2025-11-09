export function validateLogin({ email, senha }) {
  if (!email || !email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
    return 'Informe um e-mail válido.'
  }
  if (!senha || String(senha).length < 4) {
    return 'A senha deve ter pelo menos 4 caracteres.'
  }
  return null
}