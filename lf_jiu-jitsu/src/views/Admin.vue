<template>
  <main class="admin">
    
    <section v-if="!logado" class="auth-shell">
      <aside class="auth-left">
        <div class="brand-wrap">
          <div class="brand-title">LF Jiu-Jitsu</div>
          <div class="brand-subtitle">Painel Administrativo</div>
        </div>
      </aside>

      <section class="auth-right">
        <div class="auth-toplink">
          <a href="/" class="back-link">← Voltar para o site</a>
        </div>

        <div class="auth-card">
          <header class="auth-head">
            <h1>Acesso Admin</h1>
            <p class="muted">Área restrita. Use suas credenciais.</p>
          </header>

          <div v-if="toast.msg && !logado" :class="['toast', toast.type]">{{ toast.msg }}</div>

          <form @submit.prevent="entrar" class="auth-form">
            <label class="auth-label">
              <span class="label-caption">USUÁRIO / E-MAIL</span>
              <input
                v-model.trim="login.email"
                type="text"
                placeholder="admin@lfjiujitsu.com"
                :class="{'is-invalid': loginTouched.email && !login.email}"
                @blur="loginTouched.email = true"
                required
              />
              <small v-if="loginTouched.email && !login.email" class="error">Campo obrigatório.</small>
            </label>

            <label class="auth-label">
              <span class="label-caption">SENHA</span>
              <input
                v-model="login.senha"
                type="password"
                placeholder="•••••••"
                :class="{'is-invalid': loginTouched.senha && login.senha.length < 6}"
                @blur="loginTouched.senha = true"
                required
              />
              <small v-if="loginTouched.senha && login.senha.length < 6" class="error">Mínimo de 6 caracteres.</small>
            </label>

            <div class="auth-row-right">
              <RouterLink class="link tiny" to="/admin/recuperar">Esqueceu a senha?</RouterLink>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            <p v-if="erroLogin" class="error mt-8">{{ erroLogin }}</p>
          </form>
        </div>
      </section>
    </section>

    <section v-else class="container">
      <header class="page-head">
        <h1>Painel Administrativo</h1>
        <p class="muted">Gerencie alunos, mensalidades, presença e avisos.</p>
      </header>

      <div v-if="toast.msg && logado" :class="['toast', toast.type]" style="margin: 12px 0;">
        {{ toast.msg }}
      </div>

      <section class="dashboard">
        <div class="grid-3">
          <article class="card">
            <h3>Alunos ativos</h3>
            <p class="big">{{ resumo.alunosAtivos }}</p>
            <p class="muted tiny">Com matrícula em dia</p>
          </article>

          <article class="card">
            <h3>Pagamentos pendentes</h3>
            <p class="big danger">{{ resumo.pagamentosPendentes }}</p>
            <p class="muted tiny">Últimos 30 dias</p>
          </article>

          <article class="card">
            <h3>Próxima cobrança</h3>
            <p class="big">{{ resumo.vencimentoProximo }}</p>
            <p class="muted tiny">Turma infantil • Plano mensal</p>
          </article>
        </div>

        <article class="card mt-20">
          <div class="row space-between center-mobile">
            <h3>Alunos e Situação</h3>
            <button class="btn btn-primary sm" @click="cadastrarAluno">+ Novo aluno</button>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Nome</th><th>Faixa</th><th>Plano</th><th>Status</th><th>Vencimento</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in alunos" :key="i">
                <td><strong>{{ a.nome }}</strong></td>
                <td>{{ a.faixa }}</td>
                <td>{{ a.plano }}</td>
                <td>
                  <span class="badge" :class="{ ok: a.status === 'Em dia', warn: a.status === 'Pendente' }">
                    {{ a.status }}
                  </span>
                </td>
                <td :class="{ danger: a.status === 'Pendente' }">{{ a.vencimento }}</td>
                <td><button class="btn sm" @click="editarAluno(a)">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="card mt-20">
          <h3>Avisos gerais</h3>
          <ul class="list">
            <li v-for="(aviso, idx) in avisos" :key="idx" class="list-item">
              <div>
                <strong>{{ aviso.titulo }}</strong>
                <div class="muted tiny">{{ aviso.msg }}</div>
              </div>
              <button class="btn sm" @click="removerAviso(idx)">Remover</button>
            </li>
          </ul>

          <div class="row mt-16">
            <div class="field">
              <input
                v-model.trim="novoAvisoTitulo"
                type="text"
                placeholder="Ex: Campeonato interno"
                :class="{'is-invalid': avisoTouched.titulo && !novoAvisoTitulo}"
                @blur="avisoTouched.titulo = true"
              />
              <small v-if="avisoTouched.titulo && !novoAvisoTitulo" class="error">Campo obrigatório.</small>
            </div>

            <div class="field">
              <input
                v-model.trim="novoAvisoMsg"
                type="text"
                placeholder="Ex: Sábado 9h • obrigatório kimono"
                :class="{'is-invalid': avisoTouched.msg && !novoAvisoMsg}"
                @blur="avisoTouched.msg = true"
              />
              <small v-if="avisoTouched.msg && !novoAvisoMsg" class="error">Campo obrigatório.</small>
            </div>

            <button class="btn btn-secondary sm" @click="adicionarAviso">Publicar aviso</button>
          </div>
        </article>

        <article class="card mt-20">
          <h3>Mural de Notícias (Máx. 4)</h3>
          <p class="muted tiny">Usado na Home. A mais antiga sai quando atingir 4.</p>

          <ul class="list mt-16">
            <li v-for="(item, idx) in newsItems" :key="item.createdAt ?? idx" class="list-item">
              <div>
                <strong>{{ item.title }}</strong>
                <div class="muted tiny">{{ item.excerpt }}</div>
              </div>
              <button class="btn sm" @click="removeNews(idx)">Remover</button>
            </li>
          </ul>

          <div class="row mt-16">
            <div class="field">
              <input
                v-model.trim="newNewsItem.title"
                type="text"
                placeholder="Título da Notícia"
                :class="{'is-invalid': newsTouched.title && !newNewsItem.title}"
                @blur="newsTouched.title = true"
              />
              <small v-if="newsTouched.title && !newNewsItem.title" class="error">Campo obrigatório.</small>
            </div>

            <div class="field">
              <input
                v-model.trim="newNewsItem.excerpt"
                type="text"
                placeholder="Resumo da Notícia"
                :class="{'is-invalid': newsTouched.excerpt && !newNewsItem.excerpt}"
                @blur="newsTouched.excerpt = true"
              />
              <small v-if="newsTouched.excerpt && !newNewsItem.excerpt" class="error">Campo obrigatório.</small>
            </div>
          </div>

          <div class="row mt-8">
            <div class="field" style="flex-grow:1;">
              <input
                v-model.trim="newNewsItem.image"
                type="text"
                placeholder="Caminho da Imagem (ex: /src/assets/images/publico/nova.jpg)"
                :class="{'is-invalid': newsTouched.image && !newNewsItem.image}"
                @blur="newsTouched.image = true"
              />
              <small v-if="newsTouched.image && !newNewsItem.image" class="error">Campo obrigatório.</small>
            </div>
            <button class="btn btn-secondary sm" @click="addNews">Publicar Notícia</button>
          </div>
        </article>

        <article class="card mt-20">
          <h3>Posts do Blog (Ilimitado)</h3>
          <p class="muted tiny">Atualiza /blog. Mostra do mais novo para o mais antigo.</p>

          <ul class="list mt-16">
            <li v-for="(post, idx) in blogPosts" :key="post.createdAt ?? idx" class="list-item">
              <div>
                <strong>{{ post.title }}</strong>
                <div class="muted tiny">{{ post.excerpt }}</div>
              </div>
              <button class="btn sm" @click="removeBlogPost(idx)">Remover</button>
            </li>
          </ul>

          <div class="row mt-16">
            <div class="field">
              <input
                v-model.trim="newBlogPost.title"
                type="text"
                placeholder="Título do Post"
                :class="{'is-invalid': blogTouched.title && !newBlogPost.title}"
                @blur="blogTouched.title = true"
              />
              <small v-if="blogTouched.title && !newBlogPost.title" class="error">Campo obrigatório.</small>
            </div>

            <div class="field">
              <input
                v-model.trim="newBlogPost.excerpt"
                type="text"
                placeholder="Resumo do Post"
                :class="{'is-invalid': blogTouched.excerpt && !newBlogPost.excerpt}"
                @blur="blogTouched.excerpt = true"
              />
              <small v-if="blogTouched.excerpt && !newBlogPost.excerpt" class="error">Campo obrigatório.</small>
            </div>
          </div>

          <div class="row mt-8">
            <div class="field" style="flex-grow:1;">
              <input
                v-model.trim="newBlogPost.image"
                type="text"
                placeholder="Caminho da Imagem (ex: /src/assets/images/publico/nova.jpg)"
                :class="{'is-invalid': blogTouched.image && !newBlogPost.image}"
                @blur="blogTouched.image = true"
              />
              <small v-if="blogTouched.image && !newBlogPost.image" class="error">Campo obrigatório.</small>
            </div>
            <button class="btn btn-secondary sm" @click="addBlogPost">Publicar Post</button>
          </div>
        </article>

        <div class="row end mt-20">
          <button class="btn danger" @click="sair">Sair do painel</button>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { articleStore } from '@/store/newsStore'
