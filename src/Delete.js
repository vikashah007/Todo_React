import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [sortCriteria, setSortCriteria] = useState("Default");

  // Add Todos button
  const handleAddToDo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
    };
    let updatedTodoArr = [...allTodos, newTodoItem];
    setAllTodos(updatedTodoArr);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("Medium");
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  // Delete Todos
  const handleDeleteTodo = (index) => {
    let reducedTodo = allTodos.filter((_, i) => i !== index);
    setAllTodos(reducedTodo);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
  };

  // Complete Todos
  const handleComplete = (index) => {
    const completedItem = { ...allTodos[index], completedOn: new Date().toLocaleString() };
    const updatedCompletedArray = [...completedTodos, completedItem];
    setCompletedTodos(updatedCompletedArray);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodolist", JSON.stringify(updatedCompletedArray));
  };

  // Search and Filter
  const filteredTodos = allTodos.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort Todos by Priority
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortCriteria === "Priority") {
      const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  // Store Todos on page load
  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todolist")) || [];
    const savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodolist")) || [];
    setAllTodos(savedTodo);
    setCompletedTodos(savedCompletedTodo);
  }, []);

  return (
    <div className="App">
      <h1>Todo App</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      {/* Sort Dropdown */}
      <select
        onChange={(e) => setSortCriteria(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
      >
        <option value="Default">Sort By</option>
        <option value="Priority">Priority</option>
      </select>

      <div className="todo-input" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task Title"
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task Description"
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        
        <div style={{ marginBottom: "10px" }}>
          <label>Priority</label>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <button
          type="button"
          onClick={handleAddToDo}
          style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#4CAF50", color: "#fff", width: "100%" }}
        >
          Add Task
        </button>
      </div>

      <div className="todo-list" style={{ marginTop: "20px" }}>
        {sortedTodos.map((item, index) => (
          <div
            className="todo-list-item"
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #eee",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p style={{ fontWeight: "bold" }}>Priority: {item.priority}</p>
            </div>
            <div>
              <BsCheckLg
                className="check-icon"
                title="Mark as Completed"
                onClick={() => handleComplete(index)}
                style={{ marginRight: "10px", cursor: "pointer", color: "green" }}
              />
              <AiOutlineDelete
                className="icon"
                title="Delete Task"
                onClick={() => handleDeleteTodo(index)}
                style={{ cursor: "pointer", color: "red" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

{sortedTodos && sortedTodos.map((item, index) => ( 
      <div
        className="todo-list-item"
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #eee",
          alignItems: "center",
        }}
      >
        <div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p style={{ fontWeight: "bold" }}>Priority: {item.priority}</p>
        </div>
        <div>
          <BsCheckLg
            className="check-icon"
            title="Mark as Completed"
            onClick={() => handleComplete(index)}
            style={{ marginRight: "10px", cursor: "pointer", color: "green" }}
          />
          <AiOutlineDelete
            className="icon"
            title="Delete Task"
            onClick={() => handleDeleteTodo(index)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </div>
      </div>
    ))}


    {(search===false && isCompleteScreen===false && show===false) && allTodos.map((item,index)=>{
        return(
          <div className="todo-list-item" key={index}>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p style={{ fontWeight: "bold" }}>Priority: {item.priority}</p>
          </div>
          <div>
            <AiOutlineDelete className="icon" title="Delete?" onClick={()=>handleDeleteTodo(index)}/>
            <BsCheckLg className="check-icon" title="Completed?" onClick={()=>handleComplete(index)}/>
          </div>
          </div>
        )
       })}