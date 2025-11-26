import { createRouter, createWebHistory } from 'vue-router'

import { authStore } from '@/store/authStore'
import { alunosStore } from '@/store/alunosStore'

// Views públicas
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // PÚBLICAS
    { path: '/', name: 'home', component: HomeView },
    { path: '/planos', name: 'planos', component: PlanosView },
    { path: '/horarios', name: 'horarios', component: HorariosView },
    { path: '/instrutores', name: 'instrutores', component: InstrutoresView },
    {
      path: '/instrutores/:slug',
      name: 'instrutor-detalhe',
      component: InstrutorDetailView
    },
    { path: '/contato', name: 'contato', component: ContatosView },
    { path: '/blog', name: 'blog', component: BlogView },

    // recuperação antiga / genérica (se você ainda quiser manter)
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: RecuperarSenhaView
    },

    // TOTEM DE CHECK-IN (público, sem login)
    { path: '/checkin', name: 'checkin', component: CheckInView },
    {
      path: '/checkin/:id',
      name: 'checkin-detalhe',
      component: CheckInDetailView
    },

    // ================== ALUNO ==================
    {
      path: '/login-aluno',
      name: 'login-aluno',
      component: () => import('@/views/aluno/AlunoLoginView.vue')
    },

    {
      path: '/aluno',
      name: 'area-aluno',
      component: () => import('@/views/aluno/AlunoAreaView.vue'),
      meta: { requiresStudent: true }
    },

    {
      path: '/recuperar-senha-aluno',
      name: 'recuperar-senha-aluno',
      component: () => import('@/views/aluno/AlunoRecoverView.vue')
    },

    // ================== ADMIN ==================
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue')
    },

    {
      path: '/admin/recuperar-senha',
      name: 'admin-recuperar-senha',
      component: () => import('@/views/admin/AdminRecuperacao.vue')
    },

    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { requiresAdmin: true }
    },

    // redirect /sobre
    { path: '/sobre', redirect: '/' },

    // catch-all 404 -> home
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// ================== GUARDA GLOBAL ==================
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/admin/login')
  }

  if (to.meta.requiresStudent && !alunosStore.currentUser) {
    return next('/login-aluno')
  }

  next()
})

export default router
