// src/composables/useBookings.js
import { ref, computed, onMounted } from 'vue'
import { alunosStore } from '@/store/alunosStore'

const classes = ref([])
const selectedDate = ref(new Date().toISOString().split('T')[0])

function getNextSevenDays () {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function generateMockClasses () {
  const days = getNextSevenDays()
  const mocks = []

  days.forEach(day => {
    // MISTO (vale pra todos que podem treinar em turma mista)
    mocks.push({
      id: `misto-${day}-0900`,
      name: 'Treino Normal Misto',
      coach: 'Professor João',
      date: day,
      time: '09:00',
      start: `${day}T09:00:00`,
      end: `${day}T10:30:00`,
      capacity: 25,
      attendees: [],
      classType: 'misto'
    })

    // FEMININO
    mocks.push({
      id: `fem-${day}-1600`,
      name: 'Turma Feminina',
      coach: 'Instrutora Ana',
      date: day,
      time: '16:00',
      start: `${day}T16:00:00`,
      end: `${day}T17:15:00`,
      capacity: 18,
      attendees: [],
      classType: 'feminino'
    })

    // KIDS
    mocks.push({
      id: `kids-${day}-1730`,
      name: 'Jiu-Jitsu Kids',
      coach: 'Instrutor João',
      date: day,
      time: '17:30',
      start: `${day}T17:30:00`,
      end: `${day}T18:30:00`,
      capacity: 15,
      attendees: [],
      classType: 'kids'
    })

    // ADULTO NOITE
    mocks.push({
      id: `adulto-${day}-1930`,
      name: 'Jiu-Jitsu Adulto – Noite',
      coach: 'Mestre Silva',
      date: day,
      time: '19:30',
      start: `${day}T19:30:00`,
      end: `${day}T21:00:00`,
      capacity: 20,
      attendees: [],
      classType: 'adulto'
    })
  })

  classes.value = mocks
}

export function useBookings (currentUserId, userProfile = 'adulto') {
  onMounted(() => {
    if (classes.value.length === 0) generateMockClasses()
  })

  const days = computed(() => getNextSevenDays())

  const normalizeProfile = () => String(userProfile || '').toLowerCase()

  function allowedForProfile (session) {
    const tipo = String(session.classType || '').toLowerCase()
    const perfil = normalizeProfile()

    if (perfil === 'kids') return tipo === 'kids'
    if (perfil === 'feminino') return tipo === 'feminino' || tipo === 'misto'
    if (perfil === 'misto') return tipo === 'misto'
    // adulto (ou qualquer outro) vê adulto + misto
    return tipo === 'adulto' || tipo === 'misto'
  }

  const listByDate = computed(() => {
    return classes.value
      .filter(c => c.date === selectedDate.value && allowedForProfile(c))
      .sort((a, b) => a.time.localeCompare(b.time))
  })

  const getById = id => classes.value.find(c => c.id === id)

  const attendeesCount = id => getById(id)?.attendees?.length || 0

  const isBooked = id => {
    const s = getById(id)
    if (!s) return false
    return (s.attendees || []).includes(currentUserId)
  }

  const hasActiveBooking = userId =>
    classes.value.some(c => (c.attendees || []).includes(userId))

  const hasCapacity = (classType, date, time) => {
    const session = classes.value.find(
      c => c.classType === classType && c.date === date && c.time === time
    )
    if (!session) return true
    return session.attendees.length < (session.capacity || 20)
  }

  const getPreviousBookings = async () => []

  const replaceSession = async (session) => {
    const index = classes.value.findIndex(c => c.id === session.id)
    if (index !== -1) {
      classes.value[index] = {
        ...classes.value[index],
        ...session,
        attendees: [...(session.attendees || [])]
      }
    }
    return { ok: true }
  }

  // nomes para a lista de presença
  const getAttendeeNames = (id) => {
    const s = getById(id)
    if (!s || !Array.isArray(s.attendees)) return []
    return s.attendees.map(uid => {
      const aluno = alunosStore.lista.find(a => String(a.id) === String(uid))
      return {
        id: uid,
        nome: aluno?.nome || aluno?.name || `Aluno #${uid}`
      }
    })
  }

  return {
    days,
    selectedDate,
    listByDate,
    attendeesCount,
    isBooked,
    getById,
    replaceSession,
    hasActiveBooking,
    hasCapacity,
    getPreviousBookings,
    getAttendeeNames
  }
}

export { selectedDate } // se você já usava em outro lugar
