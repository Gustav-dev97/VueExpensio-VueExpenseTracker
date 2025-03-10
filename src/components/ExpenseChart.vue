<template>
    <div class="charts-wrapper">
        <div class="chart-container">
            <canvas ref="barChartCanvas"></canvas>
        </div>
        <div class="chart-container">
            <canvas ref="pieChartCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useI18n } from 'vue-i18n';

// Registra os componentes necessários do Chart.js
Chart.register(...registerables);

const { t, locale } = useI18n(); // useI18n para acessar as traduções

// Define as propriedades do componente
const props = defineProps({
    transactions: {
        type: Array,
        required: true,
    },
});

// Referências para os elementos <canvas> dos gráficos
const barChartCanvas = ref(null); // Referência ao elemento <canvas> do gráfico de barras
const pieChartCanvas = ref(null); // Referência ao elemento <canvas> do gráfico de pizza
const barChartInstance = ref(null); // Referência à instância do gráfico de barras
const pieChartInstance = ref(null); // Referência à instância do gráfico de pizza


// Chamado quando o componente é montado
onMounted(() => {
    renderCharts();
});

// Watch para detectar mudanças nas transações e atualizar os gráficos
watch(
    () => props.transactions,
    () => {
        renderCharts();
    },
    { deep: true }
);

// Watch para detectar mudança no idioma e atualizar os gráficos
watch(
    () => locale.value,
    () => {
        renderCharts();
    }
);

const renderCharts = () => {
    // Destrói os gráficos anteriores, se existirem
    if (barChartInstance.value) {
        barChartInstance.value.destroy();
    }
    if (pieChartInstance.value) {
        pieChartInstance.value.destroy();
    }

    // Obtém o contexto dos canvas
    const barCtx = barChartCanvas.value.getContext('2d');
    const pieCtx = pieChartCanvas.value.getContext('2d');

    // Cria uma nova instância do gráfico de barras
    barChartInstance.value = new Chart(barCtx, {
        type: 'bar', // Tipo de gráfico (pode ser 'line', 'pie', etc...)
        data: {
            labels: props.transactions.map((t) => t.text), // Rótulos (nomes das transações)
            datasets: [
                {
                    label: t('expenseChart.amount'), // Tradução dinâmica
                    data: props.transactions.map((t) => t.amount), // Valores das transações
                    backgroundColor: props.transactions.map((t) =>
                        t.amount < 0 ? '#c0392b' : '#2ecc71'
                    ), // Despesas = Vermelho Receitas = Verde
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgb(102, 102, 102)'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Cria uma nova instância do gráfico de pizza
    pieChartInstance.value = new Chart(pieCtx, {
        type: 'pie', // Tipo de gráfico
        data: {
            labels: props.transactions.map((t) => t.text), // Rótulos (nomes das transações)
            datasets: [
                {
                    label: t('expenseChart.amount'), // Tradução dinâmica
                    data: props.transactions.map((t) => t.amount), // Valores das transações
                    backgroundColor: props.transactions.map((t) =>
                        t.amount < 0 ? '#c0392b' : '#2ecc71'
                    ), // Despesas = Vermelho Receitas = Verde
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
};
</script>

<style scoped>
.chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
    align-items: center;
    max-width: 1000px;
    margin: 20px auto;
    gap: 20px;
}

.charts-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

canvas {
    padding: 10px;
    background-color: white;
    width: 100% !important;
    height: 300px !important;
    max-width: 400px;
}

@media (min-width: 999px) {
    .chart-container {
        flex-direction: row;
        flex: 1;
    }

    .charts-wrapper {
        flex-direction: row;
    }

    canvas {
        height: 400px !important;
    }
}
</style>
