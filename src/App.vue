<template>
  <Loader v-if="isLoading" />
  <Header />
  <div class="container">
    <button @click="exportToCSV" class="export-btn">{{ t('app.exportCSV') }} <v-icon name="bi-download"
        scale="1" /></button>
    <button @click="generatePDF" class="export-btn">{{ t('app.generatePDF') }} <v-icon name="bi-download"
        scale="1" /></button>
    <div class="filter-container">
      <PeriodFilter ref="periodFilter" :transactions="transactions"
        @update:filteredTransactions="updateFilteredTransactions" />
      <Filters :transactions="filteredTransactions" @update:filteredTransactions="updateFilteredTransactions"
        :isVisible="isFiltersVisible" />
    </div>
    <Dashboard :transactions="filteredTransactions" />
    <ExpenseChart :transactions="filteredTransactions" />
    <TransactionList :transactions="filteredTransactions" @transactionDeleted="handleTransactionDeleted"
      @transactionEdited="handleTransactionEdit" @editButtonClicked="resetPeriodFilter" />
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" @modalOpened="resetPeriodFilter" />
    <EditTransaction v-if="isEditModalVisible" :transaction="editingTransaction" :isVisible="isEditModalVisible"
      @transactionUpdated="handleTransactionUpdated" @close="closeEditModal" />
    <Calculator />
    <ConsentBanner ref="consentBannerRef" />
  </div>

  <footer class="footer">
    <p>{{ t('footer.copyright') }}</p>
    <a href="#" @click.prevent="openPrivacyModal">{{ t('footer.privacyPolicy') }}</a>
  </footer>

  <div v-if="isPrivacyModalVisible" class="modal-overlay" @click="closePrivacyModal">
    <div class="modal" @click.stop>
      <h3>{{ t('footer.privacyPolicy') }}</h3>
      <p>{{ t('footer.privacyText') }}</p>
      <button class="btn-delete" @click="deleteAllData">{{ t('footer.deleteAllData') }}</button>
      <button class="btn-close" @click="closePrivacyModal">{{ t('footer.close') }}</button>
    </div>
  </div>
</template>

<script setup>
import Loader from './components/Loader.vue';
import Header from './components/Header.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import EditTransaction from './components/EditTransaction.vue';
import ExpenseChart from './components/ExpenseChart.vue';
import Dashboard from './components/Dashboard.vue';
import Filters from './components/Filters.vue';
import PeriodFilter from './components/PeriodFilter.vue';
import Calculator from './components/Calculator.vue'; 
import ConsentBanner from './components/ConsentBanner.vue';
import { jsPDF } from 'jspdf'; 

import { useToast } from 'vue-toastification';
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Variáveis para tradução
const { t, locale } = useI18n();

// Variáveis reativas
const toast = useToast(); // Toast para exibir mensagens
const transactions = ref([]); // Vários objetos de transação
const filteredTransactions = ref([]); // Lista filtrada de transações
const editingTransaction = ref(null); // Referência para a transação em edição
const isEditModalVisible = ref(false); // Estado para controlar a visibilidade do modal de edição
const periodFilter = ref(null); // Referência para o componente PeriodFilter
const isFiltersVisible = ref(true); // Estado para controlar a visibilidade do Filters.vue
const isPrivacyModalVisible = ref(false); // Estado para controlar a visibilidade do modal de privacidade
const consentBannerRef = ref(null); // Referência ao componente ConsentBanner
const isLoading = ref(true); // Controla o estado do loader

// Executa ações após o componente ser montado
onMounted(() => {
  const savedTransactions = JSON.parse(localStorage.getItem('transactions')); // JSON.parse para pegar item do localStorage
  const savedLocale = localStorage.getItem('userLocale'); // savedLocale para pegar a linguagem do localStorage

  // Verifica se há transações salvas e se tiver, inicializa com as transações salvas
  if (savedTransactions) {
    transactions.value = savedTransactions;
    filteredTransactions.value = savedTransactions; // Inicializa com todas as transações
  }
  if (savedLocale) {
    locale.value = savedLocale; // Define a linguagem salva
  }
});