import { blogStore } from '@/store/blogStore'

const logado = ref(false)
const login = ref({ email: '', senha: '' })
const loginTouched = ref({ email: false, senha: false })
const erroLogin = ref('')
const toast = ref({ msg: '', type: 'ok' }) 
const showToast = (msg, type='ok', ttl=2500) => {
  toast.value = { msg, type }
  setTimeout(() => (toast.value.msg = ''), ttl)
}
onMounted(() => { logado.value = localStorage.getItem('admin_logado') === '1' })
function entrar() {
  erroLogin.value = ''
  if (!login.value.email || login.value.senha.length < 6) {
    if (!login.value.email) loginTouched.value.email = true
    if (login.value.senha.length < 6) loginTouched.value.senha = true
    erroLogin.value = 'Verifique usuário/e-mail e senha.'
    return
  }
  if (login.value.email === 'admin@lfjiujitsu.com' && login.value.senha === '123456') {
    logado.value = true
    localStorage.setItem('admin_logado', '1')
    showToast('Login realizado com sucesso!')
  } else {
    erroLogin.value = 'Credenciais inválidas.'
  }
}
function sair() {
  logado.value = false
  localStorage.removeItem('admin_logado')
  showToast('Sessão encerrada.', 'warn')
}

const resumo = ref({ alunosAtivos: 27, pagamentosPendentes: 3, vencimentoProximo: '10/11/2025' })
const alunos  = ref([
  { nome: 'João Silva',  faixa: 'Branca',       plano: 'Mensal', status: 'Em dia',   vencimento: '10/11/2025' },
  { nome: 'Ana Souza',   faixa: 'Amarela',      plano: 'Mensal', status: 'Pendente', vencimento: '05/11/2025' },
  { nome: 'Carlos Lima', faixa: 'Cinza (Kids)', plano: 'Kids',   status: 'Em dia',   vencimento: '12/11/2025' },
])

