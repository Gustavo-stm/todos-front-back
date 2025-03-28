
let filteredPage = 1
let page = 1

function createTodo() {

    let prio = document.getElementById('priority').value

    let task = document.getElementById('task').value

    let assigned = document.getElementById('assigned').value

    fetch("http://127.0.0.1:8000/todos/create", {
        method: "POST",
        body: JSON.stringify({ prio, task, assigned })
    })
        .then(res => res.json())
        .then(res => {

            // Show error on creation, or...
            if (res.error) { console.log(res.error) }

            // ...if the creation was successfull, it goes back to read todos again
            else { toggleView('show-todos') }
        })
        .catch(err => console.log(err))
}

// Main function for updating the UI from read view to create view

function toggleView(action) {

    resetPages()

    document.getElementById('container').innerHTML = ""

    if (action === 'create-todo') {
        document.getElementById('container').innerHTML += `
            <form>
                <label for="priority">Priority</label>
                <input  id="priority" placeholder="Priority"/>
                <label for="task">Task</label>
                <input  id="task" placeholder="Task"/>
                <label for="assigned">Assigned to</label>
                <input  id="assigned" placeholder="My friend (1) / Me (2)"/>

                <button type="button" onclick="createTodo()" type="button">Submit</button>
            <p id="back-button" onclick="toggleView('back');"><< Go Back </p>
            </form>
            `
    }

    else {
        document.getElementById('container').innerHTML += `<form>
                                                    <p class="title">Filter Todos</p>
                                                    <label for="priority">Priority</label>
                                                    <input onkeyup="resetPages();filterTodos();" id="priority" placeholder="Priority"/>
                                                    <label for="task">Task</label>
                                                    <input onkeyup="resetPages();filterTodos();" id="task" placeholder="Task"/>
                                                    <label for="task">Assigned to</label>
                                                    <input onkeyup="resetPages();filterTodos();" id="assigned" placeholder="My friend (1) / Me (2)"/>

                                                    <p>
                                                        <button type="button" onclick="showPage('minus')">Prev</button>
                                                        <button type="button" onclick="showPage('plus')">Next</button>
                                                    </p>
                                                    <button onclick="toggleView('create-todo')">Create to do</button>
                                                </form>
                                                <div id="todos-container">
                                                    <p id="qty">Showing 0 - 10</p>
                                                    <ul id="todos">
                                                    </ul> 
                                                </div> `

        getData()
    }
}

function resetPages() {
    page = 1
    filteredPage = 1
}


// Function to delete todo depending on todo id
function deleteTodo(todoId) {

    fetch(`http://127.0.0.1:8000/todos/delete?id=${Number(todoId)}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(res => getData())
        .catch(err => console.log(err))
}


// This 2 functions get data from the backend, depending on if it is all the data
// or just some filtered data

function getData() {

    fetch(`http://127.0.0.1:8000/todos/read?page=${page}`)
        .then(res => res.json())
        .then(res => showData(res))
        .catch(err => console.log(err))
}

getData()

function getFilteredData(task, prio, assigned) {

    fetch(`http://127.0.0.1:8000/todos/read/filter?task=${task}&prio=${prio}&assigned=${assigned}&page=${filteredPage}`)
        .then(res => res.json())
        .then(res => showData(res))
        .catch(err => console.log(err))
}

// This function does the job of showing the data in the HTML.
// Doesn´t matter if it is filtered data or just normal data

function showData(data) {

    document.getElementById('todos').innerHTML = ""
    data = data.todos
    data.forEach(el => {
        document.getElementById('todos').innerHTML += `<li class="todo">${el[0]} - ${el[1]} - Priority${el[4]}<i type="button" id="delete-${el[2]}" onclick="deleteTodo(${el[2]})" class="fa-solid fa-trash"></i></li>`
    })
}


// This function calls the getData function or the getFilteredData function
// depending on the input values (if empty or if with some value)

// The function is triggered by the inputs keyup event in the HTML

function filterTodos() {

    let task = document.getElementById('task').value
    let prio = document.getElementById('priority').value
    let assigned = document.getElementById('assigned').value

    if (!task) task = " "
    if (!prio) prio = " "
    if (!assigned) assigned = " "

    // If there´s no value in the inputs reset the pages to default value 1 and show the 
    // data (and qty 0 10) again
    if (task === " " && prio === " " && assigned == " ") {
        resetPages();
        getData();
        showQty('todos')
        return
    }


    getFilteredData(task, prio, assigned)
    showQty('filtered')
}

// This 2 functions take an action from the buttons (minus or plus)
// and change the page or filteredPage

// Then they call the getData or filterTodos, 
// which gets all the data or just the filtered data from db

function showFilteredPage(action) {

    let todosinUi = [...document.getElementsByClassName('todo')]

    if (action === 'minus' && filteredPage == 1) return

    else if (action === 'plus' && todosinUi.length < 10) return

    filteredPage = action === 'minus' ? filteredPage - 1 : filteredPage + 1

    filterTodos()

}

function showPage(action) {

    let task = document.getElementById('task').value
    let prio = document.getElementById('priority').value
    let assigned = document.getElementById('assigned').value

    if (task.length > 0 || prio.length > 0 || assigned.length > 0
    ) {
        showFilteredPage(action); return
    }

    let todosinUi = [...document.getElementsByClassName('todo')]

    if (action === 'minus' && (page == 1 && filteredPage == 1)) return
    else if (action === 'plus' && todosinUi.length < 10) return

    page = action === 'minus' ? page - 1 : page + 1


    getData()
    showQty('todos')
}

// Finally this function shows the results quantity 0-10, 10-20...

function showQty(datatype) {
    if (datatype === 'filtered') document.getElementById('qty').innerHTML = `Showing ${(filteredPage * 10) - 10} to ${filteredPage * 10}`
    else { document.getElementById('qty').innerHTML = `Showing ${(page * 10) - 10} to ${page * 10}` }
}




