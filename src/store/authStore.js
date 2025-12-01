import { reactive } from 'vue'

const KEY = 'lf_admin_logged'

export const authStore = reactive({

  isAdmin: false,

  login(email, password) {
    // Validação mockada
    if (email === 'admin@lf.com' && password === 'admin123') {
      this.isAdmin = true
      return true
    }
    return false
  },

  logout() {
    this.isAdmin = false
  }
})