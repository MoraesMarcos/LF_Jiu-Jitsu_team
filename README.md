# 🥋 LF Jiu-Jitsu

Este projeto é uma aplicação web completa voltada para academias de artes marciais. Ele integra um site institucional para captação de alunos, um sistema de agendamento (check-in) para membros e um painel administrativo para gestão de conteúdo e dados.

---

## 📌 Introdução
O projeto foi desenvolvido utilizando **Vue.js 3** com a **Composition API**, focando em uma experiência de usuário fluida (SPA) e uma arquitetura organizada que separa a lógica de negócio (Rules/Stores) da interface (Views/Components). O sistema utiliza persistência local para simular o comportamento de um banco de dados.

## 🎯 Objetivo do Site
O objetivo principal é digitalizar a jornada do aluno e do mestre:
* **Para o Aluno:** Facilitar a reserva de treinos de acordo com seu perfil, consulta de horários e gestão de dados pessoais.
* **Para o Mestre/Admin:** Centralizar o controle de presença, publicação de eventos, notícias no blog e gestão da grade de horários de forma dinâmica, sem necessidade de alterar o código-fonte.

## 🚀 Para que serve
O sistema resolve os seguintes fluxos:
1.  **Institucional:** Apresentação da academia, história, currículo dos instrutores e modalidades.
2.  **Agendamento:** Sistema de check-in em tempo real com regras de capacidade e perfil (Adulto/Kids/Feminino).
3.  **Engajamento:** Blog de notícias e mural de eventos/seminários.
4.  **Gestão Administrativa:** Painel completo para CRUD (Criação, Leitura, Atualização e Deleção) de quase todos os dados do site.

---

## 📂 Estrutura de Pastas
Abaixo, a organização do diretório `src/` e a responsabilidade de cada pasta:

* **`assets/`**: Arquivos estáticos como imagens, logotipos e estilos globais (CSS).
* **`components/`**: Componentes reutilizáveis (Cards de instrutores, modais de agendamento, formulários de inscrição).
* **`composables/`**: Funções que encapsulam lógica reativa reutilizável, como a gestão de agendamentos e datas.
* **`router/`**: Configuração de todas as rotas do site e proteção de acesso (Guards) para áreas restritas.
* **`rules/`**: Lógica de negócio isolada (validações de check-in, regras de datas, validações de login e perfil).
* **`store/`**: Gerenciamento de estado global (dados de alunos, blog, check-ins, eventos e instrutores).
* **`utils/`**: Funções auxiliares genéricas para manipulação de `localStorage`, validadores e formatadores de data/hora.
* **`views/`**: Páginas principais da aplicação, divididas entre áreas públicas, área do aluno e painel administrativo.

---

## 🛠️ Como Baixar e Acessar

### Pré-requisitos
* **Node.js** (Versão 16 ou superior)
* Gerenciador de pacotes **npm** ou **yarn**

### Instalação
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/lf-jiujitsu.git](https://github.com/seu-usuario/lf-jiujitsu.git)
    ```
2.  **Acesse a pasta do projeto:**
    ```bash
    cd lf-jiujitsu
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Execução
1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
2.  **Acesse no navegador:**
    Abra o endereço indicado no terminal (geralmente `http://localhost:5173`).

---

## 🔐 Informações de Acesso (Simulação)
Como o sistema utiliza dados simulados para fins de demonstração, utilize as credenciais abaixo:

* **Área do Aluno:**
    * **Usuário:** `lf.aluno` (ou qualquer usuário iniciado com `lf.`)
    * **Senha:** `123`
* **Painel Administrativo:**
    * **Email:** `admin@lf.com`
    * **Senha:** `admin123`

---
