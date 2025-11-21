import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '@/store/authStore'

import HomeView from '@/views/HomeView.vue'
import PlanosView from '@/views/PlanosView.vue'
import HorariosView from '@/views/HorariosView.vue'
import InstrutoresView from '@/views/InstrutoresView.vue'
import InstrutorDetailView from '@/views/InstrutorDetailView.vue'
import ContatosView from '@/views/ContatosView.vue'
import CheckInView from '@/views/CheckInView.vue'
import CheckInDetailView from '@/views/CheckInDetailView.vue'
import AlunoAgendaView from '@/views/aluno/AlunoAgendaView.vue'
import AlunoAgendaDetailView from '@/views/aluno/AlunoAgendaDetailView.vue'
import RecuperarSenhaView from '@/views/RecuperarSenhaView.vue'
import BlogView from '@/views/BlogView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/checkin',
      name: 'checkin',
      component: CheckInView
    },
    {
      path: '/checkin/:id',
      name: 'checkin-detalhe',
      component: CheckInDetailView
    },
    {
      path: '/aluno',
      name: 'area-aluno',
      component: AlunoAgendaView
    },
    {
      path: '/aluno/agenda/:id',
      name: 'area-aluno-agenda-detalhe',
      component: AlunoAgendaDetailView
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenhaView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    // Rotas Administrativas
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true } // Marca a rota como protegida
    },
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

// Guarda de navegação (Proteção)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router