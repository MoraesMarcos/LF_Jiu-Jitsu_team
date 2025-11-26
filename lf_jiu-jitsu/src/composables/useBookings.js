import { ref, computed } from 'vue'
import { checkinStore } from '@/store/checkinStore'

export function useBookings(userId, userProfile) {
  // Gera os próximos dias (hoje + 6)
  const days = computed(() => {
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const iso = d.toISOString().split('T')[0]
      arr.push(iso)
    }
    return arr
  })

  // Data selecionada (padrão: hoje)
  const selectedDate = ref(new Date().toISOString().split('T')[0])

  // Lista filtrada pela Store (que já aplica a regra de Kids/Feminino/Misto)
  const listByDate = computed(() => {
    return checkinStore.sessoesDoDia(selectedDate.value)
  })

  // Helpers visuais
  function attendeesCount(sessionId) {
    return checkinStore.presentesNaSessao(sessionId)
  }

  function isBooked(sessionId) {
    return checkinStore.isChecked(sessionId)
  }

  // Atualiza a lista localmente (embora a store seja reativa, isso ajuda na transição imediata)
  function replaceSession(updatedSession) {
    // Como estamos usando a Store reativa diretamente no computed 'listByDate',
    // muitas vezes não é necessário substituir manualmente, 
    // mas mantemos para compatibilidade com códigos antigos.
    const idx = checkinStore.sessoes.findIndex(s => s.id === updatedSession.id)
    if (idx !== -1) {
      checkinStore.sessoes[idx] = updatedSession
    }
  }

  return {
    days,
    selectedDate,
    listByDate,
    attendeesCount,
    isBooked,
    replaceSession
  }
}