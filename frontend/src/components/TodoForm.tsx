'use client';

import { useState } from 'react';

interface TodoFormProps {
  onCreateTodo: (title: string, description: string) => void;
}

export default function TodoForm({ onCreateTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a todo title');
      return;
    }

    onCreateTodo(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-[#f5cd4c] p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title..."
            className="w-full px-4 py-3 border-2 border-black rounded-lg bg-[#f0e9d3] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            className="w-full px-4 py-3 border-2 border-black rounded-lg bg-[#f0e9d3] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-[#f0e9d3] py-3 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors duration-200"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
