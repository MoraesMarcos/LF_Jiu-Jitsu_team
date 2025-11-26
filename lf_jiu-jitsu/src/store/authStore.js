import { reactive } from 'vue'

const KEY = 'lf_admin_logged'

export const authStore = reactive({
  isAdmin: localStorage.getItem(KEY) === 'true',

  login (email, password) {
    // mock de admin
    if (email === 'admin@lf.com' && password === 'admin123') {
      this.isAdmin = true
      localStorage.setItem(KEY, 'true')
      return true
    }
    return false
  },

  logout () {
    this.isAdmin = false
    localStorage.removeItem(KEY)
  }
})
