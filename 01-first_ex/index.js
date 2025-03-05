function addToDoList() {
    const input = document.getElementById('input');
    const ul = document.getElementById('list');
    const li = document.createElement('li');
    li.textContent = input.value;
    ul.appendChild(li);
    input.value = '';
}