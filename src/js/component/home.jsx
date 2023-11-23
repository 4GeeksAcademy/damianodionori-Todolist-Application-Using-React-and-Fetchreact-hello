import React, { useState, useEffect, useRef } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const url = "https://playground.4geeks.com/apis/fake/todos/user/damianodionori";
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(url, {
      method: "POST", // post to create
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([])
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else if (resp.status === 409 || resp.status === 400) {
          return fetchData();
        } else {
          throw new Error("Error creating user " + resp.status);
        }
      })
      .then(data => setTasks(data))
      .catch(error => console.error("error creating user", error));
  }, []);

  const fetchData = () => {
    // Fetch info from user
    fetch(url)
      .then(resp => resp.json())
      .then(data => setTasks(data))
      .catch(error => console.error(error));
  };

  const updateTaskList = (newTaskList) => {
    setTasks(newTaskList);
    fetch(url, {
      method: "PUT", // post to create
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskList)
    })
  };

  const addTask = () => {
    if (taskInput.trim() !== '') {
      updateTaskList([...tasks, { label: taskInput, done: false }]);
      setTaskInput('');
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const removeTask = (index) => {
    updateTaskList(tasks.filter((_, i) => i !== index));
  };

  const clearAllTasks = () => {
    updateTaskList([]);
  };

  return (
    <div id='todo-list'>
      <h1>Things to do</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          ref={inputRef}
        />
        <button className="add-task-button" type="submit">Add Task</button>
      </form>
      <ul id="task-list" className='sidebar'>
        {tasks && tasks.length === 0 ? (
          <p id="no-tasks">No tasks, add a task</p>
        ) : (
          tasks && tasks.map((task, index) => (
            <li key={index}>
              <span>{task.label}</span>
              <span className="delete-task" onClick={() => removeTask(index)}>
                ❌
              </span>
            </li>
          ))
        )}
      </ul>
      <div className='item-count-and-clear'>
        {tasks && tasks.length > 0 && (
          <button onClick={clearAllTasks} className="clear-all-button">Clear All Tasks</button>
        )}
        {tasks && tasks.length > 0 && (
          <div className="item-count">
            {tasks.length === 1 ? `1 item left` : `${tasks.length} items left`}
          </div>
        )}
      </div>
    </div>
  );
}