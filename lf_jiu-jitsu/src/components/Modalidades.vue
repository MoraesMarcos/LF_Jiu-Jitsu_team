<template>
  <section class="modalities">
    <div class="container">
      <h2>{{ titulo }}</h2>

      <div v-if="modalidades.length > 0" class="modalities-grid">
        <div 
          v-for="item in modalidades" 
          :key="item.id" 
          class="modality-item"
          @click="selecionar(item.nome)"
        >
          <div class="icon" :class="item.classe"></div>
          
          <h3>{{ item.nome }}</h3>
          <p>{{ item.descricao }}</p>

          </div>
      </div>

      <p v-else>Nenhuma modalidade cadastrada.</p>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const titulo = ref('Para Quem é o Jiu-Jitsu?')

// Lista de modalidades sem a propriedade 'destaque'
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
  }
])

const selecionar = (nome) => {
  alert(`Você selecionou ${nome}!`)
}

onMounted(() => {
  console.log('Componente carregado com sucesso.')
})
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
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid transparent; /* Adicionado para evitar que o layout mude no hover */
  border-radius: 10px;
  padding: 10px;
}

.modality-item:hover {
  transform: scale(1.05);
  border-color: #ccc; /* Exemplo de um destaque sutil no hover */
}

.modality-item .icon {
  width: 50px;
  height: 50px;
  background-color: #DBEAFE;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin: 0 auto 20px;
}

/* Supondo que o alias '@lf_jiu-jitsu' está configurado no seu projeto */
.modality-item .icon.iniciante {
  background-image: url('@lf_jiu-jitsu/src/assets/images/publico/iniciante.png');
}
.modality-item .icon.mulher {
  background-image: url('@lf_jiu-jitsu/src/assets/images/publico/mulher.png');
}
.modality-item .icon.crianca {
  background-image: url('@lf_jiu-jitsu/src/assets/images/publico/crianca.png');
}

.modality-item h3 {
  margin-bottom: 10px;
}

/* As classes .destaque e .msg-destaque foram removidas daqui */
</style>