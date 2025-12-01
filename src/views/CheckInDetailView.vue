<!-- src/views/CheckInDetailView.vue -->
<template>
  <main class="detail">
    <section class="page-header">
      <div class="container">
        <h1>Check-in — {{ klass?.time }}</h1>
        <p>Coach: {{ klass?.coach }} • Capacidade: {{ klass?.capacity }}</p>
        <RouterLink to="/checkin" class="back">← Voltar</RouterLink>
      </div>
    </section>

    <section class="container">
      <div v-if="!klass" class="empty">Aula não encontrada.</div>

      <div v-else class="card">
        <h2>Lista de Presença ({{ klass.attendees.length }}/{{ klass.capacity }})</h2>

        <ul class="list">
          <li v-for="a in klass.attendees" :key="a.id">
            <span class="dot"></span> {{ a.name }}
            <button class="link" @click="remove(a.id)">remover</button>
          </li>
          <li v-if="klass.attendees.length === 0" class="muted">Nenhum check-in ainda.</li>
        </ul>

        <form class="checkin-form" @submit.prevent="doCheckin">
          <input v-model="studentName" type="text" placeholder="Seu nome" required />
          <button class="btn-primary" type="submit">Fazer check-in</button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { checkinStore } from '@/store/checkinStore'

const route = useRoute()
const klass = computed(() => checkinStore.getById(route.params.id))

const studentName = ref('') 

function doCheckin() {
  if (!klass.value) return
  const me = { id: `local:${studentName.value.trim().toLowerCase()}`, name: studentName.value.trim() }
  const { ok, message } = checkinStore.checkIn(klass.value.id, me)
  if (!ok && message) alert(message)
  if (ok) studentName.value = ''
}

function remove(id) {
  if (!klass.value) return
  checkinStore.remove(klass.value.id, id)
}
</script>

<style scoped>
.page-header { background:#f3f4f6; padding:40px 0; text-align:center }
.container { max-width: 720px; margin: 0 auto; padding: 0 16px }
.back { display:inline-block; margin-top:10px; color:#1d4ed8 }
.card { border:1px solid #e5e7eb; border-radius:12px; padding:20px; margin:24px 0 48px }
.list { list-style:none; padding:0; margin:0 0 16px; display:grid; gap:8px }
.dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; margin-right:8px }
.muted { color:#6b7280 }
.checkin-form { display:flex; gap:8px; margin-top:8px }
.checkin-form input { flex:1; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px }
.btn-primary { padding:10px 14px; border-radius:8px; border:1px solid #1d4ed8; background:#1d4ed8; color:#fff; font-weight:700; cursor:pointer }
</style>
