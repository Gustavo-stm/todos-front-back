

function createTodo(){

    let prio = document.getElementById('priority').value

    let task = document.getElementById('task').value

    let assigned = document.getElementById('assigned').value

    fetch("http://127.0.0.1:8000/todos/create", {
        method: "POST",
        body: JSON.stringify({ prio,task,assigned })})
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}