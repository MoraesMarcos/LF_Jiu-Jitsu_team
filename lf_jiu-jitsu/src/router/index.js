import { createRouter, createWebHistory } from 'vue-router'

// Importação das Stores para verificação de login
import { authStore } from '@/store/authStore'
import { alunosStore } from '@/store/alunosStore'

// Importação das Views (Páginas)
import HomeView from '@/views/HomeView.vue'
import PlanosView from '@/views/PlanosView.vue'
import HorariosView from '@/views/HorariosView.vue'
import InstrutoresView from '@/views/InstrutoresView.vue'
import InstrutorDetailView from '@/views/InstrutorDetailView.vue'
import ContatosView from '@/views/ContatosView.vue'
import CheckInView from '@/views/CheckInView.vue'
import CheckInDetailView from '@/views/CheckInDetailView.vue'
import RecuperarSenhaView from '@/views/RecuperarSenhaView.vue'
import BlogView from '@/views/BlogView.vue'

// Views do Aluno
import AlunoLoginView from '@/views/AlunoLoginView.vue'
import AlunoAgendaView from '@/views/aluno/AlunoAgendaView.vue'
import AlunoAgendaDetailView from '@/views/aluno/AlunoAgendaDetailView.vue'

// Views do Admin
import AdminView from '@/views/AdminView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rotas Públicas ---
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/planos',
      name: 'planos',
      component: PlanosView
    },
    {
      path: '/horarios',
      name: 'horarios',
      component: HorariosView
    },
    {
      path: '/instrutores',
      name: 'instrutores',
      component: InstrutoresView
    },
    {
      path: '/instrutores/:slug',
      name: 'instrutor-detalhe',
      component: InstrutorDetailView
    },
    {
      path: '/contato',
      name: 'contato',
      component: ContatosView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenhaView
    },

    // --- Rotas de Check-in (Geral/Totem) ---
    {
      path: '/checkin',
      name: 'checkin',
      component: CheckInView
    },
    {
      path: '/checkin/:id',
      name: 'checkin-detalhe',
      component: CheckInDetailView
    },

    // --- Rotas do Aluno (Protegidas) ---
    {
      path: '/login-aluno',
      name: 'aluno-login',
      component: AlunoLoginView
    },
    {
      path: '/aluno',
      name: 'area-aluno',
      component: AlunoAgendaView,
      meta: { requiresStudent: true } // Exige login de aluno
    },
    {
      path: '/aluno/agenda/:id',
      name: 'area-aluno-agenda-detalhe',
      component: AlunoAgendaDetailView,
      meta: { requiresStudent: true } // Exige login de aluno
    },

    // --- Rotas Administrativas (Protegidas) ---
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true } // Exige login de admin
    },

    // --- Redirecionamentos ---
    {
      path: '/sobre',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // 1. Proteção do Admin
  // Verifica se a rota precisa de admin E se o admin NÃO está logado
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/admin/login')
  }

  // 2. Proteção do Aluno
  // Verifica se a rota precisa de aluno E se o aluno NÃO está logado
  if (to.meta.requiresStudent && !alunosStore.currentUser) {
    return next('/login-aluno')
  }

  next()
})

export default router