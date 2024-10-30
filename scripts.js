// seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// seleciona os eslementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// captura o evento de input para formatar o valor

amount.oninput = () => {
    // obtem o valor atual do input e remove os caracteres não numéricos
    let value = amount.value.replace(/\D/g, "")

    // transforma o valor em centavos (exemplo: 150/100 = R$ 1,50)
    value = Number(value) / 100

    // atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    // formata o valor no padrao BRL (Real Brasileiro)
    value = value.toLocaleString('pt-BR', {
        style: "currency",
        currency: "BRL",
    })
    return value
}

// captura o evento de submit do formulario para obter valores
form.onsubmit = (event) => {
    event.preventDefault()

    // cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    //chama a função que irá adicionar o item na lista
    expenseAdd(newExpense)
}

// adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // cria o elemento de li para adicionar o item na lista ul
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // adiciona nome e categoria na dia das informação da despesa
        expenseInfo.append(expenseName, expenseCategory)

        // criar o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // adiciona o item na lista
        expenseList.append(expenseItem)

        // limpa os inputs do formulario para adicionar novo item
        formClear()

        // atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de despesas.")
        console.log(error)
    }
}

// atualiza os totais
function updateTotals() {
    try {
        // recupera todos os itens li da lista ul
        const items = expenseList.children
       
        // atualiza a quantidade de itens na lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // variável para incrementar o total
        let total = 0

        // percorre cada item da li da lista ul
        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")
            

            //remover caracteres não numéricos e substitui vígula para ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            // converte o valor para float (casas decimais)
            value = parseFloat(value)

            // verifica se é um número válido
            if(isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }
            // incrementa o valor total
            total += Number(value)
        }

        // cria a span para o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"


        // formata o valor e remove o R$ que será exibido pela small com um estilo customizado no css
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // limpa o conteúdo do elemento
        expensesTotal.innerHTML = ""

        // adiciona o símbolo da moeda e o valor total formatado
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
    
}

// evento que captura click nos itens da lista
expenseList.addEventListener("click", function(event){

    // verifica se o elemento clicado é o ícone de remover
    if(event.target.classList.contains("remove-icon")){

        // obtém a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // remove o item da lista
        item.remove()
    }

    //atualiza os totais
    updateTotals()
})

function formClear() {

    // reseta os inputs do formulário
    expense.value = ""
    category.value = ""
    amount.value = ""

    // coloca foco no input
    expense.focus()
}

