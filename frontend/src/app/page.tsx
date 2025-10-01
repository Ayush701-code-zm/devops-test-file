'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { API_ENDPOINTS, debugAPI } from '@/config/api';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TODOS);
      const data = await response.json();
      
      if (data.success) {
        setTodos(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch todos');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (title: string, description: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.TODOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos([data.data, ...todos]);
        setError(null);
      } else {
        setError(data.error || 'Failed to create todo');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    }
  };

  // Update todo
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TODOS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? data.data : todo
        ));
        setError(null);
      } else {
        setError(data.error || 'Failed to update todo');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TODOS}/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos(todos.filter(todo => todo._id !== id));
        setError(null);
      } else {
        setError(data.error || 'Failed to delete todo');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    // Debug API configuration
    debugAPI();
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0e9d3]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Todo List</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <TodoForm onCreateTodo={createTodo} />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Your Todos</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading todos...</div>
            </div>
          ) : (
            <TodoList 
              todos={todos} 
              onUpdateTodo={updateTodo} 
              onDeleteTodo={deleteTodo} 
            />
          )}
        </div>
      </div>
    </div>
  );
}