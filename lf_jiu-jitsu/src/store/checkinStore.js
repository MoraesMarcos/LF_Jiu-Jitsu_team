// src/store/checkinStore.js
import { reactive } from 'vue'

const STORAGE_KEY = 'lf_checkin_classes_v1'

// dados mock: gere IDs legíveis (ex.: 2025-11-20-0530)
function mkId(date, time) {
  return `${date}-${time.replace(':', '')}`
}

// data de hoje (YYYY-MM-DD)
function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// carrega/salva
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}
function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.classes))
}

// cria estado inicial (se não houver no localStorage)
const defaultDate = todayISO()
const initial = load() ?? [
  { id: mkId(defaultDate, '05:30'), date: defaultDate, time: '05:30', coach: 'Thiago Victor', capacity: 20, attendees: [] },
  { id: mkId(defaultDate, '06:30'), date: defaultDate, time: '06:30', coach: 'Thiago Victor', capacity: 25, attendees: [] },
  { id: mkId(defaultDate, '07:30'), date: defaultDate, time: '07:30', coach: 'Thiago Victor', capacity: 25, attendees: [] },
  { id: mkId(defaultDate, '12:30'), date: defaultDate, time: '12:30', coach: 'Carlos Henrique', capacity: 24, attendees: [] },
  { id: mkId(defaultDate, '16:00'), date: defaultDate, time: '16:00', coach: 'Ronaldo Valença', capacity: 25, attendees: [] },
  { id: mkId(defaultDate, '17:00'), date: defaultDate, time: '17:00', coach: 'Ronaldo Valença', capacity: 25, attendees: [] },
]

const state = reactive({
  classes: initial,
})

export const checkinStore = {
  state,

  listByDate(dateISO) {
    return state.classes.filter(c => c.date === dateISO)
      .sort((a, b) => a.time.localeCompare(b.time))
  },

  getById(id) {
    return state.classes.find(c => c.id === id)
  },

  checkIn(classId, student) {
    const c = this.getById(classId)
    if (!c) return { ok: false, message: 'Aula não encontrada.' }

    if (c.attendees.some(a => a.id === student.id)) {
      return { ok: false, message: 'Você já está confirmado.' }
    }
    if (c.attendees.length >= c.capacity) {
      return { ok: false, message: 'A turma já atingiu a capacidade.' }
    }
    c.attendees.push(student)
    save(state)
    return { ok: true }
  },

  remove(classId, studentId) {
    const c = this.getById(classId)
    if (!c) return
    const idx = c.attendees.findIndex(a => a.id === studentId)
    if (idx >= 0) {
      c.attendees.splice(idx, 1)
      save(state)
    }
  }
}
