<template>
  <div class="filters" v-if="isVisible">
    <select v-model="sortBy">
      <option value="date">{{ $t('filters.sortByDate') }}</option>
      <option value="amount">{{ $t('filters.sortByAmount') }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'; // Importe o useI18n

const { t } = useI18n(); // Acessar as traduções

// Props para receber as transações e a visibilidade
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:filteredTransactions']); // Emitir o evento
const sortBy = ref('date'); // Ref para armazenar a opção de ordenação

// Filtra as transações com base na opção de ordenação
const filteredTransactions = computed(() => {
  let transactions = props.transactions;
  if (sortBy.value === 'date') {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy.value === 'amount') {
    transactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  }
  return transactions;
});

// Watcher para emitir o evento de filtragem de transações
watch(filteredTransactions, (newValue) => {
  emit('update:filteredTransactions', newValue);
});
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
</style>