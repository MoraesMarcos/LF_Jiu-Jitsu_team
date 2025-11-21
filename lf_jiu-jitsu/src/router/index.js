import { createRouter, createWebHistory } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/planos', name: 'planos', component: PlanosView },
    { path: '/horarios', name: 'horarios', component: HorariosView },
    { path: '/instrutores', name: 'instrutores', component: InstrutoresView },
    { path: '/instrutores/:slug', name: 'instrutor-detalhe', component: InstrutorDetailView },
    { path: '/contato', name: 'contato', component: ContatosView },
    { path: '/checkin', name: 'checkin', component: CheckInView },
    { path: '/checkin/:id', name: 'checkin-detalhe', component: CheckInDetailView },
    { path: '/aluno', name: 'area-aluno', component: AlunoAgendaView },
    { path: '/aluno/agenda/:id', name: 'area-aluno-agenda-detalhe', component: AlunoAgendaDetailView },
    { path: '/recuperar-senha', name: 'recuperar-senha', component: RecuperarSenhaView },

    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },

    { path: '/sobre', redirect: '/' },
    { path: '/admin', redirect: '/checkin' }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router