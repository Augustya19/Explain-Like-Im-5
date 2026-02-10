
import React from 'react';
import { ExplanationData } from '../types';
import { LEVEL_CONFIG } from '../constants';

interface HistoryListProps {
  history: ExplanationData[];
  onSelectItem: (item: ExplanationData) => void;
  onClear: () => void;
  activeId?: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectItem, onClear, activeId }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <span className="text-xl">📚</span> Your Learning History
        </h3>
        <button 
          onClick={onClear}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {history.map((item) => {
          const config = LEVEL_CONFIG[item.level];
          const isActive = item.id === activeId;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-50' 
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className="text-xl shrink-0">{config.icon}</span>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 truncate capitalize">{item.topic}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {config.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryList;
