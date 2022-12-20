todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage = "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    tasks.sort((a, b)=> {
        if (a.dueDate < b.dueDate) {
        return -1;
      } else if (a.dueDate > b.dueDate) {
        return 1;
      } else {
        return 0;
      }});
    todoListElement.innerHTML = '';
     if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      }); 
  }}) 
  };
  

function renderTask({ id, title, description, dueDate , completed}) {
  let html = `
    <li class="select-none mt-2 py-2 border-2 rounded-md text-white  ${completed ? "bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 rounded-md"  : ""} bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 border-white">
      <div class="flex items-center">
      <input type="checkbox" ${completed ? "checked "  : ""} onclick="checkBox(${id})" id="checkBox${id}" name="checkBox" class="checkBox mr-4 mt-6">
        <h3 class="mb-3 flex-1 text-xl font-bold text-white uppercase">${title}</h3>
        <div>
          <span>${dueDate }</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 text-xs text-white border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);
  html += `
    </li>`;
    
  return html;
}


  function checkBox(id){
  const checkBox = document.getElementById(`checkBox${id}`);
if (checkBox.checked){
  const complete = {"completed": true}
  api.update(id, complete).then((data) => renderList()); 
} else if (checkBox.checked == false){
  const incomplete = {"completed": false}
  api.update(id, incomplete).then((data) => renderList());
}
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

renderList();










