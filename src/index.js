// importação express
const express = require('express');
const {v4: uuidv4} = require("uuid"); // renomeando para uuidv4

const app = express();

const customers = [];

app.use(express.json());//midware possibilitando esperar um json

// localhost:3333

//extrato bancário "statement"
app.get("/statement/:cpf", (request, response) => {
    const {cpf} = request.params;
    const customer = customers.find(customer => customer.cpf === cpf);
    return response.json(customer.statement);
});

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

app.put("/courses/:id", (request,response)=>{
    const {id} = request.params;
    console.log(id);
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

app.patch("/courses/:id", (request,response)=> {
    return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"])
})

app.delete("/courses/:id", (request,response) => {
    return response.json(["Curso 6", "Curso 7", "Curso 4"])
})

app.listen(3333);