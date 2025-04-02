const getTodos = () => {
    fetch("http://localhost:3000/api/todos")
    .then((res) => res.json())
    .then((todos) => {
        const ul = document.querySelector("#todoList");
        ul.innerHTML = ""; 
        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.textContent = `${todo.id} ${todo.text}`;
            ul.appendChild(li);
        });
    })
    .catch(error => console.error("Error:", error));
};

document.addEventListener("DOMContentLoaded", () => {
    getTodos();
});

const addTodo = () => {
    const element = document.querySelector("input");
    const value = element.value;
    if (!value) return;
    
    fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ text: value }),
    })
    .then(() => getTodos()) 
    .catch(error => console.error("Error:", error));

    element.value = "";
};
