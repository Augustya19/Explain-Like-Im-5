
import React, { useState } from 'react';

interface TopicFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter any complex topic..."
          disabled={isLoading}
          className="w-full px-8 py-6 text-xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all duration-300 disabled:opacity-50 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="absolute right-3 top-3 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-[2rem] shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Thinking...
            </>
          ) : 'Simplify'}
        </button>
      </div>
    </form>
  );
};

export default TopicForm;
