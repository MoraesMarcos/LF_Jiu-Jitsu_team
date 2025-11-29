import { reactive } from 'vue'

const KEY = 'lf_events_v1'

const defaultEvents = [
  { id: 1, day: '15', month: 'DEZ', title: 'Seminário de Defesa', info: 'Sábado às 09:00h.' },
  { id: 2, day: '20', month: 'DEZ', title: 'Graduação Final', info: 'Sexta às 19:00h.' },
  { id: 3, day: '12', month: 'JAN', title: 'Treino Verão', info: 'Domingo às 10:00h.' },
  { id: 4, day: '05', month: 'FEV', title: 'Turma Competição', info: 'Início da temporada.' }
]

const stored = localStorage.getItem(KEY)
const initialData = stored ? JSON.parse(stored) : defaultEvents

export const eventStore = reactive({
  events: initialData,

  save () {
    localStorage.setItem(KEY, JSON.stringify(this.events))
  },

  addEvent (eventData) {
    const newEvent = { ...eventData, id: Date.now() }
    this.events.unshift(newEvent)

    if (this.events.length > 4) {
      this.events.pop()
    }
    this.save()
  },

  removeEvent (id) {
    const index = this.events.findIndex(e => e.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
      this.save()
    }
  },

  updateEvent (updatedEvent) {
    const index = this.events.findIndex(e => e.id === updatedEvent.id)
    if (index !== -1) {
      this.events[index] = updatedEvent
      this.save()
    }
  }
})
