<template>
  <button @click="openModal" class="add-transaction-btn">
    <v-icon name="md-add-outlined" scale="1.25" /> {{ $t('addTransaction.addButton') }}
  </button>

  <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h3>{{ $t('addTransaction.title') }}</h3>
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
        <button class="btn">{{ $t('addTransaction.addButton') }}</button>
        <button type="button" class="btn btn-close" @click="closeModal">
          {{ $t('addTransaction.closeButton') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n(); // Usando useI18n para acessar as traduções
const text = ref('');
const amount = ref('');
const date = ref(new Date().toLocaleDateString('en-CA')); // Data atual no formato YYYY-MM-DD
const isModalVisible = ref(false);
const amountError = ref(false); // Estado para controlar se há erro
const errorMessage = ref(''); // Mensagem de erro

const emit = defineEmits(['transactionSubmitted', 'modalOpened']);

// Função para abrir o modal
const openModal = () => {
  isModalVisible.value = true;
  date.value = new Date().toLocaleDateString('en-CA');
  emit('modalOpened'); // Emitir o evento quando o modal for aberto
};

// Função para fechar o modal
const closeModal = () => {
  isModalVisible.value = false;
  text.value = '';
  amount.value = '';
  amountError.value = false; // Reseta o estado de erro ao fechar o modal
};

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

// Função para enviar a transação
const onSubmit = () => {
  if (!text.value || !amount.value || !date.value) {
    toast.error(t('addTransaction.errorMessage')); // Usa a tradução para a mensagem de erro
    return;
  }

  // Cria a data em UTC, sem considerar o fuso horário local
  const utcDate = new Date(date.value + 'T12:00:00Z'); // Força a data como UTC

  //  Cria o objeto
  const transactionData = {
    text: text.value,
    amount: parseFloat(amount.value),
    date: utcDate.toISOString(), // Converte para o formato ISO
  };

  emit('transactionSubmitted', transactionData);
  closeModal();
};
</script>

<style scoped>
.add-transaction-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #24a724;
  border: none;
  color: #fff;
  border-radius: 6%;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-transaction-btn:hover {
  background-color: #00ff00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fundo escuro semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 99%;
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

.help-text {
  display: block;
  margin-top: 5px;
  font-size: 0.875rem;
  color: #666;
}

.btn {
  background-color: #6c5ce7;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn:hover {
  background-color: #5a4acf;
}

.btn-close {
  background-color: #ff7675;
}

.btn-close:hover {
  background-color: #e74c3c;
}
</style>