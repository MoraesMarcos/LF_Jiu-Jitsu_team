<template>
  <section class="modalities">
    <div class="container">
      <h2>{{ titulo }}</h2>

      <div v-if="modalidades.length > 0" class="modalities-grid">
        <div v-for="item in modalidades" :key="item.id" class="modality-item">

          <div class="icon" :style="{ backgroundImage: `url(${icons[item.classe]})` }"></div>

          <h3>{{ item.nome }}</h3>
          <p>{{ item.descricao }}</p>
        </div>
      </div>

      <p v-else>Nenhuma modalidade cadastrada.</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import iconIniciante from '@/assets/images/publico/iniciante.png'
import iconMulher from '@/assets/images/publico/mulher.png'
import iconCrianca from '@/assets/images/publico/crianca.png'

const titulo = ref('Para Quem é o Jiu-Jitsu?')

const modalidades = ref([
  {
    id: 1,
    nome: 'Iniciantes',
    descricao: 'Comece sua jornada com segurança e a melhor base técnica.',
    classe: 'iniciante',
  },
  {
    id: 2,
    nome: 'Mulheres',
    descricao: 'Aulas focadas em defesa pessoal e bem-estar.',
    classe: 'mulher',
  },
  {
    id: 3,
    nome: 'Crianças',
    descricao: 'Disciplina e diversão para os pequenos guerreiros.',
    classe: 'crianca',
  },
])

const icons = {
  iniciante: iconIniciante,
  mulher: iconMulher,
  crianca: iconCrianca,
}
</script>

<style scoped>
.modalities {
  background-color: var(--light-gray);
  padding: 40px 0;
}

.modalities-grid {
  display: flex;
  justify-content: space-around;
  text-align: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.modality-item {
  max-width: 300px;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 10px;
  /* Adiciona transição suave para a animação */
  transition: transform 0.3s ease;
}

/* Efeito de elevação leve ao passar o mouse */
.modality-item:hover {
  transform: translateY(-5px);
}

.icon {
  width: 50px;
  height: 50px;
  background-color: #dbeafe;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin: 0 auto 20px;
}

.modality-item h3 {
  margin-bottom: 10px;
}
</style>