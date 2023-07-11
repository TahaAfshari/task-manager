const submitBtn = document.getElementById("form__button-submit"),
  todoTitleInput = document.getElementById("form__input-title"),
  todoDateInput = document.getElementById("form__input-date"),
  todoDescriptionInput = document.getElementById("form__input-description"),
  taskBoard = document.querySelector("#board-task .taskContainer"),
  doingBoard = document.querySelector("#board-doing .taskContainer"),
  completedBoard = document.querySelector("#board-completed .taskContainer"),
  modalBtn = document.getElementById("modal__button"),
  modal = document.getElementById("modal"),
  modalTitle = document.getElementById("modal__title"),
  modalDate = document.getElementById("modal__date"),
  modalStatus = document.getElementById("modal__status"),
  modalDescription = document.getElementById("modal__description"),
  mainContainer = document.getElementById("mainContainer");

submitBtn.addEventListener("click", addTodoFunction);
modalBtn.addEventListener("click", fadeModal);

function addTodoFunction() {
  if (
    todoTitleInput.value &&
    todoDateInput.value &&
    todoDescriptionInput.value
  ) {
    // alert(new Date(todoDateInput.value).getTime());
    todoApp.addTodo(
      todoTitleInput.value,
      todoDescriptionInput.value,
      new Date(todoDateInput.value).getTime(),
      0
    );
  } else {
    alert("Please fill all feilds");
  }
}

const todoApp = {
  getData: function () {
    return JSON.parse(localStorage.getItem("todoData")) ?? [];
  },
  setData: function (data) {
    const todoData = [...this.getData(), data];
    localStorage.setItem("todoData", JSON.stringify(todoData));
    render();
  },
  genId: function () {
    return Date.now().toString(36);
  },
  addTodo: function (todoTitle, todoDesc, todoDate, todoStatus) {
    const todo = {
      id: this.genId(),
      title: todoTitle,
      description: todoDesc,
      date: todoDate,
      status: todoStatus,
    };

    this.setData(todo);
  },
  removeTodo: function (id) {
    const todoData = this.getData();
    const newTodoData = todoData && todoData.filter((item) => item.id !== id);
    localStorage.setItem("todoData", JSON.stringify(newTodoData));
    render();
  },
  editTodo: function (id, newStatus) {
    const todoData = this.getData();
    const newTodoData = todoData.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      } else {
        return { ...item };
      }
    });

    localStorage.setItem("todoData", JSON.stringify(newTodoData));
    render();
  },
};

const render = () => {
  taskBoard.innerHTML = "";
  doingBoard.innerHTML = "";
  completedBoard.innerHTML = "";
  const allTasks = todoApp.getData();
  console.log(allTasks);
  if (allTasks.length > 0) {
    allTasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task";
      const taskInformationDiv = document.createElement("div");
      taskInformationDiv.classList = "taskinformation";
      const todoTitleP = document.createElement("p");
      todoTitleP.className = "todoTitle";
      todoTitleP.innerText = task.title;
      taskInformationDiv.append(todoTitleP);
      const todoDateP = document.createElement("p");
      todoDateP.className = "todoDate";
      const dateObj = new Date(task.date);
      todoDateP.innerText = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
      taskInformationDiv.append(todoDateP);
      const taskButtonGroupDiv = document.createElement("div");
      taskButtonGroupDiv.className = "taskButtonGroup";
      taskButtonGroupDiv.innerHTML = `<div class="taskButton" onclick="stepDown('${task.id}', ${task.status})"><i class="bi bi-dash"></i></div>
      <div class="taskButton" onclick="showInfo('${task.id}')">
        <i class="bi bi-info-circle"></i>
      </div>
      <div class="taskButton" onclick="stepUp('${task.id}', ${task.status})"><i class="bi bi-check2"></i></div>`;
      taskInformationDiv.append(taskButtonGroupDiv);
      taskDiv.append(taskInformationDiv);
      const taskCloseDiv = document.createElement("div");
      taskCloseDiv.className = "taskClose";
      taskCloseDiv.innerHTML = `<i class="bi bi-x-lg"></i>`;
      taskCloseDiv.addEventListener("click", () => todoApp.removeTodo(task.id));
      taskDiv.append(taskCloseDiv);
      if (task.status == 0) taskBoard.append(taskDiv);
      else if (task.status == 1) doingBoard.append(taskDiv);
      else completedBoard.append(taskDiv);
    });
  }
};

function stepDown(todoId, todoStatus) {
  if (todoStatus > 0) todoApp.editTodo(todoId, --todoStatus);
}

function stepUp(todoId, todoStatus) {
  if (todoStatus < 2) todoApp.editTodo(todoId, ++todoStatus);
}

function showInfo(todoId) {
  const allTasks = todoApp.getData();
  const allStatus = ["Todo", "Doing", "Completed"];
  allTasks.forEach((element) => {
    if (element.id == todoId) {
      modalTitle.innerText = `Title: ${element.title}`;
      const dateObj = new Date(element.date);
      modalDate.innerText = `Date: ${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
      modalStatus.innerText = `Status: ${allStatus[element.status]}`;
      modalDescription.innerText = `Description: ${element.description}`;
      modal.classList.remove("d-none");
      mainContainer.style.filter = "blur(8px)";
    }
  });
}

function fadeModal() {
  modal.classList.add("d-none");
  mainContainer.style.filter = "none";
}

render();