// Monitora o valor selecionado no PeriodFilter
//watch(
  //() => periodFilter.value?.selectedFilter,
  //(newFilter) => {
    ///console.log('Selected Filter:', newFilter);
    ///console.log('Selected Year:', periodFilter.value?.selectedYear);
    //console.log('Selected Month:', periodFilter.value?.selectedMonth);
    //isFiltersVisible.value = newFilter === 'all'; // Oculta o filtro de ordenação se o filtro for 'all' DESATIVADO
  //}
//);

// Observa mudanças na linguagem e salva no localStorage
watch(locale, (newLocale) => {
  localStorage.setItem('userLocale', newLocale); // Salva a linguagem selecionada
});

// Atualiza o filtro de período
const updateFilteredTransactions = (newFilteredTransactions) => {
  filteredTransactions.value = newFilteredTransactions;
};

//Lida com a transação adicionada
const handleTransactionSubmitted = (transactionData) => {

  // Cria uma nova transação com os dados fornecidos
  const newTransaction = {
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount,
    date: transactionData.date,
  };

  transactions.value.push(newTransaction); // Adiciona a nova transação à lista com push
  filteredTransactions.value = transactions.value; // Atualiza a lista filtrada
  saveTransactionsToLocalStorage(); // Manda as transações para o localStorage
  toast.success(t('app.transactionAdded'));
};

// Gerar um ID único para a transação
const generateUniqueId = () => {
  return Math.floor(Math.random() * 100000000); // Gera um número aleatório
};

// Lida com a transação excluída
const handleTransactionDeleted = (id) => {
  transactions.value = transactions.value.filter((transaction) => transaction.id !== id); // Filtra as transações para remover a transação
  filteredTransactions.value = transactions.value; // Atualiza a lista filtrada
  saveTransactionsToLocalStorage(); // Manda as transações para o localStorage
  toast.success(t('app.transactionDeleted'));
};

// Lida com a edição de transações
const handleTransactionEdit = (transaction) => {
  editingTransaction.value = transaction;
  isEditModalVisible.value = true;
};

// No método closeEditModal, feche o modal
const closeEditModal = () => {
  isEditModalVisible.value = false;
  editingTransaction.value = null;
};

// Lida com a transação atualizada
const handleTransactionUpdated = (updatedTransaction) => {
  const index = transactions.value.findIndex((t) => t.id === updatedTransaction.id);
  if (index !== -1) {
    transactions.value[index] = updatedTransaction; // Atualiza a transação
    filteredTransactions.value = transactions.value; // Atualiza a lista filtrada
    saveTransactionsToLocalStorage(); // Manda as transações para o localStorage
    toast.success(t('app.transactionUpdated'));
  }
  editingTransaction.value = null; // Fecha o modal após a atualização
  isEditModalVisible.value = false; // Fecha o modal
};

// Função para resetar o filtro de período
const resetPeriodFilter = () => {
  if (periodFilter.value) {
    periodFilter.value.resetFilter();
  }
};

// Salva as transações no localStorage
const saveTransactionsToLocalStorage = () => {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions.value));
  } catch (error) {
    toast.error(t('app.saveError'));
  }
};

// Função para filtrar transações com base no filtro selecionado
const getFilteredTransactionsForExport = () => {
  return filteredTransactions.value; // Usa as transações já filtradas
};

// Função para gerar o nome do arquivo com base no filtro
const getExportFileName = () => {
  if (!periodFilter.value) return t('app.transactions'); // Se periodFilter não estiver disponível

  const filter = periodFilter.value.selectedFilter; // Obtém o filtro selecionado
  const year = periodFilter.value.selectedYear; // Obtém o ano selecionado
  const month = periodFilter.value.selectedMonth; // Obtém o mês selecionado

  //console.log('Filter:', filter);
  //console.log('Selected Year:', year);
  //console.log('Selected Month:', month);

  // Retorna o nome do arquivo com base no filtro selecionado
  if (filter === 'all') {
    return t('app.transactions');
  } else if (filter === 'year' && year) {
    return `${t('app.transactions')}-${year}`;
  } else if (filter === 'month' && year && month) {
    const monthName = new Date(2023, month - 1).toLocaleString(locale.value, { month: 'short' });
    return `${t('app.transactions')}-${monthName}-${year}`;
  }
  return t('app.transactions');
};

