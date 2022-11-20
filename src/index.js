// importação express
const express = require('express');
const {v4: uuidv4} = require("uuid"); // renomeando para uuidv4

const app = express();

app.use(express.json());//midware possibilitando esperar um json
// localhost:3333

const customers = [];

// middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const {cpf} = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error: "Costumer not found"});
    }
    //criação de um request para que as rotas tenham acesso
    request.customer = customer;

    return next();
}

function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if( operation.type==='credit'){
            return acc + operation.amount;
        }
        else{
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

app.post("/account", (request, response)=>{
    const {cpf,name} = request.body;

    const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customersAlreadyExists){
        return response.status(400).json({error: "Customer Already Exists!"});
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],
    });

    //gerar uuid dentro do objeto

    return response.status(201).send();
    //returnando o status code 201 que confirma que deu tudo certo
});

//app.use(verifyIfExistsAccountCPF);

//extrato bancário "statement"
//Middleware utilizado após o nome da rota
app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
    //fazendo a desestruturação do request criado dentro do middleware
    const {customer} = request;
    return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) =>{
    const {description, amount} = request.body;
    
    const {customer} = request;

    //O tipo crédito é deposito, débito saque
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);
    return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request,response) =>{
    const { amount } = request.body;
    const { customer} = request;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error: "Insufficient funds"});
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit",
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;
    const {date} = request.query;
    //Quando se põe a data junto da string 00:00 sem o espaço antes ocorre um erro e diz que a data é inválida.
    const dateFormate = new Date(date + " 00:00");
    console.log(dateFormate);
    const statement = customer.statement.filter(
        (statement)=>
        statement.created_at.toDateString() ===
        new Date(dateFormate).toDateString()
        );
    console.log(statement);
    return response.json(statement);
});

app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;
    const {name} = request.body;

    customer.name = name; 

    return response.status(201).send();
});

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;

    return response.json(customer);
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response)=> {
    const {customer} = request;
//Splice apagando somente o último cusomter criado -incompleto-
    customers.splice(customer, 1);

    return response.status(200).json(customers)
});

app.get("/balance", verifyIfExistsAccountCPF, (request, response) =>{
 const {customer} = request;
 const balance = getBalance(customer.statement);

 return response.status(200).json(balance);

});

app.listen(3333);