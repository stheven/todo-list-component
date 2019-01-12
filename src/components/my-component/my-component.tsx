import {Component, State} from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @State() newTask = '';
  @State() filter = 'all';
  @State() onlyCompleted = false;
  @State() onlyNonCompleted = false;
  @State() todoList = [{
    id: 0,
    task: 'React',
    isCompleted: true,
  }, {
    id: 1,
    task: 'Vue',
    isCompleted: true,
  }, {
    id: 2,
    task: 'Angular',
    isCompleted: false,
  }, {
    id: 3,
    task: 'Stencil',
    isCompleted: false,
  }];

  remove = (id) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    todoList.splice(idx, 1);
    this.todoList = todoList
  };

  toggleTodo = (id) => {
    const todoList = [...this.todoList];
    const idx = todoList.findIndex(item => item.id === id);
    todoList[idx].isCompleted = !todoList[idx].isCompleted;
    this.todoList = todoList;
  };

  handleNewTodo = ({target: {value}}: any) => {
    this.newTask = value
  };

  add = e => {
    e.preventDefault();
    if (!!this.newTask) {
      this.todoList = [...this.todoList, {
        id: new Date().getTime(),
        task: this.newTask,
        isCompleted: false
      }];
      this.newTask = '';
    }
  };

  render() {
    let list = [...this.todoList];
    switch (this.filter) {
      case "onlyCompleted":
        list = list.filter(item => item.isCompleted);
        break;
      case "onlyNonCompleted":
        list = list.filter(item => !item.isCompleted);
    }

    return (
      <div class="todo-component">
        <h1 class="todo-title">My To Do List [{this.filter}]</h1>
        <form onSubmit={this.add} class="todo-form">
          <div class="form-wrap">
            <label htmlFor="newTodo">
              <input name="newTodo" placeholder="New to do" id="newTodo" class="newtodo" value={this.newTask}
                     onInput={(e: any) => this.handleNewTodo(e)}/>
            </label>
            <button class="btn btn-add-todo">Add</button>
          </div>
          <ul class="filters">
            <li>
              <label htmlFor="all">
                <input type="radio" class="input-hidden" id="all" value="all" checked={this.filter === "all"}
                       onChange={(e: any) => this.filter = e.target.value}/>
                <span class="input-help"></span>
                All
              </label>
            </li>
            <li>
              <label htmlFor="onlyCompleted">
                <input type="radio" class="input-hidden" id="onlyCompleted" value="onlyCompleted" checked={this.filter === "onlyCompleted"}
                       onChange={(e: any) => this.filter = e.target.value}/>
                <span class="input-help"></span>
                Only Completed
              </label>
            </li>
            <li>
              <label htmlFor="onlyNonCompleted">
                <input type="radio" class="input-hidden" id="onlyNonCompleted" value="onlyNonCompleted"
                       checked={this.filter === "onlyNonCompleted"}
                       onChange={(e: any) => this.filter = e.target.value}/>
                <span class="input-help"></span>
                Only Non Completed
              </label>
            </li>
          </ul>
        </form>
        <ul class="todo-list">
          {list.map((todo, index) => (
            <li key={index} class="todo-item">
              <span class="todo-name">{todo.task}</span>

              <ul class="todo-actions">
                <li>
                  <button class={`btn btn-toggle ${todo.isCompleted ? 'on' : 'off'}`}
                          onClick={() => this.toggleTodo(todo.id)}>{todo.isCompleted ? 'on' : 'off'}</button>
                </li>
                <li>
                  <button class="btn btn-remove" onClick={() => this.remove(todo.id)}>Remove</button>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
