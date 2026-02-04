
import React, { useState } from 'react';
import { ExplanationData } from '../types';
import { LEVEL_CONFIG } from '../constants';
import { generateSpeech } from '../services/geminiService';

interface ExplanationCardProps {
  data: ExplanationData;
  onToggleFavorite: (id: string) => void;
}

const Section: React.FC<{ title: string; icon: string; content: string; colorClass: string }> = ({ title, icon, content, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 h-full group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
    <div className="flex items-center gap-3">
      <span className={`p-2.5 rounded-xl ${colorClass} text-white shadow-lg`}>{icon}</span>
      <h3 className="font-heading font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-[11px]">{title}</h3>
    </div>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
      {content}
    </p>
  </div>
);

const ExplanationCard: React.FC<ExplanationCardProps> = ({ data, onToggleFavorite }) => {
  const config = LEVEL_CONFIG[data.level];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePlayAudio = async () => {
    setIsPlaying(true);
    try {
      await generateSpeech(`${data.definition}. For example, ${data.example}`, data.level);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsPlaying(false), 3000); // UI feedback duration
    }
  };

  const handleCopy = () => {
    const text = `ELI5: ${data.topic}\n\nLevel: ${data.level}\nDefinition: ${data.definition}\nAnalogy: ${data.analogy}\nKey Takeaway: ${data.takeaway}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <span className={`${config.bg} ${config.text} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] inline-block shadow-sm`}>
            {config.label} LEVEL
          </span>
          <h2 className="text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white capitalize leading-tight tracking-tight">
            {data.topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
           <button 
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className={`p-4 rounded-2xl glass shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group ${isPlaying ? 'text-indigo-600 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {isPlaying ? '🔊 Playing...' : '🔈 Listen'}
          </button>
          
          <button 
            onClick={handleCopy}
            className="p-4 rounded-2xl glass shadow-sm hover:scale-105 active:scale-95 transition-all text-slate-600 dark:text-slate-400 flex items-center gap-2"
          >
            {isCopied ? '✅ Copied' : '🔗 Share'}
          </button>

          <button 
            onClick={() => onToggleFavorite(data.id)}
            className={`p-4 rounded-2xl glass shadow-sm hover:scale-105 active:scale-95 transition-all ${data.isFavorite ? 'text-rose-500' : 'text-slate-400'}`}
          >
            {data.isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Section 
            title="The Concept" 
            icon="✨" 
            content={data.definition} 
            colorClass={config.color} 
          />
        </div>
        
        <Section 
          title="Visualize It" 
          icon="💡" 
          content={data.analogy} 
          colorClass="bg-amber-500" 
        />
        
        <div className="lg:col-span-1">
          <Section 
            title="Real-World Case" 
            icon="🎯" 
            content={data.example} 
            colorClass="bg-emerald-500" 
          />
        </div>

        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] rounded-[2rem] shadow-xl shadow-indigo-500/10">
            <div className="bg-white dark:bg-slate-950 p-8 md:p-10 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
               <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-4xl shadow-inner shrink-0">
                🧠
              </div>
              <div>
                <h4 className="font-heading font-black text-indigo-600 dark:text-indigo-400 uppercase text-xs tracking-[0.3em] mb-3">Key Takeaway</h4>
                <p className="text-slate-800 dark:text-slate-100 text-2xl md:text-3xl font-heading font-bold italic leading-relaxed">
                  "{data.takeaway}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationCard;
