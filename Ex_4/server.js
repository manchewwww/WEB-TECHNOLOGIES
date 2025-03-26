const express = require('express');
const app = express();
const cors = require('cors');
const { REFUSED } = require('dns');
app.use(express.json());
app.use(cors());
let todos = [];
let idCounter = 1;

/// GET reques for /api/todos
app.get('/api/todos',(req,res)=>{
    return res.json(todos);
});

/// POST request for /api/todos
app.post('/api/todos',(req,res)=>{

    if(!req.body?.text || req.body.text===''){
        return res.status(400).send({text: "Invalid text!"});
    }
    const id = idCounter++;
    const myTodo = {
        id,
        todo: req.body.text,
        completed: false
    };

    todos.push(myTodo);
    return res.json(myTodo);
});

/// DELETE request for /api/todos/:id
app.delete('/api/todos/:id',(req,res)=>{
    
    //+ e syshtoto kato parseInt() i kato Number()
    const id = +req.params.id;

    const myTodo = todos.find(t=>t.id === id);
    if(!myTodo){
        return res.status(400).send({text: 'Invalid ID!'});
    }

    todos = todos.filter(x=>x.id !== id);
    res.status(204).json({text : 'Deleted succesfuly!'});
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})