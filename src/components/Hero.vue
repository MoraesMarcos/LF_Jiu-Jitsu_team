<template>
    <section class="hero">
        <div class="container">
            <h1>Descubra a Disciplina do Jiu-Jitsu</h1>
            <p>Desenvolva autoconfiança, condicionamento físico e faça parte da nossa família. A primeira aula é por
                nossa conta.</p>
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
.hero {
    background-image: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.8)), url('@/assets/images/publico/4.jpg');
    background-size: cover;
    background-position: center;
    color: var(--white);
    padding: 160px 0;
    text-align: center;
}

.hero h1 {
    color: var(--white);
    font-size: 56px;
    text-transform: uppercase;
    letter-spacing: 1px;
    max-width: 800px;
    margin: 0 auto 20px;
}

.hero p {
    font-size: 20px;
    color: var(--off-white);
    margin: 0 auto 40px;
    max-width: 600px;
    font-weight: 400;
}

.hero .btn {
    padding: 18px 40px;
    font-size: 18px;
    text-transform: uppercase;
}

@media (max-width: 768px) {
    .hero {
        padding: 100px 0;
    }

    .hero h1 {
        font-size: 36px;
    }

    .hero p {
        font-size: 18px;
    }
}
</style>