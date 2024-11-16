import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setComletedTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [sortCriteria, setSortCriteria] = useState("Default");

  // add Todos button
  const handleAddToDo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
    };
    if (!newTitle.trim()) {
      toast.warn("Title cannot be empty!");
      return;
    }
    if (!newDescription.trim()) {
      toast.warn("Description cannot be empty!");
      return;
    }
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setAllTodos(updatedTodoArr);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("Medium");
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
    toast.success("Todo Added Succesfully")
  };

  // delete Todos
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    setAllTodos(reducedTodo);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
  };

  // Search and Filter
  const filteredTodos = allTodos.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort Todos by Priority
  const sortedTodos =
    sortCriteria === "Priority"
      ? [...filteredTodos].sort((a, b) => {
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
      : filteredTodos;

  // Completed TODOs
  const handleComplete = (index) => {
    let now = new Date();
    let d = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let s = now.getSeconds();
    let m = now.getMinutes();
    let h = now.getHours();
    let completedOn = d + "-" + mm + "-" + yyyy + "at " + h + ":" + m + ":" + s;

    let filteredItems = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArray = [...completedTodos];
    updatedCompletedArray.push(filteredItems);
    setComletedTodos(updatedCompletedArray);
    handleDeleteTodo(index);
    localStorage.setItem(
      "completedTodolist",
      JSON.stringify(updatedCompletedArray)
    );
  };

  // Deleting Completed todos
  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    setComletedTodos(reducedTodo);
    localStorage.setItem("completedTodolist", JSON.stringify(reducedTodo));
  };

  // Store Todos when page refresh
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(
      localStorage.getItem("completedTodolist")
    );
    if (savedTodo) {
      setAllTodos(savedTodo);
    }
    if (savedCompletedTodo) {
      setComletedTodos(savedCompletedTodo);
    }
  }, []);

  return (
    <div className="App">
      <h1>Todo App</h1>

      {!isCompleteScreen && (
        <div className="header">
          <input
            type="text"
            placeholder="Search tasks..."
            className="todoSearchbar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Update search term
            }}
          />

          {/* Sort Dropdown */}
          <select
            onChange={(e) => {
              setSortCriteria(e.target.value);
            }}
            className="todoPriority"
          >
            <option value="Default">Default</option>
            <option value="Priority">Priority</option>
          </select>
        </div>
      )}

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the Task Title"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the Task Description"
            />
          </div>
          <div className="btnpriority">
            <div className="todo-input-item ">
              <label>Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="">
              <button
                type="button"
                onClick={handleAddToDo}
                className="primaryBtn"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={isCompleteScreen === false ? "active" : "secondaryBtn"}
            onClick={() => {
              setIsCompleteScreen(false);
            }}
          >
            Todo
          </button>
          <button
            className={isCompleteScreen === true ? "active" : "secondaryBtn"}
            onClick={() => {
              setIsCompleteScreen(true);
              setSortCriteria("Default");
              setSearchTerm("");
            }}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {(sortCriteria !== "Default" || searchTerm.length !== 0) &&
            sortedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p style={{ fontWeight: "bold" }}>
                    Priority: {item.priority}
                  </p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    title="Delete?"
                    onClick={() => handleDeleteTodo(index)}
                  />
                  <BsCheckLg
                    className="check-icon"
                    title="Completed?"
                    onClick={() => handleComplete(index)}
                  />
                </div>
              </div>
            ))}

          {isCompleteScreen === false &&
            sortCriteria === "Default" &&
            searchTerm.length === 0 &&
            allTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p style={{ fontWeight: "bold" }}>
                      Priority: {item.priority}
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      title="Delete?"
                      onClick={() => handleDeleteTodo(index)}
                    />
                    <BsCheckLg
                      className="check-icon"
                      title="Completed?"
                      onClick={() => handleComplete(index)}
                    />
                  </div>
                </div>
              );
            })}
          {isCompleteScreen === true &&
            sortCriteria === "Default" &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <i>Completed on: {item.completedOn}</i>
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      title="Delete?"
                      onClick={() => handleDeleteCompletedTodo(index)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <ToastContainer position="top-center"/>
    </div>
  );
}

export default App;
