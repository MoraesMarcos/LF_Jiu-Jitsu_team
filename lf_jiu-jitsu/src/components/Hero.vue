<template>
    <section class="hero">
        <div class="container">
            <h1>Descubra a Disciplina do Jiu-Jitsu</h1>
            <p>Desenvolva autoconfiança, condicionamento físico e faça parte da nossa família. A primeira aula é por nossa conta.</p>
            <button @click="$emit('openTrialModal')" class="btn btn-primary">
                Agende sua Aula Experimental Grátis
            </button>
        </div>
    </section>
</template>

<script setup>
defineEmits(['openTrialModal']);
</script>

<style scoped>

.hero { background-color: var(--dark-gray); color: var(--white); padding: 120px 0; text-align: center; }
.hero h1 { color: var(--white); }
.hero p { font-size: 20px; color: #D1D5DB; margin: 20px auto 40px; max-width: 600px; }
.hero .btn { padding: 18px 36px; font-size: 18px; }
</style>