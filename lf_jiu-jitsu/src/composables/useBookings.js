import { ref, computed } from 'vue'
import { checkinStore } from '@/store/checkinStore'

export function useBookings(userId, userProfile) {
  // Gera os próximos 7 dias
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

  // Lista filtrada e ordenada pela Store
  const listByDate = computed(() => {
    return checkinStore.sessoesDoDia(selectedDate.value)
  })

  // Helpers
  function attendeesCount(sessionId) {
    return checkinStore.presentesNaSessao(sessionId)
  }

  function isBooked(sessionId) {
    return checkinStore.isChecked(sessionId)
  }

  function replaceSession(updatedSession) {
    // Não é estritamente necessário com a store reativa, mas mantemos para segurança
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