const avisos = ref([
  { titulo: 'Treino extra', msg: 'Sábado 9h • turma competição' },
  { titulo: 'Pagamento novembro', msg: 'Regularizar até dia 10/11' },
])
const novoAvisoTitulo = ref('')
const novoAvisoMsg = ref('')
const avisoTouched = ref({ titulo: false, msg: false })
function adicionarAviso() {
  avisoTouched.value = { titulo: true, msg: true }
  if (!novoAvisoTitulo.value || !novoAvisoMsg.value) { showToast('Preencha os campos de aviso.', 'warn'); return }
  avisos.value.unshift({ titulo: novoAvisoTitulo.value, msg: novoAvisoMsg.value })
  novoAvisoTitulo.value = ''; novoAvisoMsg.value = ''; avisoTouched.value = { titulo: false, msg: false }
  showToast('Aviso publicado!')
}
function removerAviso(idx) { avisos.value.splice(idx, 1); showToast('Aviso removido.', 'warn') }

const newsItems   = articleStore.latestArticles 
const newNewsItem = ref({ title: '', excerpt: '', image: '' })
const newsTouched = ref({ title: false, excerpt: false, image: false })

function addNews() {
  newsTouched.value = { title: true, excerpt: true, image: true }
  const { title, excerpt, image } = newNewsItem.value
  if (!title || !excerpt || !image) { showToast('Preencha todos os campos da notícia.', 'warn'); return }
  articleStore.addArticle({ title, excerpt, image })
  newNewsItem.value = { title: '', excerpt: '', image: '' }
  newsTouched.value = { title: false, excerpt: false, image: false }
  showToast('Notícia publicada!')
}
function removeNews(idx) {
  articleStore.removeArticle(idx)
  showToast('Notícia removida.', 'warn')
}

const blogPosts   = blogStore.posts  
const newBlogPost = ref({ title: '', excerpt: '', image: '' })
const blogTouched = ref({ title: false, excerpt: false, image: false })

