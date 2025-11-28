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
  // ... outros alunos (pode manter os mesmos de antes)
  {
    id: 3,
    nome: 'João Kids',
    login: 'lf.joaokids',
    faixa: 'Branca',
    plano: 'Mensal',
    perfilTreino: 'kids',
    telefone: '(81) 97777-0000',
    objetivo: 'Disciplina'
  }
]

const state = reactive({
  currentUser: null,
  lista: alunosMock
})

// Normaliza os dados (converte português do banco para inglês do front)
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

// Inicializa logado com a Maria
state.currentUser = normalizarAluno(alunosMock[0])

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
    if (password && password !== '123') return false
    state.currentUser = normalizarAluno(aluno)
    return true
  },

  logout() {
    state.currentUser = null
  },

  // --- NOVA FUNÇÃO: ATUALIZAR DADOS ---
  updateProfile(novosDados) {
    if (!state.currentUser) return

    // 1. Atualiza o currentUser (Visual imediato)
    state.currentUser.phone = novosDados.phone
    state.currentUser.goal = novosDados.goal

    // 2. Atualiza a lista original (Persistência em memória)
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