<!-- src/views/CheckInView.vue -->
<template>
  <main class="checkin">
    <section class="page-header">
      <div class="container">
        <h1>Check-in</h1>
        <p>Escolha o dia e selecione um horário para confirmar presença.</p>
      </div>
    </section>

    <section class="container day-picker">
      <label>
        Dia:
        <input type="date" v-model="dateISO" />
      </label>
    </section>

    <section class="container list">
      <div v-if="classes.length === 0" class="empty">Nenhuma turma para este dia.</div>

      <article v-for="cls in classes" :key="cls.id" class="slot">
        <div class="info">
          <h3>{{ cls.time }} — {{ cls.coach }}</h3>
          <p>{{ cls.attendees.length }} / {{ cls.capacity }} vagas</p>
        </div>
        <RouterLink :to="{ name: 'checkin-detalhe', params: { id: cls.id } }" class="btn">
          Ver lista / Fazer check-in
        </RouterLink>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { checkinStore } from '@/store/checkinStore'
import { RouterLink } from 'vue-router'

function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const dateISO = ref(todayISO())
const classes = computed(() => checkinStore.listByDate(dateISO.value))

watch(dateISO, () => {})
</script>

<style scoped>
.page-header { background:#f3f4f6; padding:40px 0; text-align:center }
.container { max-width: 940px; margin: 0 auto; padding: 0 16px }
.day-picker { padding: 24px 0 }
.list { display: grid; gap: 16px; padding: 16px 0 48px }
.slot { display:flex; justify-content:space-between; align-items:center; border:1px solid #e5e7eb; border-radius:10px; padding:16px }
.slot h3 { margin:0 }
.btn { padding:10px 14px; border-radius:8px; border:1px solid #1d4ed8; color:#1d4ed8; text-decoration:none }
.empty { text-align:center; color:#6b7280; padding:32px 0 }
</style>
