
import React from 'react';
import { ExplanationData, ExplanationLevel } from '../types';
import { LEVEL_CONFIG } from '../constants';

interface SidebarProps {
  history: ExplanationData[];
  favorites: ExplanationData[];
  onSelectItem: (item: ExplanationData) => void;
  onGoHome: () => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  activeId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  history, favorites, onSelectItem, onGoHome, onClearHistory, isOpen, onClose, darkMode, onToggleTheme, activeId 
}) => {
  const renderItem = (item: ExplanationData) => {
    const config = LEVEL_CONFIG[item.level];
    const isActive = item.id === activeId;
    return (
      <button
        key={item.id}
        onClick={() => { onSelectItem(item); if(window.innerWidth < 1024) onClose(); }}
        className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        {item.isFavorite && !isActive && (
            <div className="absolute top-2 right-2 text-[10px]">❤️</div>
        )}
        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{config.icon}</span>
        <div className="text-left min-w-0 flex-1">
          <div className={`font-black truncate capitalize text-sm tracking-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
            {item.topic}
          </div>
          <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
            {config.label}
          </div>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-80 glass z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col border-r border-slate-200 dark:border-slate-800/50 shadow-2xl`}>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <button 
            onClick={() => { onGoHome(); if(window.innerWidth < 1024) onClose(); }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20">5</div>
            <span className="font-heading font-black text-2xl tracking-tighter group-hover:text-indigo-600 transition-colors">ELI5 <span className="text-indigo-600 font-light tracking-widest">PRO</span></span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-10 custom-scrollbar">
          <button
            onClick={() => { onGoHome(); if(window.innerWidth < 1024) onClose(); }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black tracking-tight ${
              !activeId ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="uppercase tracking-[0.1em] text-xs">Library Home</span>
          </button>

          {favorites.length > 0 && (
            <section>
              <h3 className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Favorites</h3>
              <div className="space-y-2">{favorites.map(renderItem)}</div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between px-4 mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Recently Learned</h3>
              {history.length > 0 && (
                  <button onClick={onClearHistory} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors">Clear</button>
              )}
            </div>
            <div className="space-y-2">
              {history.length > 0 ? history.map(renderItem) : (
                <div className="px-4 py-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-bold italic leading-relaxed">Your journey begins when you simplify your first concept.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800/50">
           <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 p-5 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 font-black uppercase tracking-widest">Mastery Tip</p>
              </div>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                Try switching to "Intermediate" after mastering a concept in "ELI5".
              </p>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
