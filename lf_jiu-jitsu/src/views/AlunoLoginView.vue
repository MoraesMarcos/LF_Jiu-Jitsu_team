<template>
    <main class="login-shell">
        <div class="login-card">
            <div class="brand">
                <h2>Área do Aluno</h2>
                <p>LF Jiu-Jitsu Team</p>
            </div>

            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label>Usuário</label>
                    <input v-model="username" type="text" placeholder="Ex: lf.joaosilva" required>
                </div>

                <div class="input-group">
                    <label>Senha</label>
                    <input v-model="password" type="password" placeholder="••••••" required>
                    <div class="forgot-wrap">
                        <router-link to="/recuperar-senha" class="forgot-link">Esqueci minha senha</router-link>
                    </div>
                </div>

                <p v-if="error" class="error-msg">{{ error }}</p>

                <button type="submit" class="btn-primary">Entrar</button>
            </form>

            <router-link to="/" class="back-link">Voltar ao site</router-link>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { alunosStore } from '@/store/alunosStore'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
    if (alunosStore.login(username.value, password.value)) {
        router.push('/aluno')
    } else {
        error.value = 'Usuário ou senha incorretos.'
    }
}
</script>

<style scoped>
.login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #f8fafc;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 380px;
    text-align: center;
}

.brand h2 {
    color: var(--primary-navy);
    margin: 0;
}

.brand p {
    color: #64748b;
    margin: 5px 0 30px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 12px;
}

.input-group {
    text-align: left;
    margin-bottom: 16px;
}

.input-group label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 6px;
}

.input-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 15px;
    outline: none;
    transition: border 0.2s;
}

.input-group input:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Estilo do Link de Esqueci a Senha */
.forgot-wrap {
    text-align: right;
    margin-top: 6px;
}

.forgot-link {
    font-size: 12px;
    color: var(--accent-blue);
    text-decoration: none;
}

.forgot-link:hover {
    text-decoration: underline;
}

.btn-primary {
    width: 100%;
    padding: 14px;
    background: var(--primary-navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: #1e3a8a;
}

.error-msg {
    color: #ef4444;
    font-size: 13px;
    margin: 10px 0;
    background: #fee2e2;
    padding: 8px;
    border-radius: 6px;
}

.back-link {
    display: block;
    margin-top: 24px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 13px;
}

.back-link:hover {
    color: var(--accent-blue);
}
</style>