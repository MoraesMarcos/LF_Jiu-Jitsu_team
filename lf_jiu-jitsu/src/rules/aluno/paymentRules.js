export function nextPendingPayment(pagamentos, alvoMes = null) {
  const list = Array.isArray(pagamentos) ? pagamentos : []
  const pendentes = list.filter(p => p.status === 'Pendente')
  if (alvoMes) {
    return pendentes.find(p => p.mes === alvoMes) || null
  }

  return pendentes[0] || null
}

export function canGenerateInvoice(pagamentos, alvoMes = null) {
  const pend = nextPendingPayment(pagamentos, alvoMes)
  if (!pend) {
    return { ok: false, message: 'Não há pagamento pendente para gerar boleto/PIX.' }
  }
  return { ok: true, pendente: pend }
}