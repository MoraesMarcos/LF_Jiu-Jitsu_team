import { reactive, watch } from 'vue'

// Chave para salvar no navegador
const KEY = 'lf_events_v1'

// Dados iniciais (caso não tenha nada salvo)
const defaultEvents = [
    { id: 1, day: '15', month: 'DEZ', title: 'Seminário de Defesa', info: 'Sábado às 09:00h.' },
    { id: 2, day: '20', month: 'DEZ', title: 'Graduação Final', info: 'Sexta às 19:00h.' },
    { id: 3, day: '12', month: 'JAN', title: 'Treino Verão', info: 'Domingo às 10:00h.' },
    { id: 4, day: '05', month: 'FEV', title: 'Turma Competição', info: 'Início da temporada.' }
]

// Carrega do localStorage ou usa o padrão
const stored = localStorage.getItem(KEY)
const initialData = stored ? JSON.parse(stored) : defaultEvents

export const eventStore = reactive({
    events: initialData,

    // Salva automaticamente sempre que mudar
    save() {
        localStorage.setItem(KEY, JSON.stringify(this.events))
    },

    addEvent(eventData) {
        // Cria um ID único baseado no tempo
        const newEvent = { ...eventData, id: Date.now() }

        // Adiciona no começo
        this.events.unshift(newEvent)

        // Regra de negócio: Manter apenas 4 (rotativo)
        if (this.events.length > 4) {
            this.events.pop()
        }
        this.save()
    },

    removeEvent(id) {
        const index = this.events.findIndex(e => e.id === id)
        if (index !== -1) {
            this.events.splice(index, 1)
            this.save()
        }
    },

    updateEvent(updatedEvent) {
        const index = this.events.findIndex(e => e.id === updatedEvent.id)
        if (index !== -1) {
            this.events[index] = updatedEvent
            this.save()
        }
    }
})