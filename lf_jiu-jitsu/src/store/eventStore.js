import { reactive } from 'vue'

export const eventStore = reactive({
    events: [
        {
            day: '15',
            month: 'DEZ',
            title: 'Seminário de Defesa Pessoal',
            info: 'Sábado às 09:00h • Aberto a todos os níveis.'
        },
        {
            day: '20',
            month: 'DEZ',
            title: 'Graduação de Final de Ano',
            info: 'Sexta às 19:00h • Uso obrigatório do kimono branco.'
        },
        {
            day: '12',
            month: 'JAN',
            title: 'Treino Aberto de Verão',
            info: 'Domingo às 10:00h • Praia de Tamandaré.'
        },
        {
            day: '05',
            month: 'FEV',
            title: 'Início da Turma de Competição',
            info: 'Segunda a Sexta • Foco no Campeonato Pernambucano.'
        }
    ],

    // Ação para adicionar novo evento
    addEvent(newEvent) {
        // 1. Adiciona no INÍCIO da lista (unshift) para ficar em primeiro lugar
        this.events.unshift(newEvent)

        // 2. Se tiver mais de 4, remove o ÚLTIMO (pop)
        if (this.events.length > 4) {
            this.events.pop()
        }
    }
})