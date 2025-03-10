# VueExpensio-VueExpenseTracker
O VuExpensio (controladordedespesas) é um aplicativo de gerenciamento de despesas e receitas desenvolvido com Vue.js. Ele permite que os usuários adicionem, editem e excluam transações, visualizem um resumo financeiro e exportem os dados para CSV ou PDF.

-----------------------------------------------------------------------------------

Para executar o projeto: 

    npm install
    npm run dev

-----------------------------------------------------------------------------------

# Estrutura do Projeto

O projeto é composto por vários componentes Vue.js, cada um responsável por uma parte específica da funcionalidade do site. Abaixo está uma visão geral dos principais componentes e suas responsabilidades:

### OBS: O código javascript foi comentado de forma explicativa, caso o contrário esse README ficaria muito longo, mas aqui você encontra uma mapa do que cada arquivo faz bem como a explicação dos templates

-----------------------------------------------------------------------------------

## 1. **App.vue**
O arquivo `App.vue` é o componente principal do aplicativo. Ele gerencia o estado global, incluindo a lista de transações, filtros, modais, e a lógica de exportação de dados.

### Template do App.vue

    <template>
      <Loader v-if="isLoading" />
      <Header />
      <div class="container">
        <button @click="exportToCSV" class="export-btn">{{ t('app.exportCSV') }} <v-icon name="bi-download" scale="1" /></button>
        <button @click="generatePDF" class="export-btn">{{ t('app.generatePDF') }} <v-icon name="bi-download" scale="1" /></button>
        <div class="filter-container">
          <PeriodFilter ref="periodFilter" :transactions="transactions" @update:filteredTransactions="updateFilteredTransactions" />
          <Filters :transactions="filteredTransactions" @update:filteredTransactions="updateFilteredTransactions" :isVisible="isFiltersVisible" />
        </div>
        <Dashboard :transactions="filteredTransactions" />
        <ExpenseChart :transactions="filteredTransactions" />
        <TransactionList :transactions="filteredTransactions" @transactionDeleted="handleTransactionDeleted" @transactionEdited="handleTransactionEdit" @editButtonClicked="resetPeriodFilter" />
        <AddTransaction @transactionSubmitted="handleTransactionSubmitted" @modalOpened="resetPeriodFilter" />
        <EditTransaction v-if="isEditModalVisible" :transaction="editingTransaction" :isVisible="isEditModalVisible" @transactionUpdated="handleTransactionUpdated" @close="closeEditModal" />
        <Calculator />
        <ConsentBanner ref="consentBannerRef" />
      </div>

    <!-- Footer -->
    <footer class="footer">
      <p>{{ t('footer.copyright') }}</p>
      <a href="#" @click.prevent="openPrivacyModal">{{ t('footer.privacyPolicy') }}</a>
    </footer>

      <!-- Modal de Política de Privacidade -->
      <div v-if="isPrivacyModalVisible" class="modal-overlay" @click="closePrivacyModal">
        <div class="modal" @click.stop>
          <h3>{{ t('footer.privacyPolicy') }}</h3>
          <p>{{ t('footer.privacyText') }}</p>
          <button class="btn-delete" @click="deleteAllData">{{ t('footer.deleteAllData') }}</button>
          <button class="btn-close" @click="closePrivacyModal">{{ t('footer.close') }}</button>
        </div>
      </div>
    </template>

### Template:
O template do App.vue define a estrutura do aplicativo, incluindo o cabeçalho, o conteúdo principal, e o rodapé.

Ele também inclui os componentes principais, como Header, Dashboard, ExpenseChart, TransactionList, AddTransaction, EditTransaction, Calculator, e ConsentBanner.

O modal de privacidade é exibido condicionalmente com v-if="isPrivacyModalVisible".

### Script:
O script gerencia o estado global do aplicativo, incluindo a lista de transações, filtros, e modais.

Ele também implementa a lógica para adicionar, editar, excluir, e exportar transações.

### Estilos:
Os estilos são definidos no final do arquivo e incluem classes para o layout, botões, modais, e outros elementos visuais.

-----------------------------------------------------------------------------------

# 2. Header.vue
O componente Header.vue é responsável pelo cabeçalho do aplicativo, que inclui o título e um seletor de idioma.

### Template do Header.vue

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

### Template:
O template define o cabeçalho do aplicativo, que inclui o título e um botão para alternar entre os idiomas.

O título é clicável e rola a página para o topo ao ser clicado.

### Script: 
O script gerencia a lógica para alternar entre os idiomas e exibir o menu suspenso.

-----------------------------------------------------------------------------------

# 3. Dashboard.vue
O componente Dashboard.vue exibe um resumo financeiro, incluindo receitas totais, despesas totais e saldo líquido.

### Template do Dashboard.vue

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

### Template:
O template define o layout do painel de resumo financeiro, que inclui três seções: receitas totais, despesas totais, e saldo líquido.

As cores são usadas para diferenciar receitas (verde) e despesas (vermelho).

### Script:
O script calcula os valores totais com base nas transações atuais.

-----------------------------------------------------------------------------------

# 4. ExpenseChart.vue
O componente ExpenseChart.vue exibe gráficos de barras e de pizza para visualizar as transações.

### Template do ExpenseChart.vue

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

### Template:
O template define o layout dos gráficos, que são renderizados usando a biblioteca Chart.js.

### Script:
O script gerencia a lógica para renderizar e atualizar os gráficos com base nas transações.    

-----------------------------------------------------------------------------------

