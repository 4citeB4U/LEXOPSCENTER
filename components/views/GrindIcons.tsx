import React from 'react';
import { 
  Plus, 
  List, 
  Columns3, 
  Calendar, 
  Grid3X3, 
  BookOpen, 
  Clock, 
  StickyNote, 
  Search, 
  Target 
} from 'lucide-react';

// Modern, consistent icons for the Grind view
export const PlusIcon = () => <Plus className="w-4 h-4" />;
export const LineupIcon = () => <List className="w-4 h-4" />;
export const LanesIcon = () => <Columns3 className="w-4 h-4" />;
export const HorizonIcon = () => <Calendar className="w-4 h-4" />;
export const MatrixIcon = () => <Grid3X3 className="w-4 h-4" />;
export const LedgerIcon = () => <BookOpen className="w-4 h-4" />;

// Small utility icons
export const ClockIcon = () => <Clock className="w-3 h-3" />;
export const NoteIcon = () => <StickyNote className="w-3 h-3" />;
export const ResearchIcon = () => <Search className="w-3 h-3" />;
export const GoalIcon = () => <Target className="w-3 h-3" />;

// Energy icon for assignments
export const EnergyIcon: React.FC<{ energy?: string }> = ({ energy }) => {
  // Map energy levels to colors
  const colorMap: Record<string, string> = {
    low: '#60A5FA', // blue-400
    medium: '#FACC15', // yellow-400
    high: '#22C55E', // green-500
    urgent: '#EF4444', // red-500
  };
  const color = colorMap[energy || 'medium'] || '#FACC15';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="12" height="4" rx="2" fill={color} />
      <rect x="6" y="2" width="4" height="12" rx="2" fill={color} opacity="0.5" />
    </svg>
  );
};
