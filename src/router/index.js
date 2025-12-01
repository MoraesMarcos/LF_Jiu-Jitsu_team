import { createRouter, createWebHistory } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'
import { authStore } from '@/store/authStore'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import HorariosView from '../views/HorariosView.vue'
import PlanosView from '../views/PlanosView.vue'
import InstrutoresView from '../views/InstrutoresView.vue'
import InstrutorDetailView from '../views/InstrutorDetailView.vue'
import BlogView from '../views/BlogView.vue'
import ContatosView from '../views/ContatosView.vue'

import AlunoLoginView from '../views/aluno/AlunoLoginView.vue'
import AlunoRecoverView from '../views/aluno/AlunoRecoverView.vue'
import AlunoAreaView from '../views/aluno/AlunoAreaView.vue'

import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminView from '../views/admin/AdminView.vue'
import AdminRecuperacao from '../views/admin/AdminRecuperacao.vue'

import CheckInView from '../views/CheckInView.vue'
import CheckInDetailView from '../views/CheckInDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/sobre', name: 'sobre', component: AboutView },
    { path: '/horarios', name: 'horarios', component: HorariosView },
    { path: '/planos', name: 'planos', component: PlanosView },
    { path: '/instrutores', name: 'instrutores', component: InstrutoresView },
    { path: '/instrutores/:slug', name: 'instrutor-detalhe', component: InstrutorDetailView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/contato', name: 'contato', component: ContatosView },

    { path: '/login-aluno', name: 'login-aluno', component: AlunoLoginView },
    { path: '/recuperar-senha', name: 'recuperar-senha', component: AlunoRecoverView },
    {
      path: '/aluno',
      name: 'area-aluno',
      component: AlunoAreaView,
      meta: { requiresStudent: true }
    },

    { path: '/admin/login', name: 'admin-login', component: AdminLoginView },
    { path: '/admin/recuperar-senha', name: 'admin-recover', component: AdminRecuperacao },
    {
      path: '/admin',
      name: 'admin-area',
      component: AdminView,
      meta: { requiresAdmin: true } 
    },

    { path: '/checkin', name: 'checkin-publico', component: CheckInView },
    { path: '/checkin/:id', name: 'checkin-detalhe', component: CheckInDetailView },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.meta.requiresAdmin) {
    if (!authStore.isAdmin) {
      return next('/admin/login')
    }
  }

  if (to.meta.requiresStudent) {
    if (!alunosStore.currentUser) {
      return next('/login-aluno')
    }
  }

  next()
})

export default router