# 5. TransactionList.vue
O componente TransactionList.vue lista todas as transações, permitindo ao usuário editar ou excluir cada uma.

### Template do TransactionList.vue

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

### Template:
O template define a lista de transações, que inclui o nome, valor, data, e botões para editar e excluir.

As cores são usadas para diferenciar receitas (verde) e despesas (vermelho).

### Script:
O script gerencia a lógica para editar e excluir transações.

-----------------------------------------------------------------------------------

# 6. AddTransaction.vue
O componente AddTransaction.vue permite ao usuário adicionar uma nova transação.

### Template do AddTransaction.vue

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
            <input type="text" id="amount" v-model="amount" :placeholder="$t('addTransaction.amount')" @input="validateAmount" :class="{ 'input-error': amountError }" />
            <small class="help-text">{{ $t('addTransaction.amountHelp') }}</small>
            <span v-if="amountError" class="error-message">{{ $t('addTransaction.errorMessage') }}</span>
          </div>
          <div class="form-control">
            <label for="date">{{ $t('addTransaction.date') }}</label>
            <input type="date" id="date" v-model="date" />
          </div>
            <button class="btn">{{ $t('addTransaction.addButton') }}</button>
            <button type="button" class="btn btn-close" @click="closeModal">{{ $t('addTransaction.closeButton') }}</button>
          </form>
        </div>
      </div>
    </template>

### Template:
O template define o formulário para adicionar uma nova transação, que inclui campos para o nome, valor, e data.

O modal é exibido condicionalmente com v-if="isModalVisible".

### Script:
O script gerencia a lógica para validar e adicionar a transação.    

-----------------------------------------------------------------------------------

# 7. EditTransaction.vue
O componente EditTransaction.vue permite ao usuário editar uma transação existente.

### Template do EditTransaction.vue

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
            <input type="text" id="amount" v-model="amount" :placeholder="$t('addTransaction.amount')" @input="validateAmount" :class="{ 'input-error': amountError }" />
            <small class="help-text">{{ $t('addTransaction.amountHelp') }}</small>
            <span v-if="amountError" class="error-message">{{ $t('addTransaction.errorMessage') }}</span>
          </div>
          <div class="form-control">
            <label for="date">{{ $t('addTransaction.date') }}</label>
            <input type="date" id="date" v-model="date" />
          </div>
            <button class="btn">{{ $t('editTransaction.updateButton') }}</button>
            <button type="button" class="btn btn-close" @click="close">{{ $t('editTransaction.closeButton') }}</button>
          </form>
        </div>
      </div>
    </template>

### Template:
O template define o formulário para editar uma transação existente, que é semelhante ao formulário de adição.

O modal é exibido condicionalmente com v-if="isVisible".

### Script:
O script gerencia a lógica para validar e atualizar a transação.

-----------------------------------------------------------------------------------

# 8. Filters.vue
O componente Filters.vue permite ao usuário filtrar as transações por data ou valor.

### Template do Filters.vue

    <template>
      <div class="filters" v-if="isVisible">
        <select v-model="sortBy">
          <option value="date">{{ $t('filters.sortByDate') }}</option>
          <option value="amount">{{ $t('filters.sortByAmount') }}</option>
        </select>
      </div>
    </template>

### Template:
O template define o seletor para filtrar as transações por data ou valor.

### Script:
O script gerencia a lógica para filtrar as transações com base na opção selecionada.

-----------------------------------------------------------------------------------

# 9. PeriodFilter.vue
O componente PeriodFilter.vue permite ao usuário filtrar as transações por período (todos, por ano ou por mês).

### Template do PeriodFilter.vue

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

### Template:
O template define o seletor para filtrar as transações por período (todos, por ano ou por mês).

### Script:
O script gerencia a lógica para filtrar as transações com base no período selecionado.

-----------------------------------------------------------------------------------

# 10. Calculator.vue
O componente Calculator.vue fornece uma calculadora embutida para cálculos rápidos.

### Template do Calculator.vue

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

### Template:
O template define a calculadora, que inclui um display e botões para números e operações.

### Script:
O script gerencia a lógica para realizar cálculos e exibir o resultado.

-----------------------------------------------------------------------------------

# 11. ConsentBanner.vue
O componente ConsentBanner.vue exibe um banner de consentimento para a política de privacidade.

### Template do ConsentBanner.vue

    <template>
      <div v-if="showBanner" class="consent-banner">
        <p>{{ $t('consent.message') }}</p>
        <button @click="acceptConsent" class="btn">{{ $t('consent.acceptButton') }}</button>
      </div>
    </template>

### Template:
O template define o banner de consentimento, que solicita ao usuário que aceite a política de privacidade.

### Script:
O script gerencia a lógica para exibir o banner e armazenar a preferência do usuário no localStorage.

-----------------------------------------------------------------------------------

# 12. Loader.vue
O componente Loader.vue exibe um indicador de carregamento enquanto o aplicativo está processando dados.

### Template do Loader.vue

    <template>
      <div class="loader"></div>
    </template>

### Template:
O template define o indicador de carregamento, que é exibido quando o estado isLoading está ativo.

### Script:
O script gerencia a lógica para exibir o indicador de carregamento.

-----------------------------------------------------------------------------------

### Para mais detalhes, consulte o código-fonte e os comentários no repositório do GitHub.

-----------------------------------------------------------------------------------

Se precisar entrar em contato comigo, pode encontrar pelos meios de comunicação abaixo:

    e-Mail: gustavo.dev97@gmail.com

    GitHub: github.com/Gustav-dev97

Muito Obrigado! :)    
