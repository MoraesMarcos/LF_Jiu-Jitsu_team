import { reactive } from 'vue'

import img1 from '@/assets/images/publico/1.jpg'
import img2 from '@/assets/images/publico/2.jpg'
import img3 from '@/assets/images/publico/3.jpg'

export const articleStore = reactive({
  latestArticles: [
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
  ],

  addArticle(newArticle) {
    if (this.latestArticles.length >= 4) {
      this.latestArticles.shift()
    }
    this.latestArticles.push(newArticle)
  }
})