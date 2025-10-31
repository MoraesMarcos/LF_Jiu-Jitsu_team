<template>
  <main>
    <PageHeader 
      title="Fale Conosco" 
      subtitle="Tire suas dúvidas e agende uma visita." 
    />
    
    <section class="contact-section">
      <div class="container">
        <div class="contact-info">
          
          <div class="info-card">
            <h3>📍 Endereço</h3>
            <p>Rua da Cohab, 123</p>
            <p>Catende, PE</p>
            <a 
              href="https://maps.app.goo.gl/..." 
              target="_blank" 
              class="link-map"
            >
              Ver no Google Maps
            </a>
          </div>

          <div class="info-card">
            <h3>📞 Contato</h3>
            <p><strong>WhatsApp:</strong> (81) 99999-0000</p>
            <p><strong>Telefone Fixo:</strong> (81) 3673-1234</p>
            <p><strong>Email:</strong> contato@lfjiujitsu.com</p>
          </div>

          <div class="info-card">
            <h3>⏰ Horários de Atendimento</h3>
            <p>Segunda a Sexta: 07:00h às 21:00h</p>
            <p>Sábados: 08:00h às 12:00h</p>
          </div>
        </div>

        <div class="contact-form-wrap">
            <h2>Envie uma Mensagem Rápida</h2>
            <form @submit.prevent="submitForm" class="contact-form">
                <input type="text" placeholder="Seu Nome Completo" required>
                <input type="email" placeholder="Seu E-mail" required>
                <textarea rows="4" placeholder="Sua Mensagem..." required></textarea>
                <button type="submit" class="btn btn-primary">Enviar Mensagem</button>
                <p v-if="success" class="success-msg">✅ Mensagem enviada com sucesso! Em breve retornaremos.</p>
            </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';

const success = ref(false);

const submitForm = () => {
    
    console.log('Formulário de contato enviado!');
    success.value = true;
    setTimeout(() => success.value = false, 3000);
}
</script>

<style scoped>
.contact-section {
    padding: 60px 0 90px;
}
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.info-card {
    background-color: var(--light-gray);
    padding: 25px;
    border-radius: 12px;
}
.info-card h3 {
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--primary-blue);
}
.info-card p {
    margin: 5px 0;
    color: var(--text-dark);
}
.link-map {
    display: block;
    margin-top: 10px;
    font-weight: 600;
    color: var(--primary-blue);
}
.contact-form-wrap h2 {
    font-size: 24px;
    margin-bottom: 20px;
}
.contact-form input, .contact-form textarea {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
}
.contact-form textarea {
    resize: vertical;
}
.contact-form .btn-primary {
    width: 100%;
    padding: 14px;
}
.success-msg {
    color: green;
    font-weight: bold;
    margin-top: 15px;
}

@media (max-width: 800px) {
    .container {
        grid-template-columns: 1fr;
    }
}
</style>