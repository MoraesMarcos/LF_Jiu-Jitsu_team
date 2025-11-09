import { createRouter, createWebHistory } from 'vue-router'

// VIEWS principais
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import HorariosView from '@/views/HorariosView.vue'
import PlanosView from '@/views/PlanosView.vue'
import InstrutoresView from '@/views/InstrutoresView.vue'
import BlogView from '@/views/BlogView.vue'
import ContatosView from '@/views/ContatosView.vue'

// Áreas
import Admin from '@/views/Admin.vue'
import AdminRecuperacao from '@/views/AdminRecuperacao.vue'   // <-- NOVA
import AlunoAreaView from '@/views/AlunoAreaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/sobre', name: 'sobre', component: () => import('../views/AboutView.vue') },

    { path: '/instrutores', name: 'instrutores', component: () => import('../views/InstrutoresView.vue') },
    
    { 
      path: '/instrutores/:slug',
      name: 'instrutor-detalhe', 
      component: () => import('../views/InstrutorDetailView.vue') 
    },

    { path: '/planos', name: 'planos', component: () => import('../views/PlanosView.vue') },
    { path: '/contato', name: 'contato', component: () => import('../views/ContatosView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue') },
    { path: '/horarios', name: 'horarios', component: () => import('../views/HorariosView.vue') },
    { path: '/area-do-aluno', name: 'area-aluno', component: () => import('../views/AlunoAreaView.vue') },
    { path: '/aluno', redirect: { name: 'area-aluno' } },
    { path: '/admin/recuperar', name: 'admin-rec',   component: AdminRecuperacao },
    { path: '/admin', name: 'admin', component: () => import('@/views/Admin.vue')},
    {path: '/recuperar-senha', name: 'recuperar-senha', component: () => import('@/views/RecuperarSenhaView.vue')}
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router