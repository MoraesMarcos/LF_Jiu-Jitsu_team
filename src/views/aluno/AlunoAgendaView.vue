<!-- src/views/aluno/AlunoAgendaView.vue -->
<template>
  <section class="agenda">
    <header class="agenda__header">
      <h2>Agenda / Check-in</h2>
      <p>
        Escolha o dia e confirme sua presença nas aulas.
        O sistema mostra apenas turmas do seu perfil:
        <strong>{{ perfilLabel }}</strong>.
      </p>
    </header>

    <nav
      class="agenda__days"
      aria-label="Selecione o dia para ver as aulas disponíveis"
    >
      <button
        v-for="(dia, index) in dias"
        :key="dia.key"
        class="day-pill"
        :class="{ 'day-pill--active': index === diaSelecionado }"
        @click="diaSelecionado = index"
      >
        {{ dia.rotuloCurto }}
      </button>
    </nav>

    <div class="agenda__lista">
      <article
        v-for="aula in aulasFiltradas"
        :key="aula.chave"
        class="agenda-card"
      >
        <div class="agenda-card__info">
          <p class="agenda-card__hora">{{ aula.hora }}</p>
          <h3 class="agenda-card__titulo">{{ aula.titulo }}</h3>
          <p class="agenda-card__meta">
            Instrutor: {{ aula.instrutor }} · Turma:
            <span>{{ tipoLabel(aula.tipo) }}</span>
          </p>
        </div>

        <div class="agenda-card__right">
          <button
            type="button"
            class="link-presenca"
            @click="abrirPresencas(aula)"
          >
            Ver lista de presença
          </button>

          <div class="agenda-card__ocupacao" aria-label="Ocupação da turma">
            <span
              class="ocupacao__ponto"
              :class="{ 'ocupacao__ponto--ok': temCheckin(aula) }"
            />
            <span>
              {{ totalPresencas(aula) }} / {{ aula.capacidade }}
            </span>
          </div>

          <button
            type="button"
            class="btn-checkin"
            :class="{ 'btn-checkin--feito': temCheckin(aula) }"
            @click="fazerOuRemoverCheckin(aula)"
          >
            {{ temCheckin(aula) ? 'Check-in feito' : 'Fazer check-in' }}
          </button>
        </div>
      </article>

      <p v-if="aulasFiltradas.length === 0" class="agenda__vazio">
        Para este dia não há aulas no seu perfil de treino.
      </p>
    </div>

    <div v-if="modalAula" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <header class="modal__header">
          <h3>Lista de presença</h3>
          <p>
            {{ modalAula.hora }} · {{ modalAula.titulo }} —
            {{ tipoLabel(modalAula.tipo) }}
          </p>
        </header>

        <ul class="modal__lista">
          <li v-for="(aluno, idx) in presencasModal" :key="idx">
            <div class="avatar">{{ iniciais(aluno.nome) }}</div>
            <span>{{ aluno.nome }}</span>
          </li>
          <li v-if="presencasModal.length === 0" class="modal__nenhum">
            Nenhum aluno fez check-in ainda.
          </li>
        </ul>

        <footer class="modal__footer">
          <button type="button" class="btn-fechar" @click="modalAula = null">
            Fechar
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { alunosStore } from '@/store/alunosStore'

const currentUser = alunosStore.currentUser

const perfil = computed(() => currentUser?.perfil || 'adulto')

const perfilLabel = computed(() => {
  if (perfil.value === 'kids') return 'Infantil (Kids)'
  if (perfil.value === 'feminino') return 'Turma Feminina'
  return 'Adulto'
})

const dataKeyBase = '2025-11-25'

