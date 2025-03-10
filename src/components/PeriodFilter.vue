<template>
    <div class="period-filter">
        <select v-model="selectedFilter" id="period">
            <option value="all">{{ $t('periodFilter.allPeriod') }}</option>
            <option value="year">{{ $t('periodFilter.byYear') }}</option>
            <option value="month">{{ $t('periodFilter.byMonth') }}</option>
        </select>

        <div v-if="selectedFilter === 'year'" class="filter-options">
            <select v-model="selectedYear" id="year">
                <option v-for="year in uniqueYears" :key="year" :value="year">
                    {{ year }}
                </option>
            </select>
        </div>

        <div v-if="selectedFilter === 'month'" class="filter-options">
            <select v-model="selectedYear" id="year">
                <option v-for="year in uniqueYears" :key="year" :value="year">
                    {{ year }}
                </option>
            </select>

            <select v-model="selectedMonth" id="month">
                <option v-for="(monthName, index) in months" :key="index" :value="index + 1">
                    {{ $t(`months.${monthName}`) }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'; // Importe o useI18n

const { t } = useI18n(); // Use o useI18n para acessar as traduções

// Recebe as transações como propriedade
const props = defineProps({
    transactions: {
        type: Array,
        required: true
    }
});

// Emite a lista filtrada para o componente pai
const emit = defineEmits(['update:filteredTransactions']);

// Estado dos filtros
const selectedFilter = ref('all');
const selectedYear = ref(null);
const selectedMonth = ref(null);

// Array com os nomes dos meses
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Computa os anos únicos a partir das transações e ordena (anos mais recentes primeiro)
const uniqueYears = computed(() => {
    const yearsSet = new Set(props.transactions.map(t => new Date(t.date).getFullYear()));
    return Array.from(yearsSet).sort((a, b) => b - a);
});

// Define um ano padrão se houver pelo menos um ano disponível
watch(uniqueYears, (newYears) => {
    if (newYears.length > 0 && !selectedYear.value) {
        selectedYear.value = newYears[0];
    }
});

// Computa as transações filtradas com base na opção selecionada
const filteredTransactions = computed(() => {
    if (selectedFilter.value === 'all') {
        return props.transactions;
    } else if (selectedFilter.value === 'year') {
        return props.transactions.filter(t => {
            const tYear = new Date(t.date).getFullYear();
            return tYear === Number(selectedYear.value);
        });
    } else if (selectedFilter.value === 'month') {
        return props.transactions.filter(t => {
            const tDate = new Date(t.date);
            const tYear = tDate.getFullYear();
            const tMonth = tDate.getMonth() + 1; // getMonth() retorna 0-11
            return tYear === Number(selectedYear.value) && tMonth === Number(selectedMonth.value);
        });
    }
    return props.transactions;
});

// Sempre que houver alteração nos filtros ou nas transações, emite o novo array filtrado
watch(
    [selectedFilter, selectedYear, selectedMonth, () => props.transactions],
    () => {
        emit('update:filteredTransactions', filteredTransactions.value);
    },
    { immediate: true }
);

// Função para resetar o filtro para "All Period"
const resetFilter = () => {
    selectedFilter.value = 'all';
};

// Expor a função resetFilter para o componente pai
defineExpose({
    selectedFilter,
    selectedYear,
    selectedMonth,
    resetFilter,
});
</script>

<style scoped>
.period-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.period-filter label {
    font-size: 1rem;
}

.period-filter select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.filter-options {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>