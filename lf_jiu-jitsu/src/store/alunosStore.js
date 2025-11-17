import { defineStore } from 'pinia'
import { get, set } from '@/utils/storage'


const KEY = 'alunos'


export const useAlunosStore = defineStore('alunos', {
state: () => ({
list: get(KEY, [
{ nome: 'João Silva', faixa: 'Branca', plano: 'Mensal', status: 'Em dia', vencimento: '10/11/2025' },
{ nome: 'Ana Souza', faixa: 'Amarela', plano: 'Mensal', status: 'Pendente', vencimento: '05/11/2025' },
{ nome: 'Carlos Lima', faixa: 'Cinza (Kids)', plano: 'Kids', status: 'Em dia', vencimento: '12/11/2025' }
])
}),
actions: {
add(aluno) {
this.list.unshift(aluno)
set(KEY, this.list)
},
update(index, aluno) {
this.list[index] = aluno
set(KEY, this.list)
},
remove(index) {
this.list.splice(index, 1)
set(KEY, this.list)
}
}
})