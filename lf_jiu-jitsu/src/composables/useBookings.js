import { ref, computed } from 'vue'

// chave base no localStorage
const LS_SCHEDULE = 'lf_schedule_v1'

function buildMockWeek() {
  // constrói a semana a partir de hoje (seg → dom)
  const now = new Date()
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysAhead = [0, 1, 2, 3, 4, 5, 6] // 7 dias

  let id = 1000
  const sessions = []

  const templates = [
    { hour: '07:00', name: 'Jiu-Jitsu (Adulto) — Gi', coach: 'Sensei Lucas', capacity: 20, durationMin: 60 },
    { hour: '18:00', name: 'Jiu-Jitsu — No-Gi',       coach: 'Sensei João',  capacity: 25, durationMin: 60 },
    { hour: '19:30', name: 'Fundamentos',             coach: 'Sensei Ana',   capacity: 16, durationMin: 60 },
  ]

  for (const d of daysAhead) {
    const day = new Date(base)
    day.setDate(base.getDate() + d)

    for (const t of templates) {
      const [h, m] = t.hour.split(':').map(Number)
      const start = new Date(day)
      start.setHours(h, m, 0, 0)
      const end = new Date(start)
      end.setMinutes(end.getMinutes() + t.durationMin)

      sessions.push({
        id: String(id++),
        date: day.toISOString().slice(0, 10), // YYYY-MM-DD
        start: start.toISOString(),
        end: end.toISOString(),
        name: t.name,
        coach: t.coach,
        capacity: t.capacity,
        attendees: [], // alunos confirmados (IDs)
      })
    }
  }
  return sessions
}

function loadSchedule() {
  const raw = localStorage.getItem(LS_SCHEDULE)
  if (raw) {
    try { return JSON.parse(raw) } catch { /* noop */ }
  }
  const mock = buildMockWeek()
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(mock))
  return mock
}

function saveSchedule(sessions) {
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(sessions))
}

export function useBookings(userId = 'aluno_demo') {
  const sessions = ref(loadSchedule())
  const todayISO = new Date().toISOString().slice(0, 10)
  const selectedDate = ref(todayISO)

  const days = computed(() => {
    // retorna a lista de datas presentes na agenda (ordenadas)
    const set = Array.from(new Set(sessions.value.map(s => s.date))).sort()
    return set
  })

  const listByDate = computed(() =>
    sessions.value
      .filter(s => s.date === selectedDate.value)
      .sort((a, b) => a.start.localeCompare(b.start))
  )

  const getById = (id) => sessions.value.find(s => s.id === String(id))

  const persist = () => saveSchedule(sessions.value)

  const isBooked = (id) => {
    const s = getById(id)
    return !!s && (s.attendees || []).includes(userId)
  }

  const attendeesCount = (id) => {
    const s = getById(id)
    return s ? (s.attendees?.length || 0) : 0
  }

  const addBooking = (id) => {
    const s = getById(id)
    if (!s) return
    s.attendees = [...(s.attendees || []), userId]
    persist()
  }

  const removeBooking = (id) => {
    const s = getById(id)
    if (!s) return
    s.attendees = (s.attendees || []).filter(x => x !== userId)
    persist()
  }

  const replaceSession = (updated) => {
    const idx = sessions.value.findIndex(s => s.id === updated.id)
    if (idx >= 0) {
      sessions.value[idx] = { ...updated }
      persist()
    }
  }

  return {
    sessions, days, selectedDate, listByDate,
    getById, isBooked, attendeesCount,
    addBooking, removeBooking, replaceSession
  }
}
