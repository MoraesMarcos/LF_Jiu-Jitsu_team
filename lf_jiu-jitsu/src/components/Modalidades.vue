<template>
    <section class="modalities">
        <div class="container">
            <h2>Para Quem é o Jiu-Jitsu?</h2>
            <div class="modalities-grid">
                <div class="modality-item">
                    <div class="icon"></div>
                    <h3>Iniciantes</h3>
                    <p>Comece sua jornada com segurança e a melhor base técnica.</p>
                </div>
                <div class="modality-item">
                    <div class="icon"></div>
                    <h3>Mulheres</h3>
                    <p>Aulas focadas em defesa pessoal e bem-estar.</p>
                </div>
                <div class="modality-item">
                    <div class="icon"></div>
                    <h3>Crianças</h3>
                    <p>Disciplina e diversão para os pequenos guerreiros.</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
</script>

<style scoped>
.modalities {
    background-color: var(--light-gray);
}
.modalities-grid {
    display: flex;
    justify-content: space-around;
    text-align: center;
    gap: 40px;
}
.modality-item {
    max-width: 300px;
}
.modality-item .icon {
    width: 50px;
    height: 50px;
    background-color: #DBEAFE;
    border-radius: 8px;
    margin: 0 auto 20px;
}
.modality-item h3 {
    margin-bottom: 10px;
}
</style>