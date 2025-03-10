<template>
    <transition name="fade" mode="out-in">
        <div v-if="isLoading" key="loader" class="loader-overlay">
            <p>VuExpensio</p>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true); // Variável de controle do loader

// Simula uma requisição assíncrona (Loader artificial)
onMounted(() => {
    setTimeout(() => {
        isLoading.value = false; // Dispara o fade out após 2 segundos
    }, 2000);
});
</script>

<style scoped>
.fade-enter-active {
    transition: none;
}

.fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
}

.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #41af80;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 999999;
}

.loader-bar {
    width: 200px;
    height: 10px;
    background-color: #f3f3f3;
    border-radius: 5px;
    overflow: hidden;
}

.loader-progress {
    width: 0;
    height: 100%;
    background-color: #6c5ce7;
    border-radius: 5px;
    animation: progress 2s linear forwards;
}

@keyframes progress {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

p {
    margin-top: 20px;
    font-size: 2.5rem;
    font-weight: bold;
    font-style: italic;
    background: linear-gradient(to right, #2bff00 0%, #2bff00 34%, #ffffff 33.33%, #ffffff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>