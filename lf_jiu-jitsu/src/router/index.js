import { createRouter, createWebHistory } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'
import { authStore } from '@/store/authStore'

// Importação das Views
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue' // Importante: Importar a view Sobre
import HorariosView from '../views/HorariosView.vue'
import PlanosView from '../views/PlanosView.vue'
import InstrutoresView from '../views/InstrutoresView.vue'
import InstrutorDetailView from '../views/InstrutorDetailView.vue'
import BlogView from '../views/BlogView.vue'
import ContatosView from '../views/ContatosView.vue'

// Aluno
import AlunoLoginView from '../views/aluno/AlunoLoginView.vue'
import AlunoRecoverView from '../views/aluno/AlunoRecoverView.vue'
import AlunoAreaView from '../views/aluno/AlunoAreaView.vue'

// Admin
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminView from '../views/admin/AdminView.vue'
import AdminRecuperacao from '../views/admin/AdminRecuperacao.vue'

// Checkin Público (se houver uso)
import CheckInView from '../views/CheckInView.vue'
import CheckInDetailView from '../views/CheckInDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Sempre rola para o topo ao mudar de página
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // --- CORREÇÃO AQUI ---
    {
      path: '/sobre',
      name: 'sobre',
      component: AboutView // Agora carrega a página Sobre em vez de redirecionar
    },
    // ---------------------
    {
      path: '/horarios',
      name: 'horarios',
      component: HorariosView
    },
    {
      path: '/planos',
      name: 'planos',
      component: PlanosView
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
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/contato',
      name: 'contato',
      component: ContatosView
    },
    // --- ÁREA DO ALUNO ---
    {
      path: '/login-aluno',
      name: 'login-aluno',
      component: AlunoLoginView
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: AlunoRecoverView
    },
    {
      path: '/aluno',
      name: 'area-aluno',
      component: AlunoAreaView,
      meta: { requiresStudent: true }
    },
    // --- ÁREA ADMIN ---
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin/recuperar-senha',
      name: 'admin-recover',
      component: AdminRecuperacao
    },
    {
      path: '/admin',
      name: 'admin-area',
      component: AdminView,
      meta: { requiresAdmin: true }
    },
    // --- EXTRAS ---
    {
      path: '/checkin',
      name: 'checkin-publico',
      component: CheckInView
    },
    {
      path: '/checkin/:id',
      name: 'checkin-detalhe',
      component: CheckInDetailView
    },
    // Catch-all (qualquer rota desconhecida volta pra home)
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Guardas de navegação (Proteção das rotas)
router.beforeEach((to, from, next) => {
  // Proteção Admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/admin/login')
  }

  // Proteção Aluno
  if (to.meta.requiresStudent && !alunosStore.currentUser) {
    return next('/login-aluno')
  }

  next()
})

export default router