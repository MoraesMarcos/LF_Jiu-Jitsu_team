<template>
    <main class="horarios-view">
        <PageHeader title="Horários de Aulas" subtitle="Encontre a turma perfeita para você." />

        <section class="schedule-section">
            <div class="container">

                <div v-if="Object.keys(availableSlots).length === 0" class="empty-state">
                    <p>Nenhum horário cadastrado no momento.</p>
                </div>

                <div v-for="(slots, modality) in availableSlots" :key="modality" class="modality-card">
                    <h2>{{ modality }}</h2>

                    <div class="schedule-grid">
                        <div v-for="dayData in slots" :key="dayData.date" class="day-column">
                            <h3>{{ dayData.label }}</h3>
                            <div class="time-list">
                                <span v-for="time in dayData.times" :key="time" class="time-slot">
                                    {{ time }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="observation">
                    <p>* Estes são os horários oficiais atualizados.</p>
                </div>
            </div>
        </section>

        <CtaSection @openTrialModal="$emit('openTrialModal')" />
    </main>
</template>

<script setup>
import { computed } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import CtaSection from '@/components/CtaSection.vue';
import { scheduleStore } from '@/store/scheduleStore'; // Importa a store

defineEmits(['openTrialModal']);

// Transforma a lista plana da store no formato aninhado que a view espera
// Formato alvo: { 'Adulto': [ { label: 'Segunda-feira', times: ['19:30'] } ] }
const availableSlots = computed(() => {
    const raw = scheduleStore.classes;
    const grouped = {};

    // 1. Agrupar por Modalidade
    raw.forEach(cls => {
        if (!grouped[cls.modality]) {
            grouped[cls.modality] = {};
        }
        // 2. Agrupar por Dia dentro da Modalidade
        if (!grouped[cls.modality][cls.day]) {
            grouped[cls.modality][cls.day] = [];
        }
        // Adiciona o horário e ordena
        grouped[cls.modality][cls.day].push(cls.time);
        grouped[cls.modality][cls.day].sort();
    });

    // 3. Transformar objetos em Arrays para o v-for
    const result = {};
    for (const mod in grouped) {
        result[mod] = Object.keys(grouped[mod]).map(day => ({
            label: day,
            times: grouped[mod][day],
            // Ordenação simples dos dias para exibição (Segunda vem antes de Terça)
            order: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].indexOf(day)
        })).sort((a, b) => a.order - b.order);
    }

    return result;
});
</script>

<style scoped>
.schedule-section {
    padding: 60px 0;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
}

.empty-state {
    text-align: center;
    font-size: 18px;
    color: #64748b;
    padding: 40px;
}

.modality-card {
    background-color: var(--white);
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 40px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.modality-card h2 {
    font-size: 32px;
    color: var(--primary-navy);
    margin-bottom: 25px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}

.schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
}

.day-column {
    background-color: var(--light-gray);
    padding: 20px;
    border-radius: 12px;
}

.day-column h3 {
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--dark-gray);
    text-align: center;
    font-weight: 700;
}

.time-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}

.time-slot {
    display: inline-block;
    background-color: var(--accent-blue);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
}

.observation {
    margin-top: 20px;
    text-align: center;
    color: var(--medium-gray);
    font-style: italic;
    font-size: 14px;
}
</style>