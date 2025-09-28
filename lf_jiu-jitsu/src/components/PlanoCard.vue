<template>
  <div class="plan-card" :class="{ featured: plan.featured }">
    <div v-if="plan.featured" class="featured-badge">MAIS POPULAR</div>
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

    <router-link
      v-if="action === 'link'"
      to="/planos"
      class="cta-button"
    >
      Quero este plano
    </router-link>

    <button
      v-else
      class="cta-button"
      @click="$emit('select-plan', plan)"
    >
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
    default: 'link' // Comportamento padrão: ser um link
  }
});

defineEmits(['select-plan']);
</script>

<style scoped>
.plan-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 30px;
  width: 320px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  text-align: left;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.plan-card.featured {
  border: 2px solid #3b82f6;
  transform: scale(1.05);
  z-index: 10;
}
.featured-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3b82f6;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}
.plan-card h3 {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: #1e293b;
}
.price-container {
  text-align: center;
  margin-bottom: 25px;
}
.price {
  font-size: 36px;
  font-weight: bold;
  color: #1e293b;
}
.period {
  font-size: 16px;
  color: #64748b;
}
.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
  flex-grow: 1;
}
.features-list li {
  margin-bottom: 12px;
  color: #475569;
}
.cta-button {
  display: block;
  text-align: center;
  text-decoration: none;
  width: 100%;
  padding: 12px;
  border: 1px solid #3b82f6;
  background-color: #fff;
  color: #3b82f6;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}
.featured .cta-button {
  background-color: #3b82f6;
  color: #fff;
}
.cta-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>