const dias = [
  {
    key: dataKeyBase,
    rotuloCurto: 'ter., 25/11',
    aulas: [
      { hora: '05:00', titulo: 'Treino Normal Adulto', tipo: 'adulto', instrutor: 'Mestre Silva', capacidade: 20, chave: 'ADULTO-0500' },
      { hora: '09:00', titulo: 'Jiu-Jitsu Kids', tipo: 'kids', instrutor: 'Instrutor João', capacidade: 15, chave: 'KIDS-0900' },
      { hora: '11:00', titulo: 'Aula Especial Fundamentos', tipo: 'misto', instrutor: 'Professor João', capacidade: 25, chave: 'MISTO-1100' },
      { hora: '14:00', titulo: 'Treino Normal Adulto', tipo: 'adulto', instrutor: 'Mestre Silva', capacidade: 20, chave: 'ADULTO-1400' },
      { hora: '16:00', titulo: 'Turma Feminina', tipo: 'feminino', instrutor: 'Instrutora Ana', capacidade: 18, chave: 'FEM-1600' },
      { hora: '17:30', titulo: 'Jiu-Jitsu Kids', tipo: 'kids', instrutor: 'Instrutor João', capacidade: 15, chave: 'KIDS-1730' },
      { hora: '19:30', titulo: 'Jiu-Jitsu Adulto', tipo: 'adulto', instrutor: 'Mestre Silva', capacidade: 20, chave: 'ADULTO-1930' }
    ]
  },
  {
    key: '2025-11-26',
    rotuloCurto: 'qua., 26/11',
    aulas: [
      { hora: '05:00', titulo: 'Drills de Movimento', tipo: 'misto', instrutor: 'Mestre Silva', capacidade: 20, chave: 'MISTO-0500-Q' },
      { hora: '09:00', titulo: 'Kids Luta Recreativa', tipo: 'kids', instrutor: 'Instrutora Ana', capacidade: 15, chave: 'KIDS-0900-Q' },
      { hora: '16:00', titulo: 'Turma Feminina Avançada', tipo: 'feminino', instrutor: 'Instrutora Ana', capacidade: 18, chave: 'FEM-1600-Q' },
      { hora: '19:30', titulo: 'Adulto No-Gi', tipo: 'adulto', instrutor: 'Professor João', capacidade: 20, chave: 'ADULTO-1930-Q' }
    ]
  },
  {
    key: '2025-11-27',
    rotuloCurto: 'qui., 27/11',
    aulas: [
      { hora: '11:00', titulo: 'Aula Especial Raspe & Passe', tipo: 'misto', instrutor: 'Mestre Silva', capacidade: 25, chave: 'MISTO-1100-QI' },
      { hora: '17:30', titulo: 'Kids Básico', tipo: 'kids', instrutor: 'Instrutor João', capacidade: 15, chave: 'KIDS-1730-QI' },
      { hora: '19:30', titulo: 'Adulto Gi', tipo: 'adulto', instrutor: 'Mestre Silva', capacidade: 20, chave: 'ADULTO-1930-QI' }
    ]
  }
]

const diaSelecionado = ref(0)

const aulasFiltradas = computed(() => {
  const dia = dias[diaSelecionado.value]
  if (!dia) return []

  return dia.aulas.filter(aula => {
    if (perfil.value === 'kids') return aula.tipo === 'kids'
    if (perfil.value === 'feminino') return aula.tipo === 'feminino' || aula.tipo === 'misto'

    return aula.tipo === 'adulto' || aula.tipo === 'misto'
  })
})

function tipoLabel (tipo) {
  if (tipo === 'kids') return 'Kids'
  if (tipo === 'feminino') return 'Feminina'
  if (tipo === 'misto') return 'Mista'
  return 'Adulto'
}

function temCheckin (aula) {
  const dia = dias[diaSelecionado.value]
  return alunosStore.hasCheckin(dia.key, aula.chave)
}

function fazerOuRemoverCheckin (aula) {
  const dia = dias[diaSelecionado.value]
  alunosStore.toggleCheckin(dia.key, aula.chave)
}

function totalPresencas (aula) {
  const dia = dias[diaSelecionado.value]
  return alunosStore.getPresencas(dia.key, aula.chave).length
}

const modalAula = ref(null)
const presencasModal = ref([])

function abrirPresencas (aula) {
  const dia = dias[diaSelecionado.value]
  modalAula.value = { ...aula, dataKey: dia.key }
  presencasModal.value = alunosStore.getPresencas(dia.key, aula.chave)
}

function iniciais (nome) {
  const partes = (nome || '').split(' ')
  return (partes[0]?.[0] || '') + (partes[1]?.[0] || '')
}
</script>

<style scoped>
.agenda {
  margin-top: 1rem;
}

.agenda__header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.agenda__header p {
  color: #6b7280;
  max-width: 650px;
}

.agenda__days {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.day-pill {
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  padding: 0.45rem 1.1rem;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
}

.day-pill--active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.agenda__lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agenda-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.agenda-card__info {
  flex: 1 1 auto;
}

.agenda-card__hora {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.agenda-card__titulo {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.agenda-card__meta {
  color: #6b7280;
  font-size: 0.9rem;
}

.agenda-card__meta span {
  font-weight: 600;
}

.agenda-card__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.link-presenca {
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
  align-self: flex-end;
}

.agenda-card__ocupacao {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.ocupacao__ponto {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #e5e7eb;
}

.ocupacao__ponto--ok {
  background: #22c55e;
}

.btn-checkin {
  border-radius: 9999px;
  border: none;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: #ffffff;
}

.btn-checkin--feito {
  background: #22c55e;
}

.agenda__vazio {
  margin-top: 1rem;
  color: #6b7280;
}

/* modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}

.modal {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 1.5rem 1.75rem;
  width: 100%;
  max-width: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal__header h3 {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.modal__header p {
  color: #6b7280;
  font-size: 0.9rem;
}

.modal__lista {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  overflow-y: auto;
  flex: 1 1 auto;
}

.modal__lista li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0;
}

.modal__nenhum {
  color: #6b7280;
  font-size: 0.9rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
}

.btn-fechar {
  border-radius: 9999px;
  border: none;
  padding: 0.5rem 1.2rem;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
}

/* responsivo */
@media (max-width: 900px) {
  .agenda-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .agenda-card__right {
    align-items: flex-start;
  }
}
</style>
