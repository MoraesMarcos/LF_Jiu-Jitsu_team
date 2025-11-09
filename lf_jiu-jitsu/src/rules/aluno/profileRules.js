export function validateProfile(form) {
  const errors = { nome: null, email: null, telefone: null }

  if (!form.nome || String(form.nome).trim().length < 3) {
    errors.nome = 'Informe seu nome (mínimo 3 caracteres).'
  }

  if (!form.email || !form.email.includes('@')) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (form.telefone && !/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(String(form.telefone))) {
    errors.telefone = 'Telefone inválido. Ex.: (81) 99999-0000'
  }

  const ok = !errors.nome && !errors.email && !errors.telefone
  return { ok, errors }
}