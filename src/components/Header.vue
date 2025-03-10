<template>
  <header class="header">
    <h2 @click="scrollToTop">{{ $t('header.title') }}</h2>
    <div class="language-dropdown">
      <button class="language-button" @click="toggleDropdown">
        {{ selectedLanguage }}
      </button>
      <ul v-if="isDropdownOpen" class="dropdown-menu">
        <li @click="changeLanguage('pt-BR')">PT-BR</li>
        <li @click="changeLanguage('en')">ENG</li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n(); // Obter o idioma atual
const isDropdownOpen = ref(false); // Estado para controlar a abertura do dropdown

// Idioma selecionado
const selectedLanguage = computed(() => (locale.value === 'pt-BR' ? 'PT-BR' : 'ENG'));

// Alternar o dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Mudar o idioma
const changeLanguage = (lang) => {
  locale.value = lang;
  isDropdownOpen.value = false; // Fechar o dropdown após selecionar um idioma
};

// Função para rolar até o topo da página ao clicar no título
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 1px;
  background: linear-gradient(18deg, #42b983, #35495e);
  color: #fff;
}

.header h2 {
  cursor: pointer;
  background: linear-gradient(to right, #2bff00 0%, #2bff00 33.33%, #ffffff 33.33%, #ffffff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.language-dropdown {
  position: relative;
  font-size: clamp(10px, 1vw, 50px);
  margin-right: 4%;
}

.language-button {
  width: 100%;
  background-color: transparent;
  font-size: clamp(10px, 1vw, 50px);
  border: none;
  color: #fff;
  border: 1px solid #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 10px 20px;
  cursor: pointer;
  color: #333;
}

.dropdown-menu li:hover {
  background-color: #f1f1f1;
}
</style>