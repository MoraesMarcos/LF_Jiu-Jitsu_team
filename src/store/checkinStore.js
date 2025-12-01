import { reactive } from 'vue'
import { alunosStore } from './alunosStore'

const QUI = '2025-11-27'
const SEX = '2025-11-28'
const SAB = '2025-11-29'
const DOM = '2025-11-30'
const SEG = '2025-12-01'
const TER = '2025-12-02'
const QUA = '2025-12-03'

const sessoesMock = [

  { id: '27-11-06h-adulto', date: QUI, time: '06:00', titulo: 'Jiu-Jitsu Despertar', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [2] },
  { id: '27-11-09h-misto', date: QUI, time: '09:00', titulo: 'Treino Técnico', instrutor: 'Professor João', turma: 'misto', capacity: 25, attendees: [] },
  { id: '27-11-16h-kids', date: QUI, time: '16:00', titulo: 'Kids Avançado', instrutor: 'Instrutor João', turma: 'kids', capacity: 15, attendees: [3] },
  { id: '27-11-18h-feminino', date: QUI, time: '18:00', titulo: 'Defesa Pessoal Feminina', instrutor: 'Instrutora Ana', turma: 'feminino', capacity: 20, attendees: [4, 6] },
  { id: '27-11-19h30-adulto', date: QUI, time: '19:30', titulo: 'Treino Adulto Competição', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 25, attendees: [5] },

  { id: '28-11-07h-misto', date: SEX, time: '07:00', titulo: 'Drills & Posições', instrutor: 'Professor João', turma: 'misto', capacity: 20, attendees: [] },
  { id: '28-11-10h-feminino', date: SEX, time: '10:00', titulo: 'Treino Feminino Manhã', instrutor: 'Instrutora Ana', turma: 'feminino', capacity: 15, attendees: [] },
  { id: '28-11-15h-adulto', date: SEX, time: '15:00', titulo: 'Treino Livre', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [] },
  { id: '28-11-17h-kids', date: SEX, time: '17:00', titulo: 'Kids Recreação', instrutor: 'Instrutor João', turma: 'kids', capacity: 20, attendees: [] },
  { id: '28-11-19h-misto', date: SEX, time: '19:00', titulo: 'Aulão No-Gi (Sem Kimono)', instrutor: 'Mestre Silva', turma: 'misto', capacity: 30, attendees: [2, 5, 9] },

  { id: '29-11-09h-kids', date: SAB, time: '09:00', titulo: 'Aulão Kids', instrutor: 'Tia Ana & Tio João', turma: 'kids', capacity: 30, attendees: [3] },
  { id: '29-11-10h30-misto', date: SAB, time: '10:30', titulo: 'Open Mat (Rola Solto)', instrutor: 'Todos', turma: 'misto', capacity: 40, attendees: [2, 4, 5, 6, 9] },

  { id: '30-11-10h-misto', date: DOM, time: '10:00', titulo: 'Seminário Especial', instrutor: 'Convidado', turma: 'misto', capacity: 50, attendees: [] },

  { id: '01-12-06h-adulto', date: SEG, time: '06:00', titulo: 'Treino Adulto', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [] },
  { id: '01-12-09h-feminino', date: SEG, time: '09:00', titulo: 'Treino Feminino', instrutor: 'Instrutora Ana', turma: 'feminino', capacity: 15, attendees: [] },
  { id: '01-12-16h-kids', date: SEG, time: '16:00', titulo: 'Jiu-Jitsu Kids I', instrutor: 'Instrutor João', turma: 'kids', capacity: 15, attendees: [] },
  { id: '01-12-18h-misto', date: SEG, time: '18:00', titulo: 'Fundamentos Básicos', instrutor: 'Professor João', turma: 'misto', capacity: 25, attendees: [] },
  { id: '01-12-20h-adulto', date: SEG, time: '20:00', titulo: 'Treino Adulto Intensivo', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [] },

  { id: '02-12-07h-misto', date: TER, time: '07:00', titulo: 'Treino Misto', instrutor: 'Mestre Silva', turma: 'misto', capacity: 20, attendees: [] },
  { id: '02-12-10h-kids', date: TER, time: '10:00', titulo: 'Kids Matutino', instrutor: 'Instrutor João', turma: 'kids', capacity: 15, attendees: [] },
  { id: '02-12-15h-feminino', date: TER, time: '15:00', titulo: 'Feminino Técnica', instrutor: 'Instrutora Ana', turma: 'feminino', capacity: 15, attendees: [] },
  { id: '02-12-19h-adulto', date: TER, time: '19:00', titulo: 'Adulto Noite', instrutor: 'Professor João', turma: 'adulto', capacity: 25, attendees: [] },

  { id: '03-12-06h-adulto', date: QUA, time: '06:00', titulo: 'Treino Adulto', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [] },
  { id: '03-12-14h-feminino', date: QUA, time: '14:00', titulo: 'Treino Feminino', instrutor: 'Instrutora Ana', turma: 'feminino', capacity: 20, attendees: [] },
  { id: '03-12-16h-kids', date: QUA, time: '16:00', titulo: 'Treino Kids', instrutor: 'Instrutor João', turma: 'kids', capacity: 15, attendees: [] },
  { id: '03-12-18h-misto', date: QUA, time: '18:00', titulo: 'Treino Misto', instrutor: 'Professor João', turma: 'misto', capacity: 25, attendees: [] },
  { id: '03-12-20h-adulto', date: QUA, time: '20:00', titulo: 'Treino Adulto', instrutor: 'Mestre Silva', turma: 'adulto', capacity: 20, attendees: [] }
]

export const checkinStore = reactive({
  sessoes: sessoesMock,

  sessoesDoDia(dataIso) {
    const user = alunosStore.currentUser
    if (!user) return []

    const filtradas = this.sessoes.filter(s => {
      const mesmaData = s.date === dataIso
      let acessoPermitido = false

      if (user.profile === 'kids') {
        acessoPermitido = (s.turma === 'kids')
      } else if (user.profile === 'feminino') {
        acessoPermitido = (s.turma === 'feminino' || s.turma === 'misto')
      } else {
        acessoPermitido = (s.turma === 'adulto' || s.turma === 'misto')
      }
      return mesmaData && acessoPermitido
    })

    return filtradas.sort((a, b) => a.time.localeCompare(b.time))
  },

  presentesNaSessao(idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    return s ? s.attendees.length : 0
  },

  isChecked(idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    if (!s || !alunosStore.currentUser) return false
    return s.attendees.includes(alunosStore.currentUser.id)
  },

  toggleCheckin(idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    const user = alunosStore.currentUser
    if (!s || !user) return

    const idx = s.attendees.indexOf(user.id)
    if (idx === -1) {
      s.attendees.push(user.id)
    } else {
      s.attendees.splice(idx, 1)
    }
  },

  listaPresenca(idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    if (!s) return []
    return alunosStore.lista.filter(a => s.attendees.includes(a.id))
  }
})