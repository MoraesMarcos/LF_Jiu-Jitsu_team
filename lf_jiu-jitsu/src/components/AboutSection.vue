<template>
    <section class="about">
        <div class="container">
            <div class="about-image"></div>
            <div class="about-content">
                <h2>Nossa Casa, Sua Família</h2>
                <p>Acreditamos que o Jiu-Jitsu vai além do tatame. Construímos um ambiente de respeito mútuo, onde cada aluno é parte fundamental da nossa equipe. Venha fazer parte.</p>
                <a href="#" class="btn btn-secondary">Conheça Nossa História</a>
            </div>
        </div>
    </section>
</template>

<script setup>
</script>

<style scoped>
.about .container {
    display: flex;
    align-items: center;
    gap: 80px;
}
.about .about-image {
    flex: 1;
    height: 400px;
    background-color: var(--border-color);
    border-radius: 12px;
}
.about .about-content {
    flex: 1;
}
.about .about-content h2 {
    text-align: left;
    margin-bottom: 20px;
}
.about .about-content p {
    margin-bottom: 30px;
}
</style>