// Função para calcular o total de receitas com base nas transações filtradas
const calculateFilteredIncome = (transactions) => {
  return transactions
    .filter((transaction) => transaction.amount > 0) // Filtra as transações com valores positivos
    .reduce((acc, transaction) => acc + transaction.amount, 0) // Soma os valores
    .toFixed(2); // Formata para duas casas decimais
};

// Função para calcular o total de despesas com base nas transações filtradas
const calculateFilteredExpenses = (transactions) => {
  return transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0) 
    .toFixed(2); 
};

// Função para calcular o saldo líquido com base nas transações filtradas
const calculateFilteredNetBalance = (transactions) => {
  return transactions
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
};

// Função para obter o texto do filtro
const getFilterText = () => {
  if (!periodFilter.value) return t('app.allPeriod'); // Verifica se o periodFilter está disponível

  const filter = periodFilter.value.selectedFilter; // Obtém o filtro selecionado
  const year = periodFilter.value.selectedYear; // Obtém o ano selecionado
  const month = periodFilter.value.selectedMonth; // Obtém o mês selecionado

  // Retorna o texto com base no filtro selecionado
  if (filter === 'all') {
    return t('app.allPeriod');
  } else if (filter === 'year' && year) {
    return `${t('app.year')}: ${year}`;
  } else if (filter === 'month' && year && month) {
    const monthName = new Date(2023, month - 1).toLocaleString(locale.value, { month: 'short' });
    return `${t('app.month')}: ${monthName} ${year}`;
  }
  return t('app.allPeriod');
};

// Função para exportar para CSV
const exportToCSV = () => {
  const transactionsToExport = getFilteredTransactionsForExport(); // Usa as transações filtradas
  const fileName = getExportFileName(); // Obtém o nome do arquivo

  // Calcula os totais com base nas transações filtradas
  const filteredIncome = calculateFilteredIncome(transactionsToExport);
  const filteredExpenses = calculateFilteredExpenses(transactionsToExport);
  const filteredNetBalance = calculateFilteredNetBalance(transactionsToExport);

  let csvContent = "\uFEFF"; // Adiciona BOM para suportar caracteres especiais
  const headers = [t('app.transaction'), t('app.amount'), t('app.date')].join(';'); // Cabeçalhos do CSV

  // Cria as linhas do CSV com base nas transações
  const rows = transactionsToExport.map((t) => [
    t.text,
    t.amount,
    new Date(t.date).toLocaleDateString(locale.value)
  ].join(';'));

  // Cria as linhas com os totais
  const totals = [
    [t('app.totalIncome'), `${filteredIncome}`, ''].join(';'), // Adiciona o total de receitas
    [t('app.totalExpenses'), `${filteredExpenses}`, ''].join(';'), // Adiciona o total de despesas
    [t('app.netBalance'), `${filteredNetBalance}`, ''].join(';'), // Adiciona o saldo líquido
  ];

  csvContent += [headers, '', ...rows, '', ...totals].join('\n'); // Adiciona as linhas ao CSV

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // Cria um blob com o conteúdo do CSV
  const link = document.createElement('a'); // Cria um link
  link.href = URL.createObjectURL(blob); // Define o link para o blob
  link.download = `${fileName}.csv`; // Define o nome do arquivo
  link.click(); // Clica no link para baixar o arquivo
};

