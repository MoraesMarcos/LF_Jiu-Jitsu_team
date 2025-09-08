import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Caminho atualizado

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')