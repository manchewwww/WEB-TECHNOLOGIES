const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

const todos = [];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: "Text is required" });
  }
  const todo = { id: todos.length + 1, text: req.body.text };
  todos.push(todo);
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
