
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, ExplanationLevel, ExplanationData } from './types';
import { fetchExplanation } from './services/geminiService';
import TopicForm from './components/TopicForm';
import LevelSelector from './components/LevelSelector';
import ExplanationCard from './components/ExplanationCard';
import Sidebar from './components/Sidebar';

const STORAGE_KEY = 'eli5_learning_history_pro_v2';

const SkeletonLoader = () => (
  <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
    <div className="space-y-4 px-4">
      <div className="h-4 w-32 skeleton rounded-full" />
      <div className="h-20 w-3/4 skeleton rounded-3xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="h-80 skeleton rounded-[2.5rem] md:col-span-2" />
      <div className="h-80 skeleton rounded-[2.5rem]" />
      <div className="h-40 skeleton rounded-[2.5rem] md:col-span-3" />
    </div>
  </div>
);

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
        <span className="text-xl">✨</span>
        <span className="font-bold text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const history = saved ? JSON.parse(saved) : [];
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return {
      topic: '',
      level: ExplanationLevel.ELI5,
      loading: false,
      error: null,
      result: null,
      history,
      darkMode,
      sidebarOpen: false,
      isAudioPlaying: false
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
    if (state.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.history, state.darkMode]);

  const toggleTheme = () => setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  
  const handleGoHome = () => {
    setState(prev => ({ ...prev, result: null, topic: '', error: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerSearch = async (topic: string, level: ExplanationLevel) => {
    setState(prev => ({ ...prev, topic, loading: true, error: null }));
    try {
      const data = await fetchExplanation(topic, level);
      setState(prev => {
        const filteredHistory = prev.history.filter(h => !(h.topic === topic && h.level === level));
        return { 
          ...prev, 
          result: data, 
          loading: false,
          history: [data, ...filteredHistory].slice(0, 15)
        };
      });
      setToast('Concept simplified!');
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Failed to generate explanation. Try a more specific topic!" }));
    }
  };

  const handleToggleFavorite = (id: string) => {
    setState(prev => {
      const isAlreadyFavorite = prev.history.find(h => h.id === id)?.isFavorite;
      const newHistory = prev.history.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      const newResult = prev.result?.id === id ? { ...prev.result, isFavorite: !prev.result.isFavorite } : prev.result;
      if (!isAlreadyFavorite) setToast('Added to Favorites ❤️');
      return { ...prev, history: newHistory, result: newResult };
    });
  };

  const favorites = state.history.filter(h => h.isFavorite);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
      <Sidebar 
        history={state.history} 
        favorites={favorites}
        onSelectItem={(item) => setState(prev => ({ ...prev, result: item, topic: item.topic, level: item.level }))}
        onGoHome={handleGoHome}
        isOpen={state.sidebarOpen}
        onClose={() => setState(prev => ({ ...prev, sidebarOpen: false }))}
        darkMode={state.darkMode}
        onToggleTheme={toggleTheme}
        activeId={state.result?.id}
        onClearHistory={() => {
            if(confirm('Wipe all history?')) {
                setState(prev => ({ ...prev, history: [], result: null }));
                localStorage.removeItem(STORAGE_KEY);
            }
        }}
      />

      <main className="flex-1 lg:ml-80 transition-all duration-300">
        <nav className="sticky top-0 z-30 glass px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setState(prev => ({ ...prev, sidebarOpen: true }))}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
            
            {state.result && (
              <button 
                onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all group rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back
              </button>
            )}
          </div>

          <div className="hidden md:block">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              {state.result ? 'Topic Insight' : 'Simplified Intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800/50 uppercase tracking-widest">
              {state.history.length} Saved
            </div>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xl"
              title="Toggle Theme"
            >
              {state.darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 pb-32">
          {/* Hero Section */}
          {!state.result && !state.loading && (
            <div className="text-center py-12 md:py-24 animate-in fade-in zoom-in duration-700">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-500 to-violet-700 rounded-[3rem] text-white text-6xl mb-10 shadow-2xl shadow-indigo-500/30 font-black italic animate-float">
                5
              </div>
              <h1 className="text-6xl md:text-8xl font-heading font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
                Explain Anything. <br/><span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-900 decoration-8 underline-offset-8">Instantly.</span>
              </h1>
              <p className="text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                Complex physics, market economics, or AI—broken down into simple analogies even a child can grasp.
              </p>
            </div>
          )}

          <div className={`transition-all duration-700 ${state.result ? 'sticky top-[84px] z-20' : ''}`}>
            <TopicForm onSubmit={(t) => triggerSearch(t, state.level)} isLoading={state.loading} />
          </div>

          <LevelSelector 
            selected={state.level} 
            onSelect={(l) => {
              setState(prev => ({ ...prev, level: l }));
              if (state.result) triggerSearch(state.result.topic, l);
            }} 
            disabled={state.loading} 
          />

          <section className="pt-12 min-h-[400px]">
            {state.error && (
              <div className="max-w-2xl mx-auto p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-[2.5rem] text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-black mb-2">Something went wrong</h3>
                <p className="font-bold opacity-80">{state.error}</p>
              </div>
            )}

            {state.loading && <SkeletonLoader />}

            {!state.loading && state.result && (
              <ExplanationCard data={state.result} onToggleFavorite={handleToggleFavorite} />
            )}

            {!state.loading && !state.result && !state.error && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pointer-events-none select-none">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-48 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-4xl">
                            {['💡', '✨', '🧠'][i-1]}
                        </div>
                    ))}
                 </div>
            )}
          </section>
        </div>
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
