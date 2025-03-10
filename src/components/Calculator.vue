<template>
  <div>
    <button @click="toggleCalculator" class="calculator-toggle-btn">
      <v-icon name="bi-calculator-fill" scale="1.5" />
    </button>

    <div class="calculator-widget" :class="{ expanded: isExpanded }">
      <div class="display">{{ currentInput || '0' }}</div>
      <div class="buttons">
        <button @click="clear">C</button>
        <button @click="appendOperator('/')">/</button>
        <button @click="appendOperator('*')">*</button>
        <button @click="removeLast">←</button>
        <button @click="appendNumber('7')">7</button>
        <button @click="appendNumber('8')">8</button>
        <button @click="appendNumber('9')">9</button>
        <button @click="appendOperator('-')">-</button>
        <button @click="appendNumber('4')">4</button>
        <button @click="appendNumber('5')">5</button>
        <button @click="appendNumber('6')">6</button>
        <button @click="appendOperator('+')">+</button>
        <button @click="appendNumber('1')">1</button>
        <button @click="appendNumber('2')">2</button>
        <button @click="appendNumber('3')">3</button>
        <button @click="appendNumber('.')">.</button>
        <button @click="calculate" class="equals">=</button>
        <button @click="appendNumber('0')" class="zero">0</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentInput = ref(''); // Armazena a entrada atual
const isExpanded = ref(false); // Controla se a calculadora está expandida ou não

// Adiciona um número ou ponto ao input
const appendNumber = (number) => {
  currentInput.value += number;
};

// Adiciona um operador ao input
const appendOperator = (operator) => {
  if (currentInput.value !== '') {
    currentInput.value += operator;
  }
};

// Remove o último caractere do input
const removeLast = () => {
  currentInput.value = currentInput.value.slice(0, -1);
};

// Limpa o input
const clear = () => {
  currentInput.value = '';
};

// Calcula o resultado
const calculate = () => {
  try {
    currentInput.value = eval(currentInput.value).toString();
  } catch (error) {
    currentInput.value = 'Error';
  }
};

// Alterna entre expandir e retrair a calculadora
const toggleCalculator = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.calculator-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 20px;
  background-color: #6c5ce7;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000; /* Z-index maior que o footer */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.calculator-toggle-btn:hover {
  background-color: #5a4acf;
}

.calculator-widget {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 90%; 
  max-width: 300px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
  z-index: 999;
}

.calculator-widget.expanded {
  transform: scale(1);
}

.display {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  font-size: 20px;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px; 
}

button {
  padding: 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #6c5ce7;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5a4acf;
}

.equals {
  grid-column: span 2;
  background-color: #2ecc71;
}

.equals:hover {
  background-color: #27ae60;
}

.zero {
  grid-column: span 2;
}

button:active {
  transform: scale(0.95);
}

@media (max-width: 999px) {
  .calculator-widget {
    width: 60%; 
    max-width: none; 
    padding: 10px;
  }

  .display {
    height: 40px; 
    font-size: 18px; 
  }

  .buttons {
    gap: 5px; 
  }

  button {
    padding: 10px; 
    font-size: 14px;
  }
}
</style>