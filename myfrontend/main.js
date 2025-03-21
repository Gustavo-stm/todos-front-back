
let filteredPage = 1
let page = 1


// This 2 functions get data from the backend, depending on if it is all the data
// or just some filtered data

function getData(){

    fetch(`http://127.0.0.1:8000/todos/read?page=${page}`)
   .then(res=>res.json())
   .then(res=>showData(res))
   .catch(err=>console.log(err))   
}

getData()

function getFilteredData(task, prio, assigned){

 fetch(`http://127.0.0.1:8000/todos/read/filter?task=${task}&prio=${prio}&assigned=${assigned}&page=${filteredPage}`)
.then(res=>res.json())
.then(res=>showData(res))
.catch(err=>console.log(err))   
}

// This function does the job of showing the data in the HTML.
// Doesn´t matter if it is filtered data or just normal data

function showData(data){

    document.getElementById('todos').innerHTML = ""
    data = data.todos
    data.forEach(el=>{
       document.getElementById('todos').innerHTML += `<p>${el[0]} - ${el[1]} - Priority${el[4]}</p>`
    })
  }


  // This function calls the getData function or the getFilteredData function
  // depending on the input values (if empty or if with some value)

  // The function is triggered by the inputs keyup event in the HTML

function filterTodos(){

    let task = document.getElementById('task').value
    let prio = document.getElementById('priority').value
    let assigned = document.getElementById('assigned').value

    if (!task) task = " "
    if (!prio) prio = " "
    if (!assigned) assigned = " "

    if (task===" " && prio ===" " && assigned == " ") { getData(); return}

   
    getFilteredData(task, prio, assigned)
    showQty('filtered')
}

// This 2 functions take an action from the buttons (minus or plus)
// and change the page or filteredPage

// Then they call the getData or filterTodos, 
// which gets all the data or just the filtered data from db

function showFilteredPage(action){

    if (action==='minus' && filteredPage ==1) return

    filteredPage = action ==='minus'? filteredPage-1: filteredPage + 1

    filterTodos()
   
}

function showPage(action){

    let task = document.getElementById('task').value
    let prio = document.getElementById('priority').value
    let assigned = document.getElementById('assigned').value

    if (task.length > 0 || prio.length > 0 || assigned.length > 0
    ){
        showFilteredPage(action); return}

    if (action==='minus' && (page ==1 && filteredPage==1)) return

        page = action ==='minus'? page-1:page+1 
    

   getData()
   showQty('todos')
}

// Finally this function shows the results quantity 0-10, 10-20...

function showQty(datatype){
    if (datatype==='filtered') document.getElementById('qty').innerHTML = `${(filteredPage*10) -10} to ${filteredPage*10}`
    else {document.getElementById('qty').innerHTML = `${(page*10) -10} to ${page*10}`}
}




