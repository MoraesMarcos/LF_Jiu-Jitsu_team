import { reactive } from 'vue'

const alunosMock = [
  {
    id: 1,
    nome: 'Maria Souza',
    login: 'lf.mariasouza',
    faixa: 'Branca',
    plano: 'Trimestral',
    perfilTreino: 'feminino',
    telefone: '(81) 99876-5432',
    objetivo: 'Defesa Pessoal e Saúde'
  },
  {
    id: 2,
    nome: 'Pedro Silva',
    login: 'lf.pedrosilva',
    faixa: 'Azul',
    plano: 'Mensal',
    perfilTreino: 'adulto',
    telefone: '(81) 98888-1234',
    objetivo: 'Competição'
  },
  {
    id: 3,
    nome: 'João Kids',
    login: 'lf.joaokids',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'kids',
    telefone: '(81) 97777-0000',
    objetivo: 'Disciplina'
  },
  {
    id: 4,
    nome: 'Ana Feminina',
    login: 'lf.anafem',
    faixa: 'Azul',
    plano: 'Mensal',
    perfilTreino: 'feminino',
    telefone: '(81) 91234-5678',
    objetivo: 'Condicionamento Físico'
  },
  {
    id: 5,
    nome: 'Carlos Gabriel',
    login: 'lf.carlosgabriel',
    faixa: 'Roxa',
    plano: 'Mensal',
    perfilTreino: 'adulto',
    telefone: '(81) 92345-6789',
    objetivo: 'Estilo de Vida'
  },
  {
    id: 6,
    nome: 'Cristiane Lima',
    login: 'lf.cristiane',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'feminino',
    telefone: '(81) 93456-7890',
    objetivo: 'Defesa Pessoal'
  },
  {
    id: 7,
    nome: 'Dayse Albuquerque',
    login: 'lf.dayse',
    faixa: 'Azul',
    plano: 'Trimestral',
    perfilTreino: 'feminino',
    telefone: '(81) 94567-8901',
    objetivo: 'Saúde'
  },
  {
    id: 8,
    nome: 'Karlinha Magalhães',
    login: 'lf.karlinha',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'feminino',
    telefone: '(81) 95678-9012',
    objetivo: 'Competição'
  },
  {
    id: 9,
    nome: 'Perfil Privado',
    login: 'lf.privado',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'misto',
    telefone: '(81) 90000-0000',
    objetivo: 'Não informado'
  }
]

const state = reactive({
  currentUser: null,
  lista: alunosMock
})

function normalizarAluno(a) {
  if (!a) return null
  return {
    ...a,
    name: a.nome ?? a.name,
    belt: a.faixa ?? a.belt ?? 'Branca',
    plan: a.plano ?? a.plan ?? 'Mensal',
    profile: a.perfilTreino ?? a.profile ?? 'adulto',
    phone: a.telefone ?? '(81) 99999-0000',
    goal: a.objetivo ?? 'Saúde e Bem-estar'
  }
}

state.currentUser = null

export const alunosStore = {
  get currentUser() {
    return state.currentUser
  },
  get lista() {
    return state.lista
  },

  login(username, password) {
    const aluno = state.lista.find(a => a.login === username)

    if (!aluno) return false

    if (String(password) !== '123') return false

    state.currentUser = normalizarAluno(aluno)
    return true
  },

  logout() {
    state.currentUser = null
  },

  updateProfile(novosDados) {
    if (!state.currentUser) return
    state.currentUser.phone = novosDados.phone
    state.currentUser.goal = novosDados.goal

    const index = state.lista.findIndex(a => a.id === state.currentUser.id)
    if (index !== -1) {
      state.lista[index].telefone = novosDados.phone
      state.lista[index].objetivo = novosDados.goal
    }
  },

  hasCheckin(dateKey, classId) { return false },
  toggleCheckin(dateKey, classId) { },
  getPresencas(dateKey, classId) { return [] },
  recoverPassword(username) {
    return { ok: true, tempPass: '123' }
  }
}

export function getAlunoById(id) {
  return state.lista.find(a => a.id === id) || null
}