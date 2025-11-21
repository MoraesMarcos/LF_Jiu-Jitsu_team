export function validateProfile(data) {
  const errors = { nome: null, email: null, telefone: null }
  if (!data.nome || data.nome.trim().length < 3) errors.nome = 'Informe um nome válido.'
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'E-mail inválido.'
  if (data.telefone && data.telefone.replace(/\D/g, '').length < 10) errors.telefone = 'Telefone incompleto.'
  return { ok: !errors.nome && !errors.email && !errors.telefone, errors }
}
