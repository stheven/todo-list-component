import { Component, State } from '@stencil/core';

const LOCAL_NAME = `todo-list-component`;

@Component({
  tag: 'app-todo',
  styleUrl: 'app-todo.css',
  shadow: true
})
export class AppTodo {
  @State() newTask = '';
  @State() filter = 'all';
  @State() onlyCompleted = false;
  @State() onlyNonCompleted = false;
  @State() todoList = [{
    id: 0,
    task: 'React',
    isEditing: false,
    isCompleted: true,
  }, {
    id: 1,
    task: 'Vue',
    isEditing: false,
    isCompleted: true,
  }, {
    id: 2,
    task: 'Angular',
    isEditing: false,
    isCompleted: false,
  }, {
    id: 3,
    task: 'Stencil',
    isEditing: false,
    isCompleted: false,
  }];

  componentWillLoad(){
    this.todoList = JSON.parse(localStorage.getItem(`${LOCAL_NAME}`)) || []
  }

  remove = (id: number) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    todoList.splice(idx, 1);
    this.todoList = todoList;

    this.saveLocally();
  };

  toggleTodo = (id: number) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    todoList[idx].isCompleted = !todoList[idx].isCompleted;
    this.todoList = todoList;

    this.saveLocally();
  };

  handleNewTodo = ({ target: { value } }: any) => {
    this.newTask = value
  };

  editTodo = (id) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    todoList[idx].isEditing = true;
    this.todoList = todoList;
  }

  add = (e: any) => {
    e.preventDefault();
    if (!!this.newTask) {
      this.todoList = [...this.todoList, {
        id: new Date().getTime(),
        task: this.newTask,
        isCompleted: false,
        isEditing: false,
      }];
      this.newTask = '';

      this.saveLocally();
    }
  };

  handleChangeTodo = (e: any, id: number) => {
    if (e.keyCode === 13) {
      this.saveTodo(id)
    } else {
      const todoList = [...this.todoList];
      const idx = todoList.findIndex(item => item.id === id);
      todoList[idx].task = e.target.value;
      this.todoList = todoList;
    }
  }

  saveTodo = (id: number) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    if (!todoList[idx].task.trim().length) {
      this.remove(id);
    } else {
      todoList[idx].isEditing = false;
      this.todoList = todoList;
    }

    this.saveLocally();
  }

  saveLocally = () => {
    localStorage.setItem(`${LOCAL_NAME}`, JSON.stringify(this.todoList));
  }

  render() {
    let list = [...this.todoList];
    switch (this.filter) {
      case "completed":
        list = list.filter(item => item.isCompleted);
        break;
      case "inProgress":
        list = list.filter(item => !item.isCompleted);
    }

    return (
      <div class="todo-component">
      <div class="header">
          <h1 class="todo-title">My To Do List</h1>
          {this.filter !== "all" && <p>{this.filter}</p>}
      </div>

        <form onSubmit={this.add} class="todo-form">
          <div class="form-wrap">
            <label htmlFor="newTodo">
              <input name="newTodo" placeholder="New to do" id="newTodo" class="newtodo" value={this.newTask}
                onInput={(e: any) => this.handleNewTodo(e)} />
            </label>
            <button class="btn btn-add-todo">Add</button>
          </div>
          <ul class="filters">
            <li>
              <label htmlFor="all">
                <input type="radio" class="input-hidden" id="all" value="all" checked={this.filter === "all"}
                  onChange={(e: any) => this.filter = e.target.value} />
                <span class="input-help"></span>
                All
              </label>
            </li>
            <li>
              <label htmlFor="completed">
                <input type="radio" class="input-hidden" id="completed" value="completed"
                  checked={this.filter === "completed"}
                  onChange={(e: any) => this.filter = e.target.value} />
                <span class="input-help"></span>
                Completed
              </label>
            </li>
            <li>
              <label htmlFor="inProgress">
                <input type="radio" class="input-hidden" id="inProgress" value="inProgress"
                  checked={this.filter === "inProgress"}
                  onChange={(e: any) => this.filter = e.target.value} />
                <span class="input-help"></span>
                In Progress
              </label>
            </li>
          </ul>
        </form>
        <ul class="todo-list">
          {list.map((todo, index) => (
            <li key={index} class="todo-item">
              <label class="isCompleted" htmlFor={`todo-id-${todo.id}`}>
                <input type="checkbox" id={`todo-id-${todo.id}`} checked={!!todo.isCompleted} onChange={() => this.toggleTodo(todo.id)} />
                <span></span>
              </label>
              <div class="todo-name">
                {todo.isEditing ? <div class="edit-wrapper">
                  <input type="text" value={todo.task} onKeyUp={(e: KeyboardEvent) => this.handleChangeTodo(e, todo.id)} />
                  <a href="javascript:void(0)" onClick={() => this.saveTodo(todo.id)}>Save</a>
                </div> : <a href="javascript:void(0)" class="btn btn-edit-name" onClick={() => this.editTodo(todo.id)}>{todo.task}</a>}
              </div>
              <a class="btn btn-remove" onClick={() => this.remove(todo.id)}>
                x
              </a>
            </li>
          ))}
        </ul>
        <p>{list.length} Task{list.length !== 1 ? "s" : ""}</p>
      </div>
    )
  }
}
