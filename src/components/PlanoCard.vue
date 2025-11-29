<template>
  <div class="plan-card" :class="{ featured: plan.featured }">
    <div v-if="plan.featured" class="featured-badge">RECOMENDADO</div>
    <h3>{{ plan.name }}</h3>
    <div class="price-container">
      <span class="price">{{ plan.price }}</span>
      <span class="period">/{{ plan.period }}</span>
    </div>
    <ul class="features-list">
      <li v-for="feature in plan.features" :key="feature">
        ✓ {{ feature }}
      </li>
    </ul>

    <router-link v-if="action === 'link'" to="/planos" class="cta-button">
      Quero este plano
    </router-link>

    <button v-else class="cta-button" @click="$emit('select-plan', plan)">
      Quero este plano
    </button>
  </div>
</template>

<script setup>
defineProps({
  plan: {
    type: Object,
    required: true
  },
  action: {
    type: String,
    default: 'link'
  }
});

defineEmits(['select-plan']);
</script>

<style scoped>
.plan-card {
  border-radius: 16px;
  padding: 40px 30px;
  width: 320px;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  text-align: left;
  position: relative;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  transition: transform 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card.featured {
  border: 2px solid var(--accent-blue);
  transform: scale(1.05);
  z-index: 10;
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.1);
}

.plan-card.featured:hover {
  transform: scale(1.05) translateY(-5px);
}

.featured-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-blue);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.plan-card h3 {
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
  color: var(--primary-navy);
}

.price-container {
  text-align: center;
  margin-bottom: 30px;
}

.price {
  font-size: 42px;
  font-weight: 800;
  color: var(--primary-navy);
}

.period {
  font-size: 16px;
  color: var(--medium-gray);
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 35px;
  flex-grow: 1;
}

.features-list li {
  margin-bottom: 14px;
  color: var(--medium-gray);
  font-weight: 500;
}

.cta-button {
  display: block;
  text-align: center;
  text-decoration: none;
  width: 100%;
  padding: 14px;
  border: 2px solid var(--accent-blue);
  background-color: transparent;
  color: var(--accent-blue);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  font-family: var(--font-family-sans);
}

.featured .cta-button {
  background-color: var(--accent-blue);
  color: var(--white);
}

.cta-button:hover {
  background-color: var(--primary-navy);
  border-color: var(--primary-navy);
  color: var(--white);
}
</style>