document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const allButton = document.getElementById('allButton');
    const activeButton = document.getElementById('activeButton');
    const completedButton = document.getElementById('completedButton');

    // Loading todos from browser localStorage
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodoToDOM(todo.text, todo.completed));

    addButton.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            addTodoToDOM(text);
            todos.push({ text, completed: false });
            saveToLocalStorage(todos);
            todoInput.value = '';
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('delete')) {
            const index = Array.from(todoList.children).indexOf(e.target.parentElement);
            todos.splice(index, 1);
            saveToLocalStorage(todos);
            e.target.parentElement.remove();
        } else if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const li = e.target.parentElement;
            const index = Array.from(todoList.children).indexOf(li);
            todos[index].completed = e.target.checked;
            saveToLocalStorage(todos);
    
            if (e.target.checked) {
                const nextSibling = li.nextElementSibling;
    
                // Check if the item is the last in the list or if the next sibling is checked
                if (!nextSibling || nextSibling.querySelector('input[type="checkbox"]').checked) {
                    // If the last item or next sibling is checked, do nothing
                    li.classList.add('completed');
                } else {
                    // Add the bounce animation class and move the item to the bottom
                    li.classList.add('bouncing');
                    li.addEventListener(
                        'animationend',
                        () => {
                            li.classList.remove('bouncing');
                            todoList.appendChild(li); // Moving item to bottom after animation
                        },
                        { once: true }
                    );
                }
            } else {
                // Handling the case where the checkbox is unchecked
                const allItems = Array.from(todoList.children);
                const checkedAbove = allItems.slice(0, index).reverse().find(item => item.querySelector('input[type="checkbox"]').checked);
    
                if (checkedAbove) {
                    // Moving the unchecked item above the first checked item found
                    todoList.insertBefore(li, checkedAbove);
                }
    
                li.classList.remove('completed');
            }
    
            li.classList.toggle('completed', e.target.checked);
        }
    });
    
    
    

    allButton.addEventListener('click', () => {
        filterTodos('all');
    });

    activeButton.addEventListener('click', () => {
        filterTodos('active');
    });

    completedButton.addEventListener('click', () => {
        filterTodos('completed');
    });

    function addTodoToDOM(text, completed = false) {
        const li = document.createElement('li');
        li.classList.toggle('completed', completed);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        li.appendChild(checkbox);

        const span = document.createElement('span');
        span.textContent = text;
        li.appendChild(span);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.classList.add('delete');
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    }

    function saveToLocalStorage(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function filterTodos(filter) {
        const allTodos = Array.from(todoList.children);
        allTodos.forEach(todo => {
            switch (filter) {
                case 'all':
                    todo.style.display = 'flex';
                    break;
                case 'active':
                    todo.style.display = todo.querySelector('input[type="checkbox"]').checked ? 'none' : 'flex';
                    break;
                case 'completed':
                    todo.style.display = todo.querySelector('input[type="checkbox"]').checked ? 'flex' : 'none';
                    break;
            }
        });

        document.querySelectorAll('.filters button').forEach(button => button.classList.remove('active'));
        switch (filter) {
            case 'all':
                allButton.classList.add('active');
                break;
            case 'active':
                activeButton.classList.add('active');
                break;
            case 'completed':
                completedButton.classList.add('active');
                break;
        }
    }
});