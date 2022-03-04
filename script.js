const Modal = {
    open(){
        document.querySelector('.modal-overlay')
                .classList
                .add('active');
    },
    close(){
        document.querySelector('.modal-overlay')
                .classList
                .remove('active');
        //alert('Fechar o modal');
    }
};

const Storage ={
    get(){
        return JSON.parse(localStorage.getItem("financas:transaction")) || [];
    },
    set(transactions){
        localStorage.getItem("financas:transaction", JSON.stringify(transactions));
    }
};

const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction);
        App.reload();
    },
    remove(index){
        Transaction.all.splice(index, 1);
        App.reload();
    },
    income(){
        //return "entradas";
        let income = 0;
        Transaction.all.forEach(function(transaction){
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        });
        return income;
    },
    expense(){
        //return "saidas";
        let expense = 0;
        Transaction.all.forEach(function(transaction){
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        });
        return expense;
    },
    total(){
        //return "total";
        let total = Transaction.expense() + Transaction.income();
        return total;
    }
};

const DOM = {
    transactionsContainer: document.querySelector('#data_table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr);
        //console.log(tr.innerHTML);
    },
    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./img/minus.svg" alt="Remover transação">
            </td>
        `;
        return html;
    },
    updateBalance(){
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income());
        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense());
        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransaction(){
        DOM.transactionsContainer.innerHTML = "";
    }
};

//formatar a moeda e as casas decimais dos valores
const Utils = {
    formatAmount(value){
        //value = Number(value.replace(/\,\.\g, "")) * 100;
        value = Number(value) * 100;
        return value;
    },
    formatDate(date){
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
    formatCurrency(value){
        //console.log(value);
        const signal = Number(value) < 0 ? "- " : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        //console.log(signal + value);
        return signal + value;
    }
};

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        };
    },
    formatvalues(){
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        //console.log(date);
        return{
            description, amount, date
        }
    },
    validateFielsd(){
        //console.log(Form.gerValues());
        const {description, amount, date} = Form.getValues();
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Preencha todos os campos.");
        }
    },
    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event){
        event.preventDefault();
        try {
            Form.validateFielsd();
            const transaction = Form.formatvalues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.close();
        } catch (error) {
            alert(error.message);
        }
    }
};

const App = {
    init(){

        Transaction.all.forEach(function(transaction){
            DOM.addTransaction(transaction);
        });

        DOM.updateBalance();
        Storage.set(Transaction.all);
    },
    reload(){
        DOM.clearTransaction();
        App.init();
    }
};

App.init();

// Transaction.add({
//     description: "teste",
//     amount: 2000000,
//     date: "22/06/2027"
// });

//Transaction.remove();