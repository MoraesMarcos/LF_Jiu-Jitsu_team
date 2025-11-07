import { reactive } from 'vue'

import img1 from '@/assets/images/publico/1.jpg'
import img2 from '@/assets/images/publico/2.jpg'
import img3 from '@/assets/images/publico/3.jpg'
import img4 from '@/assets/images/publico/4.jpg'

export const blogStore = reactive({
  posts: [
    {
      title: 'Sul-Americano de Jiu-Jitsu Kids 2025',
      excerpt: 'Jovem atleta conquista medalha de ouro no campeonato Sul-Americano Kids da IBJJF.',
      image: img1,
    },
    {
      title: 'Equipe de Campeões',
      excerpt: 'Equipe celebra as inúmeras medalhas conquistadas em competições nacionais e internacionais.',
      image: img2,
    },
    {
      title: 'Brasileiro de Jiu-Jitsu Kids 2025',
      excerpt: 'Jovens talentos brilham no pódio do campeonato brasileiro sem kimono.',
      image: img3,
    },
    {
      title: 'Nossa Casa, Sua Família',
      excerpt: 'Conheça a história e os valores da nossa equipe.',
      image: img4,
    },
    {
      title: 'Post Antigo 1',
      excerpt: 'Este é um post mais antigo para testes.',
      image: img1,
    },
    {
      title: 'Post Antigo 2',
      excerpt: 'Este é um post mais antigo para testes.',
      image: img2,
    },
    {
      title: 'Post Antigo 3',
      excerpt: 'Este é um post mais antigo para testes.',
      image: img3,
    },
    {
      title: 'Post Antigo 4',
      excerpt: 'Este é um post mais antigo para testes.',
      image: img4,
    }
  ],

  addBlogPost(newPost) {

    this.posts.unshift(newPost)
  },

  removeBlogPost(index) {
    this.posts.splice(index, 1)
  }
})