// src/store/alunosStore.js
import { reactive } from 'vue'

/**
 * perfisTreino:
 *  - 'adulto'
 *  - 'kids'
 *  - 'feminino'
 *  - 'misto'
 */

const alunosMock = [
  {
    id: 1,
    nome: 'Maria Souza',
    login: 'lf.mariasouza',
    faixa: 'Branca',
    plano: 'Trimestral',
    perfilTreino: 'feminino'
  },
  {
    id: 2,
    nome: 'Pedro Silva',
    login: 'lf.pedrosilva',
    faixa: 'Azul',
    plano: 'Mensal',
    perfilTreino: 'adulto'
  },
  {
    id: 3,
    nome: 'João Kids',
    login: 'lf.joaokids',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'kids'
  },
  {
    id: 4,
    nome: 'Ana Feminina',
    login: 'lf.anafem',
    faixa: 'Azul',
    plano: 'Mensal',
    perfilTreino: 'feminino'
  },
  {
    id: 5,
    nome: 'Carlos Gabriel',
    login: 'lf.carlosgabriel',
    faixa: 'Roxa',
    plano: 'Mensal',
    perfilTreino: 'adulto'
  },
  {
    id: 6,
    nome: 'Cristiane Lima',
    login: 'lf.cristiane',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'feminino'
  },
  {
    id: 7,
    nome: 'Dayse Albuquerque',
    login: 'lf.dayse',
    faixa: 'Azul',
    plano: 'Trimestral',
    perfilTreino: 'feminino'
  },
  {
    id: 8,
    nome: 'Karlinha Magalhães',
    login: 'lf.karlinha',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'feminino'
  },
  {
    id: 9,
    nome: 'Perfil Privado',
    login: 'lf.privado',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'misto'
  }
]

const state = reactive({
  currentUser: null,
  lista: alunosMock
})

function normalizarAluno (a) {
  if (!a) return null
  return {
    ...a,
    // aliases pro front:
    name: a.nome ?? a.name,
    belt: a.faixa ?? a.belt ?? 'Branca',
    plan: a.plano ?? a.plan ?? 'Mensal',
    profile: a.perfilTreino ?? a.profile ?? 'adulto'
  }
}

// começa logado com a Maria, igual antes (pode tirar se quiser sempre começar deslogado)
state.currentUser = normalizarAluno(alunosMock[0])

export const alunosStore = {
  get currentUser () {
    return state.currentUser
  },
  get lista () {
    return state.lista
  },

  login (username, password) {
    // PoC: senha fixa 123
    const aluno = state.lista.find(a => a.login === username)
    if (!aluno) return false
    if (password && password !== '123') return false
    state.currentUser = normalizarAluno(aluno)
    return true
  },

  logout () {
    state.currentUser = null
  }
}

// helper
export function getAlunoById (id) {
  return state.lista.find(a => a.id === id) || null
}
