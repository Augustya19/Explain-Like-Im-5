
import React from 'react';
import { ExplanationLevel } from '../types';
import { LEVEL_CONFIG } from '../constants';

interface LevelSelectorProps {
  selected: ExplanationLevel;
  onSelect: (level: ExplanationLevel) => void;
  disabled?: boolean;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl mx-auto">
      {(Object.entries(LEVEL_CONFIG) as [ExplanationLevel, typeof LEVEL_CONFIG.ELI5][]).map(([level, config]) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          disabled={disabled}
          className={`flex-1 p-5 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
            selected === level 
              ? `${config.color} border-transparent shadow-xl shadow-indigo-500/10 text-white scale-[1.02]` 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl filter drop-shadow-md">{config.icon}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${selected === level ? 'bg-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
          </div>
          <div className="font-heading font-black text-xl leading-tight mb-1">{config.label}</div>
          <div className={`text-[11px] font-bold uppercase tracking-widest leading-relaxed ${selected === level ? 'text-white/80' : 'text-slate-400'}`}>
            {config.description}
          </div>
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
