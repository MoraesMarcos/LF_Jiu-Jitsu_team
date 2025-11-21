import { createRouter, createWebHistory } from 'vue-router'

// Home sem lazy para primeiro paint mais rápido
import HomeView from '@/views/HomeView.vue'

// Lazy de páginas “externas”
const AboutView       = () => import('@/views/AboutView.vue')
const HorariosView    = () => import('@/views/HorariosView.vue')
const PlanosView      = () => import('@/views/PlanosView.vue')
const InstrutoresView = () => import('@/views/InstrutoresView.vue')
const InstrutorDetail = () => import('@/views/InstrutorDetailView.vue')
const BlogView        = () => import('@/views/BlogView.vue')
const ContatosView    = () => import('@/views/ContatosView.vue')

// Área do aluno + filhos (Agenda)
const AlunoAreaView        = () => import('@/views/AlunoAreaView.vue')
const AlunoAgendaView      = () => import('@/views/aluno/AlunoAgendaView.vue')
const AlunoAgendaDetail    = () => import('@/views/aluno/AlunoAgendaDetailView.vue')

// Admin e utilidades
const Admin              = () => import('@/views/Admin.vue')
const AdminRecuperacao   = () => import('@/views/AdminRecuperacao.vue')
const RecuperarSenhaView = () => import('@/views/RecuperarSenhaView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',             name: 'home',        component: HomeView },
    { path: '/sobre',        name: 'sobre',       component: AboutView },
    { path: '/horarios',     name: 'horarios',    component: HorariosView },
    { path: '/planos',       name: 'planos',      component: PlanosView },
    { path: '/instrutores',  name: 'instrutores', component: InstrutoresView },
    { path: '/instrutores/:slug', name: 'instrutor-detalhe', component: InstrutorDetail, props: true },
    { path: '/blog',         name: 'blog',        component: BlogView },
    { path: '/contato',      name: 'contato',     component: ContatosView },

    // ===== Área do aluno (layout) + Rotas filhas =====
    {
      path: '/area-do-aluno',
      component: AlunoAreaView,
      children: [
        // Dashboard (conteúdo embutido dentro do AlunoArea quando name === 'area-aluno')
        { path: '', name: 'area-aluno' },

        // Agenda (lista por dia + horários com check-in)
        { path: 'agenda', name: 'area-aluno-agenda', component: AlunoAgendaView },

        // Detalhe de um horário (lista de presença, check-in/cancelar)
        { path: 'agenda/:id', name: 'area-aluno-agenda-detalhe', component: AlunoAgendaDetail, props: true },
      ],
    },
    // Atalho antigo
    { path: '/aluno', redirect: { name: 'area-aluno' } },

    // Admin
    { path: '/admin',           name: 'admin',             component: Admin },
    { path: '/admin/recuperar', name: 'admin-recuperacao', component: AdminRecuperacao },

    // Utilidades
    { path: '/recuperar-senha', name: 'recuperar-senha',   component: RecuperarSenhaView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
