import { createI18n } from 'vue-i18n';

// Mensagens em português (PT-BR)
const messagesPtBr = {
    header: {
        title: 'VuExpensio',
    },
    app: {
        exportCSV: 'Exportar para CSV',
        generatePDF: 'Baixar PDF',
        transactionAdded: 'Transação adicionada com sucesso!',
        transactionDeleted: 'Transação excluída com sucesso!',
        transactionUpdated: 'Transação atualizada com sucesso!',
        saveError: 'Falha ao salvar transações no armazenamento local.',
        transactions: 'Transações',
        transaction: 'Transação',
        amount: 'Valor',
        date: 'Data',
        totalIncome: 'Receita Total',
        totalExpenses: 'Despesas Totais',
        netBalance: 'Saldo Líquido',
        transactionReport: 'Relatório de Transações',
        allPeriod: 'Todo o Período',
        year: 'Ano',
        month: 'Mês',
    },
    periodFilter: {
        allPeriod: 'Todo o Período',
        byYear: 'Por Ano',
        byMonth: 'Por Mês',
    },
    months: {
        January: 'Janeiro',
        February: 'Fevereiro',
        March: 'Março',
        April: 'Abril',
        May: 'Maio',
        June: 'Junho',
        July: 'Julho',
        August: 'Agosto',
        September: 'Setembro',
        October: 'Outubro',
        November: 'Novembro',
        December: 'Dezembro',
    },
    filters: {
        sortByDate: 'Filtro de Data',
        sortByAmount: 'Filtro de Valor',
    },
    dashboard: {
        totalIncome: 'Receita Total',
        totalExpenses: 'Despesas Totais',
        netBalance: 'Saldo Líquido',
    },
    expenseChart: {
        amount: 'Valor',
    },
    transactionList: {
        title: 'Transações',
    },
    addTransaction: {
        title: 'Adicionar Nova Transação',
        name: 'Nome da Transação',
        amount: 'Valor',
        amountHelp: 'Use valores negativos para despesas e positivos para receitas.',
        date: 'Data',
        addButton: 'Transação',
        closeButton: 'Fechar',
        errorMessage: 'Apenas números positivos e negativos são permitidos.',
    },
    editTransaction: {
        title: 'Editar Transação',
        name: 'Nome da Transação',
        amount: 'Valor',
        amountHelp: 'Use valores negativos para despesas e positivos para receitas.',
        date: 'Data',
        updateButton: 'Atualizar Transação',
        closeButton: 'Fechar',
        errorMessage: 'Apenas números positivos e negativos são permitidos.',
    },
    footer: {
        copyright: '© 2025 Gustavo Batista, Todos os direitos reservados.',
        privacyPolicy: 'Política de Privacidade',
        privacyText: 'Todos os dados são armazenados localmente no seu navegador e nunca são compartilhados com terceiros, você pode excluir todos seus dados quando quiser.',
        deleteAllData: 'Apagar Todos os Dados',
        close: 'Fechar',
        dataDeleted: 'Todos os dados foram apagados com sucesso!',
    },
    consent: {
        message: 'Ao continuar usando este site, você concorda com a Política de Privacidade.',
        acceptButton: 'Eu Aceito',
    },
};

// Mensagens em inglês (ENG)
const messagesEn = {
    header: {
        title: 'VuExpensio',
    },
    app: {
        exportCSV: 'Export to CSV',
        generatePDF: 'Download PDF',
        transactionAdded: 'Transaction added successfully!',
        transactionDeleted: 'Transaction deleted successfully!',
        transactionUpdated: 'Transaction updated successfully!',
        saveError: 'Failed to save transactions to local storage.',
        transactions: 'Transactions',
        transaction: 'Transaction',
        amount: 'Amount',
        date: 'Date',
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        netBalance: 'Net Balance',
        transactionReport: 'Transaction Report',
        allPeriod: 'All Period',
        year: 'Year',
        month: 'Month',
    },
    periodFilter: {
        allPeriod: 'All Period',
        byYear: 'By Year',
        byMonth: 'By Month',
    },
    months: {
        January: 'January',
        February: 'February',
        March: 'March',
        April: 'April',
        May: 'May',
        June: 'June',
        July: 'July',
        August: 'August',
        September: 'September',
        October: 'October',
        November: 'November',
        December: 'December',
    },
    filters: {
        sortByDate: 'Sort by Date',
        sortByAmount: 'Sort by Amount',
    },
    dashboard: {
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        netBalance: 'Net Balance',
    },
    expenseChart: {
        amount: 'Amount',
    },
    transactionList: {
        title: 'Transactions',
    },
    addTransaction: {
        title: 'Add New Transaction',
        name: 'Transaction Name',
        amount: 'Amount',
        amountHelp: 'Use negative values for expenses and positive values for income.',
        date: 'Date',
        addButton: 'Transaction',
        closeButton: 'Close',
        errorMessage: 'Only positive and negative numbers are allowed.',
    },
    editTransaction: {
        title: 'Edit Transaction',
        name: 'Transaction Name',
        amount: 'Amount',
        amountHelp: 'Use negative values for expenses and positive values for income.',
        date: 'Date',
        updateButton: 'Update Transaction',
        closeButton: 'Close',
        errorMessage: 'Only positive and negative numbers are allowed.',
    },
    footer: {
        copyright: '© 2025 Gustavo Batista, All rights reserved.',
        privacyPolicy: 'Privacy Policy',
        privacyText: 'All data is stored locally in your browser and is never shared with third parties.You can delete all your data whenever you want.',
        deleteAllData: 'Delete All Data',
        close: 'Close',
        dataDeleted: 'All data has been successfully deleted!',
    },
    consent: {
        message: 'By continuing to use this site, you agree with the Privacy Policy.',
        acceptButton: 'I Accept',
    },
};

// Configuração do i18n
const i18n = createI18n({
    locale: 'pt-BR', // Idioma padrão
    fallbackLocale: 'en', // Idioma de fallback
    messages: {
        'pt-BR': messagesPtBr,
        en: messagesEn,
    },
});

export default i18n;