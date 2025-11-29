export function canGenerateInvoice (pagamentos) {
  const pendente = pagamentos.find(p => p.status === 'Pendente')
  if (!pendente) {
    return { ok: false, message: 'Nenhuma mensalidade pendente.' }
  }
  return { ok: true, pendente }
}
