
import { ExplanationLevel } from './types';

export const LEVEL_CONFIG = {
  [ExplanationLevel.ELI5]: {
    label: 'Like I\'m 5',
    description: 'Ultra-simple, no jargon, playground analogies.',
    color: 'bg-rose-500',
    hover: 'hover:bg-rose-600',
    text: 'text-rose-500',
    bg: 'bg-rose-50',
    icon: '👶'
  },
  [ExplanationLevel.BEGINNER]: {
    label: 'Beginner',
    description: 'Clear definitions and basic everyday examples.',
    color: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-blue-500',
    bg: 'bg-blue-50',
    icon: '🌱'
  },
  [ExplanationLevel.INTERMEDIATE]: {
    label: 'Intermediate',
    description: 'Structured logic with some technical context.',
    color: 'bg-indigo-600',
    hover: 'hover:bg-indigo-700',
    text: 'text-indigo-600',
    bg: 'bg-indigo-50',
    icon: '🚀'
  }
};

export const PROMPTS = {
  [ExplanationLevel.ELI5]: `Explain the topic to a 5-year-old child. 
    Use absolute zero jargon. Use analogies related to toys, snacks, or playground activities. 
    The tone should be warm and magical.`,
  [ExplanationLevel.BEGINNER]: `Explain the topic to someone with no prior knowledge. 
    Use clear, plain English. Avoid deep technical theory but provide a solid conceptual foundation. 
    Include a helpful everyday analogy.`,
  [ExplanationLevel.INTERMEDIATE]: `Explain the topic to a curious student or professional. 
    Use correct terminology where necessary but explain it. 
    Focus on structure, how things work under the hood, and practical applications.`
};
