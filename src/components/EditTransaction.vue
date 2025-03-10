<template>
  <div v-if="isVisible" class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <h3>{{ $t('editTransaction.title') }}</h3>
      <form id="form" @submit.prevent="onSubmit">
        <div class="form-control">
          <label for="text">{{ $t('addTransaction.name') }}</label>
          <input type="text" id="text" v-model="text" :placeholder="$t('addTransaction.name')" />
        </div>
        <div class="form-control">
          <label for="amount">{{ $t('addTransaction.amount') }}</label>
          <input type="text" id="amount" v-model="amount" :placeholder="$t('addTransaction.amount')"
            @input="validateAmount" :class="{ 'input-error': amountError }" />
          <small class="help-text">{{ $t('addTransaction.amountHelp') }}</small>
          <span v-if="amountError" class="error-message">{{ $t('addTransaction.errorMessage') }}</span>
        </div>
        <div class="form-control">
          <label for="date">{{ $t('addTransaction.date') }}</label>
          <input type="date" id="date" v-model="date" />
        </div>
        <button class="btn">{{ $t('editTransaction.updateButton') }}</button>
        <button type="button" class="btn btn-close" @click="close">
          {{ $t('editTransaction.closeButton') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n'; // Importe o useI18n

const toast = useToast();
const { t } = useI18n(); // Use o useI18n para acessar as traduções

// Define as propriedades
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['transactionUpdated', 'close']);

// Define os dados reativos
const text = ref(props.transaction.text);
const amount = ref(props.transaction.amount);
const date = ref(props.transaction.date.split('T')[0]); // Formato YYYY-MM-DD
const amountError = ref(false); // Estado para controlar se há erro
const errorMessage = ref(''); // Mensagem de erro

// Observa a propriedade "transaction" e atualiza os campos do formulário
watch(
  () => props.transaction,
  (newTransaction) => {
    if (newTransaction) {
      text.value = newTransaction.text;
      amount.value = newTransaction.amount;
      date.value = newTransaction.date.split('T')[0]; // Atualiza a data
    }
  },
  { immediate: true }
);

// Função para validar o campo "amount"
const validateAmount = (event) => {
  const input = event.target.value;
  // Remove todos os caracteres que não são números, ponto decimal ou sinal de negativo
  const sanitizedValue = input.replace(/[^0-9.-]/g, '');

  // Verifica se o valor contém caracteres inválidos
  if (input !== sanitizedValue) {
    amountError.value = true;
    errorMessage.value = t('addTransaction.errorMessage'); // Usa a tradução para a mensagem de erro
  } else {
    amountError.value = false;
    errorMessage.value = '';
  }

  // Atualiza o valor do campo
  amount.value = sanitizedValue;
};

// Função para enviar o formulário
const onSubmit = () => {
  if (!text.value || !amount.value || !date.value) {
    toast.error(t('addTransaction.errorMessage')); // Usa a tradução para a mensagem de erro
    return;
  }

  // Cria a data em UTC, sem considerar o fuso horário local
  const utcDate = new Date(date.value + 'T12:00:00Z'); // Força a data como UTC

  // Atualiza a transação
  const updatedTransaction = {
    id: props.transaction.id,
    text: text.value,
    amount: parseFloat(amount.value),
    date: utcDate.toISOString(), // Converte para o formato ISO
  };

  emit('transactionUpdated', updatedTransaction);
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 95%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-text {
  display: block;
  margin-top: 5px;
  font-size: 0.875rem;
  color: #666;
}

/* Botão de fechar */
.btn-close {
  background-color: #ff7675;
  margin-left: 10px;
}

.form-control {
  margin-bottom: 15px;
}

.form-control label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.input-error {
  border-color: #ff7675 !important;
}

.error-message {
  color: #ff7675;
  font-size: 0.875rem;
  margin-top: 5px;
}
</style>