// Função para gerar o PDF
const generatePDF = () => {
  const transactionsToExport = getFilteredTransactionsForExport(); // Usa as transações filtradas
  const fileName = getExportFileName(); // Obtém o nome do arquivo

  // Calcula os totais com base nas transações filtradas
  const filteredIncome = calculateFilteredIncome(transactionsToExport);
  const filteredExpenses = calculateFilteredExpenses(transactionsToExport);
  const filteredNetBalance = calculateFilteredNetBalance(transactionsToExport);

  const doc = new jsPDF(); // Cria uma nova instância do jsPDF  

  // Adiciona o título no canto superior esquerdo
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(t('app.transactionReport'), 10, 10); // Adiciona o título

  // Adiciona o filtro no canto superior direito
  const filterText = getFilterText(); // Obtém o texto do filtro
  doc.setFontSize(12); // Tamanho da fonte
  doc.setTextColor(100, 100, 100); // Cor cinza para o texto do filtro
  const pageWidth = doc.internal.pageSize.getWidth(); // Largura da página
  const textWidth = doc.getTextWidth(filterText); // Largura do texto
  doc.text(filterText, pageWidth - textWidth - 10, 10); // Alinha à direita

  const lineY = 15; // Posição Y da linha
  doc.setDrawColor(200, 200, 200);
  doc.line(10, lineY, 200, lineY);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 20; // Posição Y inicial

  // Adiciona as transações para o PDF
  transactionsToExport.forEach((transaction) => {
    doc.setFillColor(transaction.amount < 0 ? '#ff7675' : '#2ecc71'); // Cor de fundo do retângulo
    doc.rect(10, y, 190, 10, 'F'); // Adiciona um retângulo colorido
    doc.setTextColor(0, 0, 0);
    doc.text(`${t('app.transaction')}: ${transaction.text}`, 12, y + 8); // Adiciona o texto da transação
    doc.text(`${t('app.amount')}: $${transaction.amount}`, 80, y + 8); // Adiciona o valor da transação
    doc.text(`${t('app.date')}: ${new Date(transaction.date).toLocaleDateString(locale.value)}`, 140, y + 8); // Adiciona a data da transação
    y += 12; // Incrementa a posição Y
  });

  doc.setDrawColor(200, 200, 200); // Cor cinza para a linha
  doc.line(10, y + 5, 200, y + 5); // Adiciona uma linha

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t('app.totalIncome')}: +$${filteredIncome}`, 10, y + 15); // Adiciona o total de receitas
  doc.text(`${t('app.totalExpenses')}: -$${filteredExpenses}`, 10, y + 25); // Adiciona o total de despesas
  doc.text(`${t('app.netBalance')}: $${filteredNetBalance}`, 10, y + 35); // Adiciona o saldo líquido

  doc.save(`${fileName}.pdf`); // Salva o arquivo PDF
};

// Funções para o modal de privacidade
const openPrivacyModal = () => {
  isPrivacyModalVisible.value = true;
};

const closePrivacyModal = () => {
  isPrivacyModalVisible.value = false;
};

// Função para apagar todos os dados (incluindo a linguagem salva)
const deleteAllData = () => {
  localStorage.removeItem('transactions'); // Remove as transações salvas
  localStorage.removeItem('userLocale'); // Remove a linguagem salva
  transactions.value = []; // Limpa a lista de transações
  filteredTransactions.value = []; // Limpa a lista filtrada
  locale.value = 'pt-BR'; // Redefine a linguagem para o padrão (pt-BR)
  consentBannerRef.value.resetConsent(); // Reinicia o banner
  toast.success(t('footer.dataDeleted'));
  closePrivacyModal();
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 120px;
  padding-bottom: 60px;
}

.export-btn {
  background-color: #6c5ce7;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-right: 10px;
}

.export-btn:hover {
  background-color: #5a4acf;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.footer {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  color: #fff;
  text-align: center;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: clamp(13px, 1vw, 1vw);
  z-index: 100;
}

.footer a {
  color: #42b983;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

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
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal h3 {
  margin-bottom: 20px;
}

.modal p {
  margin-bottom: 20px;
}

.btn-delete {
  background-color: #ff7675;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-delete:hover {
  background-color: #e74c3c;
}

.btn-close {
  background-color: #6c5ce7;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-close:hover {
  background-color: #5a4acf;
}

@media (max-width: 999px) {
  .footer {
    background-color: rgba(53, 73, 94, 0.9);
    z-index: 10000;
  }
}
</style>