function addBlogPost() {
  blogTouched.value = { title: true, excerpt: true, image: true }
  const { title, excerpt, image } = newBlogPost.value
  if (!title || !excerpt || !image) { showToast('Preencha todos os campos do post.', 'warn'); return }
  blogStore.addBlogPost({ title, excerpt, image })
  newBlogPost.value = { title: '', excerpt: '', image: '' }
  blogTouched.value = { title: false, excerpt: false, image: false }
  showToast('Post publicado!')
}
function removeBlogPost(index) {
  blogStore.removeBlogPost(index)
  showToast('Post removido.', 'warn')
}

function cadastrarAluno() { showToast('Em breve: tela de cadastro de aluno.', 'warn') }
function editarAluno(a)   { showToast(`Edição de ${a.nome} (placeholder).`, 'warn') }
</script>

<style scoped>

.auth-shell{display:grid;grid-template-columns:minmax(240px,480px) 1fr;min-height:100vh;background:#f6f7fb}
.auth-left{background:#121a24;color:#cbd5e1;display:grid;place-items:center;padding:32px 16px}
.brand-wrap{text-align:center}.brand-title{color:#e2e8f0;font-weight:800;font-size:28px;letter-spacing:.4px}.brand-subtitle{color:#9aa8b6;margin-top:8px}
.auth-right{background:#fff;display:grid;grid-template-rows:auto 1fr;padding:32px 24px}
.auth-toplink{max-width:480px;margin:0 auto 8px;width:100%}.back-link{color:#64748b;font-size:13px;text-decoration:none}.back-link:hover{text-decoration:underline}
.auth-card{max-width:480px;width:100%;margin:0 auto;padding:16px 4px 32px}
.auth-head h1{margin:0 0 4px;font-size:28px}.auth-head .muted{margin:0 0 20px}
.auth-form{display:grid;gap:14px}.auth-label{display:grid;gap:6px}
.label-caption{font-size:11px;letter-spacing:.06em;color:#94a3b8;font-weight:700}
.auth-form input{width:100%;height:40px;border:1px solid #e5e7eb;border-radius:10px;padding:8px 12px;font-size:14.5px;background:#fff}
.auth-form input:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.25);outline:none}
.container{max-width:1140px;margin:0 auto;padding:0 16px}.admin{padding:0}.page-head h1{margin:0}.page-head .muted{color:#64748b;margin-top:6px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;box-shadow:0 6px 16px rgba(0,0,0,.04)}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
.row{display:flex;align-items:center;gap:12px}.row input{flex-grow:1}.space-between{justify-content:space-between}.center-mobile{flex-wrap:wrap}.end{justify-content:flex-end}
.table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}.table th,.table td{text-align:left;padding:8px;border-bottom:1px solid #e5e7eb}
.badge{padding:4px 8px;border-radius:999px;font-weight:700;font-size:12px}.badge.ok{background:#dcfce7;color:#14532d}.badge.warn{background:#fff7ed;color:#9a3412}
.big{font-size:24px;font-weight:700;line-height:1.1}.danger{color:#b91c1c}
.list{list-style:none;margin:0;padding:0;display:grid;gap:10px}.list-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9}
input,select,textarea{width:100%;border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;font-size:16px}
input:focus,select:focus,textarea:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.25);outline:none}
.is-invalid{border-color:#ef4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.12)!important}
.error{color:#b91c1c;font-size:12px;margin-top:6px}
.btn{padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;cursor:pointer}.btn.sm{padding:6px 10px;font-size:13px}
.btn-primary{background:#1d4ed8;color:#fff;border-color:#1d4ed8}.btn-secondary{background:#e5efff;color:#1d4ed8;border-color:#bfd3ff}.btn.danger{background:#fee2e2;color:#991b1b;border-color:#fecaca}
.link{color:#1d4ed8}.muted{color:#64748b}.tiny{font-size:12px}.mt-8{margin-top:8px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}
.toast{border-radius:10px;padding:10px 12px;font-size:14px;border:1px solid transparent}
.toast.ok{background:#ecfdf5;color:#065f46;border-color:#a7f3d0}
.toast.warn{background:#fffbeb;color:#92400e;border-color:#fde68a}
.toast.error{background:#fef2f2;color:#7f1d1d;border-color:#fecaca}
@media (max-width:960px){.auth-shell{grid-template-columns:1fr}.auth-left{min-height:220px}.auth-right{padding:24px 16px}}
@media (max-width:900px){.grid-3{grid-template-columns:1fr}}
</style>