'use client';

import { useState } from 'react';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
}

export default function TodoList({ todos, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleToggleComplete = (id: string, completed: boolean) => {
    onUpdateTodo(id, { completed });
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    onUpdateTodo(id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });
    
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDeleteTodo(id);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`bg-[#f0e9d3] border-2 border-[#f5cd4c] rounded-lg p-6 transition-all duration-200 hover:shadow-lg ${
            todo.completed ? 'opacity-75 bg-[#f5cd4c]' : ''
          }`}
        >
          {editingId === todo._id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                placeholder="Todo title"
              />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded bg-white text-black"
                placeholder="Description"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(todo._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => handleToggleComplete(todo._id, e.target.checked)}
                    className="w-5 h-5 text-black border-2 border-black rounded focus:ring-black"
                  />
                  <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-600' : 'text-black'}`}>
                    {todo.title}
                  </h3>
                </div>
                {todo.description && (
                  <p className={`text-sm ml-8 ${todo.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                    {todo.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-8 mt-2">
                  Created: {new Date(todo.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(todo)}
                  className="bg-[#f5cd4c] text-black px-3 py-1 rounded border-2 border-black hover:bg-black hover:text-[#f5cd4c] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
