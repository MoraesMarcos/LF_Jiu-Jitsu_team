import { reactive, computed } from 'vue'

import instrutorPrincipal from '@/assets/images/instrutores/instrutor_principal.png'
import instrutorAdulto from '@/assets/images/instrutores/instrutor_adulto.jpg'
import instrutoraFemininoKids from '@/assets/images/instrutores/instrutor_kids_feminino.png'
import instrutorAuxiliar from '@/assets/images/instrutores/instrutor_auxiliar.jpg'

function calculateAge (birthday) {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const store = reactive({
  instructors: [
    {
      slug: 'instrutor-principal',
      name: 'Instrutor Principal',
      rank: 'Faixa Preta',
      image: instrutorPrincipal,
      dataNascimento: '1990-01-20',
      tempoJiuJitsu: '15 anos',
      instagram: '@instrutorprincipal',
      bio: 'Líder da equipe, com 20 anos de experiência e formação de campeões.'
    },
    {
      slug: 'instrutor-adultos',
      name: 'Instrutor Adultos',
      rank: 'Faixa Roxa',
      image: instrutorAdulto,
      dataNascimento: '1995-05-10',
      tempoJiuJitsu: '8 anos',
      instagram: '@instrutoradultos',
      bio: 'Especialista em preparação física e Jiu-Jitsu No-Gi.'
    },
    {
      slug: 'instrutora-feminino-kids',
      name: 'Instrutora Feminino/Kids',
      rank: 'Faixa Roxa',
      image: instrutoraFemininoKids,
      dataNascimento: '1998-11-30',
      tempoJiuJitsu: '6 anos',
      instagram: '@instrutorafeminino',
      bio: 'Focada em defesa pessoal feminina e desenvolvimento infantil.'
    },
    {
      slug: 'auxiliar-tecnico',
      name: 'Auxiliar Técnico',
      rank: 'Faixa Azul',
      image: instrutorAuxiliar,
      dataNascimento: '2002-07-15',
      tempoJiuJitsu: '4 anos',
      instagram: '@auxiliartecnico',
      bio: 'Auxilia nas turmas de iniciantes, garantindo a base técnica correta.'
    }
  ],

  getInstructorBySlug (slug) {
    const instructor = this.instructors.find(inst => inst.slug === slug)
    if (!instructor) return null

    return computed(() => ({
      ...instructor,
      idade: calculateAge(instructor.dataNascimento)
    })).value
  }
})

export const instructorStore = store
