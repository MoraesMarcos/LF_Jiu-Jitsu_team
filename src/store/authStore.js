import { reactive } from 'vue'

const KEY = 'lf_admin_logged'

export const authStore = reactive({
  // Começa como falso para obrigar o login ao recarregar a página
  isAdmin: false,

  login(email, password) {
    // Validação mockada
    if (email === 'admin@lf.com' && password === 'admin123') {
      this.isAdmin = true
      // Opcional: Salvar no localStorage se quisesse persistir, 
      // mas deixaremos sem para forçar o teste de login
      return true
    }
    return false
  },

  logout() {
    this.isAdmin = false
    // localStorage.removeItem(KEY) // Se estivesse usando persistência
  }
})