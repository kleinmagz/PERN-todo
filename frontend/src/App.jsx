import { useState, useEffect } from "react";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { API_URL } from "./api.js";
import axios from "axios";

export default function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null); // stores the id of the toDo that is being edited on.
  const [editedText, setEditedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      console.log(response.data);
    } catch (err) {
      console.err(err.message);
      setError("Failed to fetch todos. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/todos`, {
        description,
        completed: false,
      });
      console.log(res.data.todo);
      setDescription("");
      setTodos([...todos, res.data.todo]);
      //getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to add todo. Please try again.");
    }
  };

  const saveEdit = async (id) => {
    try {
      setError(null);
      const originalTodo = todos.find((todo) => todo.todo_id === id);
      const currentDescription = editedText.trim();
      if (originalTodo.description === currentDescription) {
        setEditedText("");
        setEditingTodo(null);
        return;
      }
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`${API_URL}/todos/${id}`, {
        description: editedText,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id
            ? { ...todo, description: editedText, completed: !todo.completed }
            : todo,
        ),
      );
      setEditedText("");
      setEditingTodo(null);
      // getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo. Please try again");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
      // omited, probably to minimize database accesses.
      // getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const toggleCompleted = async (id) => {
    try {
      setError(null);
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`${API_URL}/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
      // omitted to reducce database calls
      // getTodos();
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">PERN TODO APP</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
        >
          <input
            className="flex-1 outline-none px-3 py-4 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="What needs to be done?"
            required
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:cursor-pointer">
            Add Task
          </button>
        </form>
        <div>
          {isLoading ? (
            <div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <p>No tasks available. Add a new task</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => {
                return (
                  <div key={todo.todo_id} className="pb-4">
                    {editingTodo === todo.todo_id ? (
                      <div className="flex items-center gap-x-3">
                        <input
                          className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                          type="text"
                          value={editedText}
                          onChange={(e) => {
                            setEditedText(e.target.value);
                          }}
                        />
                        <div>
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200"
                            onClick={() => saveEdit(todo.todo_id)}
                          >
                            <MdOutlineDone />
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 mt-2 hover:bg-gray-600 duration-200"
                            onClick={() => setEditingTodo(null)}
                          >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center">
                        <div className="flex flex-1 items-center gap-x-4 overflow-hidden">
                          <button
                            className={`shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-400"}`}
                            onClick={() => toggleCompleted(todo.todo_id)}
                          >
                            {todo.completed && <MdOutlineDone size={16} />}
                          </button>
                          <span>{todo.description}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => {
                              setEditingTodo(todo.todo_id);
                              setEditedText(todo.description);
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                            onClick={() => deleteTodo(todo.todo_id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
