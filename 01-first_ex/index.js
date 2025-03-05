function addToDoList() {
    const input = document.querySelector("input");
    const ul = document.querySelector("ul");
    const li = document.createElement("li");

    li.textContent = input.value;
    li.onclick = () => ul.removeChild(li);

    ul.appendChild(li);
    input.value = '';
}