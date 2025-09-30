import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/sobre', name: 'sobre', component: () => import('../views/AboutView.vue') },
    { path: '/planos', name: 'planos', component: () => import('../views/PlanosView.vue') },
    { path: '/contato', name: 'contato', component: () => import('../views/ContatosView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue') },
    { path: '/area-do-aluno', name: 'area-aluno', component: () => import('../views/AlunoAreaView.vue') },
    { path: '/aluno', redirect: { name: 'area-aluno' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
