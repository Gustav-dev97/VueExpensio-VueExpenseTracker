<template>
    <div v-if="showBanner" class="consent-banner">
        <p>{{ $t('consent.message') }}</p>
        <button @click="acceptConsent" class="btn">{{ $t('consent.acceptButton') }}</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const showBanner = ref(false);

// Verifica se o usuário já consentiu ao carregar o componente
onMounted(() => {
    checkConsent();
});

// Função para verificar o consentimento
const checkConsent = () => {
    const hasConsented = localStorage.getItem('hasConsented');
    showBanner.value = !hasConsented;
};

// Função para aceitar o consentimento
const acceptConsent = () => {
    localStorage.setItem('hasConsented', 'true');
    showBanner.value = false;
};

// Função para reiniciar o banner se o usuário apagar todos os dados (pode ser chamada de fora do componente)
const resetConsent = () => {
    localStorage.removeItem('hasConsented');
    checkConsent(); // Verifica novamente o consentimento se o usuário apagar todos os dados
};

// Expõe a função resetConsent para ser usada em outros componentes
defineExpose({ resetConsent });
</script>

<style scoped>
.consent-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #35495e;
    color: #fff;
    padding: .5rem;
    text-align: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 99999;
}

.consent-banner p {
    margin: 0 0 .5rem 0;
}

.consent-banner .btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem .5rem;
    cursor: pointer;
    border-radius: 5px;
}

.consent-banner .btn:hover {
    background-color: #0056b3;
}
</style>