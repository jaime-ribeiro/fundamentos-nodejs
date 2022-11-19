// importação express
const express = require('express');
const {v4: uuidv4} = require("uuid"); // renomeando para uuidv4

const app = express();

app.use(express.json());//midware possibilitando esperar um json
// localhost:3333

const customers = [];

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

app.use(verifyIfExistsAccountCPF);

//extrato bancário "statement"
//Middleware utilizado após o nome da rota
app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
    //fazendo a desestruturação do request criado dentro do middleware
    const {customer} = request;
    return response.json(customer.statement);
});

app.listen(3333);