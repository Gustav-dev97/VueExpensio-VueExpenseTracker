<template>
  <h3 class="transactions-title">{{ $t('transactionList.title') }}</h3>
  <ul id="list" class="list">
    <li v-for="transaction in transactions" :key="transaction.id" :class="transaction.amount < 0 ? 'minus' : 'plus'">
      <span class="text">{{ transaction.text }}</span>
      <div class="center-content">
        <span :class="getAmountClass(transaction.amount)" class="amount">${{ transaction.amount }}</span>
        <small class="date">{{ formatDate(transaction.date) }}</small>
      </div>
      <div class="actions">
        <button @click="editTransaction(transaction)" class="edit-btn">
          <v-icon name="md-modeeditoutline-outlined" scale="1" />
        </button>
        <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n'; 

const { t, locale } = useI18n(); // useI18n para acessar as traduções e o idioma atual

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

// Definir os eventos para emitir
const emit = defineEmits(['transactionDeleted', 'transactionEdited', 'editButtonClicked']);

// Função para deletar uma transação
const deleteTransaction = (id) => {
  emit('transactionDeleted', id);
};

// Função para editar uma transação
const editTransaction = (transaction) => {
  emit('editButtonClicked'); // Emitir o novo evento quando o botão de edição for clicado
  emit('transactionEdited', transaction); // Emitir o evento de edição com a transação
};

// Função para formatar a data com base no idioma selecionado
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString(locale.value, options); // Usa o idioma atual
};

// Função para determinar a classe do valor
const getAmountClass = (amount) => {
  if (amount < 0) return 'negative';
  if (amount === 0) return 'zero';
  return 'positive';
};
</script>

<style scoped>
.transactions-title {
  margin-top: 2%;
  margin-bottom: 1%;
  color: #fff;
}

.list {
  list-style-type: none;
  padding: 0;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list li.plus {
  border-left: 5px solid #2ecc71;
}

.list li.minus {
  border-left: 5px solid #c0392b;
}

.text {
  flex: 1;
  margin-right: 20px;
}

.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40%;
  flex: 10;
}

.amount {
  font-weight: bold;
}

.negative {
  color: #c0392b;
}

.zero {
  color: #000;
}

.positive {
  color: #2ecc71;
}

.date {
  font-size: 0.875rem;
  color: #666;
  margin-left: 20px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.delete-btn {
  background-color: #e74c3c;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.edit-btn {
  background-color: #3498db;
  border: none;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

@media (max-width: 800px) {
  .list li {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .text {
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 1rem;
  }

  .center-content {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .amount {
    font-size: 1rem;
  }

  .date {
    font-size: 0.875rem;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>