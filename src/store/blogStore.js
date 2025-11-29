import { reactive } from 'vue'

import img1 from '@/assets/images/publico/1.jpg'
import img2 from '@/assets/images/publico/2.jpg'
import img3 from '@/assets/images/publico/3.jpg'

const KEY = 'lf_blog_v1'

const defaultPosts = [
  {
    id: 1,
    title: 'Sul-Americano Kids',
    excerpt: 'Medalha de ouro conquistada!',
    image: img1
  },
  {
    id: 2,
    title: 'Equipe Campeã',
    excerpt: 'Muitas medalhas no estadual.',
    image: img2
  },
  {
    id: 3,
    title: 'Brasileiro Sem Kimono',
    excerpt: 'Resultados expressivos.',
    image: img3
  }
]

const stored = localStorage.getItem(KEY)
const initialData = stored ? JSON.parse(stored) : defaultPosts

export const blogStore = reactive({
  posts: initialData,

  save () {
    localStorage.setItem(KEY, JSON.stringify(this.posts))
  },

  addBlogPost (post) {
    const newPost = { ...post, id: Date.now() }
    this.posts.unshift(newPost)
    this.save()
  },

  removeBlogPost (id) {
    const index = this.posts.findIndex(p => p.id === id)
    if (index !== -1) {
      this.posts.splice(index, 1)
      this.save()
    }
  },

  updateBlogPost (updatedPost) {
    const index = this.posts.findIndex(p => p.id === updatedPost.id)
    if (index !== -1) {
      this.posts[index] = updatedPost
      this.save()
    }
  }
})
