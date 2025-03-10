<template>
  <div class="dashboard">
    <div class="dashboard-item">
      <h4>{{ $t('dashboard.totalIncome') }}</h4>
      <p class="money plus">+${{ totalIncome }}</p>
    </div>
    <div class="dashboard-item">
      <h4>{{ $t('dashboard.totalExpenses') }}</h4>
      <p class="money minus">-${{ totalExpenses }}</p>
    </div>
    <div class="dashboard-item">
      <h4>{{ $t('dashboard.netBalance') }}</h4>
      <p :class="netBalance >= 0 ? 'money plus' : 'money minus'">${{ netBalance }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Define props das transações
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

// Calcula o total de renda
const totalIncome = computed(() =>
  props.transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2)
);

// Calcula o total de despesas
const totalExpenses = computed(() =>
  Math.abs(
    props.transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  ).toFixed(2)
);

// Calcula o saldo líquido
const netBalance = computed(() =>
  props.transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)
);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.dashboard-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
}

.dashboard-item h4 {
  font-size: 1rem;
  margin-bottom: 10px;
}

.dashboard-item p {
  font-size: 1.25rem;
  font-weight: 600;
}

.money.plus {
  color: #2ecc71;
}

.money.minus {
  color: #c0392b;
}

@media (min-width: 768px) {
  .dashboard {
    flex-direction: row;
    justify-content: space-between;
  }

  .dashboard-item {
    flex: 1;
    margin: 0 10px;
  }
}
</style>