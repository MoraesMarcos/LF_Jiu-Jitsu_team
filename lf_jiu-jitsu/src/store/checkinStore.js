// src/store/checkinStore.js
import { reactive } from 'vue'
import { alunosStore } from './alunosStore'

// Datas de exemplo (você pode ajustar)
const DATA_BASE = '2025-11-25'

/**
 * turma:
 *  - 'adulto'
 *  - 'kids'
 *  - 'feminino'
 *  - 'misto'
 */

const sessoesMock = [
  // --- Terça, 25/11 ---
  {
    id: '25-11-05h-adulto',
    data: DATA_BASE,
    hora: '05:00',
    titulo: 'Treino Normal Adulto',
    instrutor: 'Mestre Silva',
    turma: 'adulto',
    capacidade: 18,
    presencas: [2, 5] // Pedro Silva, Carlos Gabriel
  },
  {
    id: '25-11-09h-misto',
    data: DATA_BASE,
    hora: '09:00',
    titulo: 'Treino Normal Misto',
    instrutor: 'Professor João',
    turma: 'misto',
    capacidade: 25,
    presencas: [9]
  },
  {
    id: '25-11-11h-especial',
    data: DATA_BASE,
    hora: '11:00',
    titulo: 'Aula Especial Fundamentos',
    instrutor: 'Professor João',
    turma: 'misto',
    capacidade: 25,
    presencas: [2, 5, 9] // já tem 3/25
  },
  {
    id: '25-11-14h-adulto',
    data: DATA_BASE,
    hora: '14:00',
    titulo: 'Treino Normal Adulto',
    instrutor: 'Mestre Silva',
    turma: 'adulto',
    capacidade: 18,
    presencas: [2]
  },
  {
    id: '25-11-16h-feminino',
    data: DATA_BASE,
    hora: '16:00',
    titulo: 'Turma Feminina',
    instrutor: 'Instrutora Ana',
    turma: 'feminino',
    capacidade: 18,
    presencas: [4, 6, 7, 8] // Ana, Cristiane, Dayse, Karlinha -> 4/18
  },
  {
    id: '25-11-17h30-kids',
    data: DATA_BASE,
    hora: '17:30',
    titulo: 'Jiu-Jitsu Kids',
    instrutor: 'Instrutor João',
    turma: 'kids',
    capacidade: 20,
    presencas: [3]
  },
  {
    id: '25-11-19h30-adulto',
    data: DATA_BASE,
    hora: '19:30',
    titulo: 'Jiu-Jitsu Adulto No-Gi',
    instrutor: 'Mestre Silva',
    turma: 'adulto',
    capacidade: 20,
    presencas: [2, 5]
  }
]

export const checkinStore = reactive({
  sessoes: sessoesMock,

  // Sessões filtradas por data e perfil do aluno
  sessoesDoDia (dataIso) {
    const user = alunosStore.currentUser
    if (!user) return []

    return this.sessoes.filter(s => {
      const mesmaData = s.data === dataIso
      const mesmaTurma =
        s.turma === user.perfilTreino ||
        s.turma === 'misto' // mistas aparecem para todo mundo
      return mesmaData && mesmaTurma
    })
  },

  // Contagem de presentes
  presentesNaSessao (idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    return s ? s.presencas.length : 0
  },

  // Se o usuário atual já está presente
  isChecked (idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    if (!s || !alunosStore.currentUser) return false
    return s.presencas.includes(alunosStore.currentUser.id)
  },

  // Alterna check-in do aluno atual
  toggleCheckin (idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    const user = alunosStore.currentUser
    if (!s || !user) return

    const idx = s.presencas.indexOf(user.id)
    if (idx === -1) {
      s.presencas.push(user.id)
    } else {
      s.presencas.splice(idx, 1)
    }
  },

  // Nomes da lista de presença
  listaPresenca (idSessao) {
    const s = this.sessoes.find(s => s.id === idSessao)
    if (!s) return []
    return alunosStore.lista.filter(a => s.presencas.includes(a.id))
  }
})
