// importação express
const express = require('express');

const app = express();

// localhost:3333

app.get("/courses", (req, res) => {
    return res.json(["Curso 1", "Curso 2", "Curso 3"]);
/* 
    na maioria das vezes não iremos utilizar o método "send"
    e sim o método "json"
*/
    
});

app.post("/courses",(req,res) => {
    return res.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
}
)

app.put("/courses/:id", (req,res)=>{
    return res.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

app.patch("/courses/:id", (req,res)=> {
    return res.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"])
})

app.delete("/courses/:id", (req,res) => {
    return res.json(["Curso 6", "Curso 7", "Curso 4"])
})

app.listen(3333);