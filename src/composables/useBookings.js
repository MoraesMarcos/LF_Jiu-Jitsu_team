import { ref, computed } from 'vue'
import { checkinStore } from '@/store/checkinStore'

export function useBookings(userId, userProfile) {

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

  const selectedDate = ref(new Date().toISOString().split('T')[0])

  const listByDate = computed(() => {
    return checkinStore.sessoesDoDia(selectedDate.value)
  })

  function attendeesCount(sessionId) {
    return checkinStore.presentesNaSessao(sessionId)
  }

  function isBooked(sessionId) {
    return checkinStore.isChecked(sessionId)
  }

  function replaceSession(updatedSession) {

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