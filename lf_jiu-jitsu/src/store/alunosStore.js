import { reactive } from 'vue'

const KEY = 'lf_alunos_v1'
const LOGGED_KEY = 'lf_aluno_logged_data'

const defaultAlunos = [
    { id: 1, name: 'Pedro Silva', username: 'lf.pedrosilva', password: '123', plan: 'Mensal', status: 'Ativo' },
    { id: 2, name: 'Maria Souza', username: 'lf.mariasouza', password: '123', plan: 'Trimestral', status: 'Pendente' }
]

const stored = localStorage.getItem(KEY)
const initialList = stored ? JSON.parse(stored) : defaultAlunos

const storedSession = localStorage.getItem(LOGGED_KEY)
const initialSession = storedSession ? JSON.parse(storedSession) : null

export const alunosStore = reactive({
    list: initialList,
    currentUser: initialSession,

    save() {
        localStorage.setItem(KEY, JSON.stringify(this.list))
    },

    addAluno(data) {
        const cleanName = data.name.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        const username = `lf.${cleanName}`

        const newAluno = {
            id: Date.now(),
            ...data,
            username: username,
            password: '123',
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
    },

    // Nova função para resetar senha
    recoverPassword(username) {
        const index = this.list.findIndex(a => a.username === username)

        if (index !== -1) {
            // Define uma senha temporária fixa para teste
            const tempPass = 'mudar123'
            this.list[index].password = tempPass
            this.save()
            return { ok: true, tempPass }
        }

        return { ok: false }
    }
})