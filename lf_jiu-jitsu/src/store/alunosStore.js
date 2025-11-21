import { reactive } from 'vue'

const KEY = 'lf_alunos_v1'
const LOGGED_KEY = 'lf_aluno_logged_data'

// Dados iniciais de exemplo
const defaultAlunos = [
    { id: 1, name: 'Pedro Silva', username: 'lf.pedrosilva', password: '123', plan: 'Mensal', status: 'Ativo' },
    { id: 2, name: 'Maria Souza', username: 'lf.mariasouza', password: '123', plan: 'Trimestral', status: 'Pendente' }
]

const stored = localStorage.getItem(KEY)
const initialList = stored ? JSON.parse(stored) : defaultAlunos

// Tenta recuperar sessão ativa
const storedSession = localStorage.getItem(LOGGED_KEY)
const initialSession = storedSession ? JSON.parse(storedSession) : null

export const alunosStore = reactive({
    list: initialList,
    currentUser: initialSession, // Aluno logado atualmente

    save() {
        localStorage.setItem(KEY, JSON.stringify(this.list))
    },

    // Adiciona aluno e gera o login padrão
    addAluno(data) {
        // Gera username: lf. + nome sem espaços e minúsculo
        // Ex: "João Silva" -> "lf.joaosilva"
        const cleanName = data.name.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        const username = `lf.${cleanName}`

        const newAluno = {
            id: Date.now(),
            ...data,
            username: username,
            password: '123', // Senha padrão inicial
            status: 'Ativo'
        }

        this.list.push(newAluno)
        this.save()
    },

    removeAluno(id) {
        const index = this.list.findIndex(a => a.id === id)
        if (index !== -1) {
            this.list.splice(index, 1)
            this.save()
        }
    },

    // Função de Login do Aluno
    login(username, password) {
        const aluno = this.list.find(a => a.username === username && a.password === password)
        if (aluno) {
            this.currentUser = aluno
            localStorage.setItem(LOGGED_KEY, JSON.stringify(aluno))
            return true
        }
        return false
    },

    logout() {
        this.currentUser = null
        localStorage.removeItem(LOGGED_KEY)
    }
})