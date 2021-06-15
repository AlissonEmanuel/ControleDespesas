const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// Configura o armazenamento das transações no Local Storage
// A const abaixo recebe o valor da chave transactions do Local Storage
// ... e converte em um objeto JavaScript
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
// A const abaixo verifica se a chave transactions do Local Storage
// ... é diferente de nulo, para atribuir a variável acima ou, do contrário,
// ... um array vazio
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    // Remove uma transação pelo ID e atualiza no Local Storage e na página
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = transaction => {
    // Adiciona a transação no DOM
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
      x
    </button>
  `
    // Não usar innerHTML, pois li é um objeto, e não uma string
    // prepend insere como primeiro filho, append insere como último
    transactionUl.prepend(li)
}

const updateBalanceValues = () => {
    // Atualiza o somatório de receitas e despesas e o saldo
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount)
    const total = transactionsAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmounts
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    // Executa o preenchimento na página
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    // Atualiza a chave transactions do Local Storage para o array 
    // ... de transações em forma de string
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Gera um id aleatório
const generateID = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    // Escuta o submit do form para verificar se inputs estão
    // ... preenchidos e adicionar no array de transações
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()

    if (transactionName === '' || transactionAmount === '') {
        alert('Por favor, preencha nome e valor da transação')
        return
    }

    // Cria o objeto
    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    }

    // Adiciona no array de transações, preenche na página e 
    // ... atualiza no Local Storage
    transactions.push(transaction)
    init()
    updateLocalStorage()

    // Limpa os inputs
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})