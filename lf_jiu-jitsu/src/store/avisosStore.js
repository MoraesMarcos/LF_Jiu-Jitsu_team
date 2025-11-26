import { defineStore } from 'pinia'
import { get, push, removeAt, set } from '@/utils/storage'

const KEY = 'avisos'

export const useAvisosStore = defineStore('avisos', {
  state: () => ({ items: get(KEY, []) }),
  actions: {
    add ({ titulo, msg }) {
      this.items = push(KEY, { titulo, msg })
    },
    remove (index) {
      this.items = removeAt(KEY, index)
    },
    clear () {
      set(KEY, [])
      this.items = []
    }
  }
})
