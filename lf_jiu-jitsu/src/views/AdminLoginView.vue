<template>
    <main class="login-shell">
        <div class="login-card">
            <h1>Acesso Administrativo</h1>
            <p class="muted">Área restrita para instrutores e gestão.</p>

            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label>E-mail</label>
                    <input v-model="email" type="email" placeholder="admin@lf.com" required>
                </div>

                <div class="input-group">
                    <label>Senha</label>
                    <input v-model="password" type="password" placeholder="admin123" required>
                </div>

                <p v-if="error" class="error-msg">{{ error }}</p>

                <button type="submit" class="btn-primary">Entrar no Painel</button>
            </form>

            <router-link to="/" class="back-link">Voltar ao site</router-link>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/store/authStore'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
    if (authStore.login(email.value, password.value)) {
        router.push('/admin')
    } else {
        error.value = 'Credenciais inválidas.'
    }
}
</script>

<style scoped>
.login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background-color: #f1f5f9;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h1 {
    font-size: 24px;
    color: #0f172a;
    margin-bottom: 5px;
}

.muted {
    color: #64748b;
    margin-bottom: 30px;
    font-size: 14px;
}

.input-group {
    text-align: left;
    margin-bottom: 15px;
}

.input-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 14px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background: #1d4ed8;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
}

.btn-primary:hover {
    background: #1e40af;
}

.error-msg {
    color: #ef4444;
    margin: 10px 0;
    font-size: 14px;
}

.back-link {
    display: block;
    margin-top: 20px;
    color: #64748b;
    text-decoration: none;
    font-size: 14px;
}
</style>