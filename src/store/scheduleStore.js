import { reactive } from 'vue'

const KEY = 'lf_schedule_v1'

const defaultSchedule = [
  { id: 1, day: 'Segunda-feira', time: '19:30', modality: 'Adulto' },
  { id: 2, day: 'Segunda-feira', time: '17:00', modality: 'Kids' },
  { id: 3, day: 'Terça-feira', time: '07:00', modality: 'Adulto' },
  { id: 4, day: 'Quarta-feira', time: '19:30', modality: 'Adulto' },
  { id: 5, day: 'Sexta-feira', time: '18:00', modality: 'Feminino' }
]

let initialData = defaultSchedule
try {
  const stored = localStorage.getItem(KEY)
  if (stored) {
    initialData = JSON.parse(stored)
  }
} catch (e) {
  console.error('Erro ao ler dados do localStorage, usando padrão.', e)
}


export const scheduleStore = reactive({
  classes: initialData,

  save() {
    localStorage.setItem(KEY, JSON.stringify(this.classes))
  },

  addClass(newClass) {
    this.classes.push({ ...newClass, id: Date.now() })
    this.save()
  },

  removeClass(id) {
    const index = this.classes.findIndex(c => c.id === id)
    if (index !== -1) {
      this.classes.splice(index, 1)
      this.save()
    }
  },

  updateClass(updatedClass) {
    const index = this.classes.findIndex(c => c.id === updatedClass.id)
    if (index !== -1) {
      this.classes[index] = updatedClass
      this.save()
    }
  },

  get sortedClasses() {
    const daysOrder = {
      'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3,
      'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6, 'Domingo': 7
    }

    return [...this.classes].sort((a, b) => {
      if (daysOrder[a.day] !== daysOrder[b.day]) {
        return daysOrder[a.day] - daysOrder[b.day]
      }
      return a.time.localeCompare(b.time)
    })
  }
})