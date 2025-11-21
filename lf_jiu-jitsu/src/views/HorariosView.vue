<template>
    <main class="horarios-view">

        <PageHeader title="Horários de Aulas" subtitle="Encontre a turma perfeita para você ou para o seu filho." />

        <section class="schedule-section">
            <div class="container">
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
                    <p>* Estes são os horários disponíveis para aulas experimentais/iniciantes. Consulte a recepção para
                        horários de turmas avançadas.</p>
                </div>

            </div>
        </section>

        <CtaSection @openTrialModal="$emit('openTrialModal')" />

    </main>
</template>

<script setup>
import { ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import CtaSection from '@/components/CtaSection.vue';

defineEmits(['openTrialModal']);

const availableSlots = ref({
    Adulto: [
        { date: '2025-09-22', label: 'Segunda-feira', times: ['17:45', '19:30'] },
        { date: '2025-09-23', label: 'Terça-feira', times: ['18:00', '19:30'] },
        { date: '2025-09-24', label: 'Quarta-feira', times: ['07:00', '19:30'] },
        { date: '2025-09-25', label: 'Quinta-feira', times: ['18:00', '19:30'] },
        { date: '2025-09-26', label: 'Sexta-feira', times: ['07:00', '19:30'] }
    ],
    Kids: [
        { date: '2025-09-22', label: 'Segunda-feira', times: ['17:00'] },
        { date: '2025-09-24', label: 'Quarta-feira', times: ['17:00'] }
    ]
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

.modality-card {
    background-color: var(--white);
    border-radius: 16px;
    /* Ajustado para o novo design (borda arredondada) */
    padding: 40px;
    margin-bottom: 40px;
    /* Nova sombra suave */
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
}

.modality-card h2 {
    font-size: 32px;
    /* Atualizado: De primary-blue para primary-navy */
    color: var(--primary-navy);
    margin-bottom: 25px;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 10px;
}

.schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.day-column {
    background-color: var(--light-gray);
    padding: 20px;
    border-radius: 12px;
    /* Mais arredondado */
}

.day-column h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--dark-gray);
    text-align: center;
    font-weight: 700;
}

.time-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

.time-slot {
    display: inline-block;
    /* Atualizado: De primary-blue para accent-blue */
    background-color: var(--accent-blue);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    transition: transform 0.2s;
}

.time-slot:hover {
    transform: scale(1.05);
    background-color: var(--primary-navy);
}

.observation {
    margin-top: 20px;
    text-align: center;
    color: var(--medium-gray);
    font-style: italic;
    font-size: 14px;
}
</style>