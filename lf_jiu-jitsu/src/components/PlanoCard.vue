<template>
    <article class="plan-card" :class="{ featured: plan.featured }">
        <div v-if="plan.featured" class="featured-tag">MAIS POPULAR</div>
        <h3 class="name">{{ plan.name }}</h3>
        <div class="price">
            {{ plan.price }}<span>/{{ plan.period }}</span>
        </div>
        <ul class="features-list"> 
            <li v-for="feature in plan.features" :key="feature">✓ {{ feature }}</li>
        </ul>
        
        <RouterLink to="/planos" class="btn" :class="plan.featured ? 'btn-primary' : 'btn-secondary'">
            Quero este plano
        </RouterLink>
    </article>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
    plan: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.plan-card {
    background-color: var(--white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 40px;
    width: 320px;
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.plan-card.featured {
    border: 2px solid var(--primary-blue);
    padding-top: 50px;
    padding-bottom: 50px;
    position: relative;
}

.featured-tag {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-blue);
    color: var(--white);
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
}

.plan-card .name {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
}

.plan-card .price {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 30px;
}

.plan-card .price span {
    font-size: 16px;
    color: var(--text-light);
    font-weight: normal;
}

.features-list {
    list-style: none;
    text-align: left;
    margin-bottom: 40px;
    padding-left: 10px;
    flex-grow: 1; 
}

.features-list li {
    margin-bottom: 12px;
}

.btn {
    width: 100%; 
}
</style>
