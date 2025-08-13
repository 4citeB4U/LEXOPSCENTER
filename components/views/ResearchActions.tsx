import React, { useState } from 'react';
import { IntelResult } from '../../types';

interface ResearchActionsProps {
  research: IntelResult;
  onSendToIntel?: (research: IntelResult) => void;
  onSendToLab?: (research: IntelResult) => void;
  onSendToMagnaCarta?: (research: IntelResult) => void;
  onSendToGrind?: (research: IntelResult) => void;
  onSendToAnalyzer?: (research: IntelResult) => void;
}

const ResearchActions: React.FC<ResearchActionsProps> = ({
  research,
  onSendToIntel,
  onSendToLab,
  onSendToMagnaCarta,
  onSendToGrind,
  onSendToAnalyzer
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  const handleSendTo = async (destination: string, action: (research: IntelResult) => void) => {
    setSendingTo(destination);
    try {
      await action(research);
      // Show success feedback
      setTimeout(() => setSendingTo(null), 2000);
    } catch (error) {
      console.error(`Error sending to ${destination}:`, error);
      setSendingTo(null);
    }
  };

  const actionButtons = [
    {
      key: 'intel',
      label: 'Intel',
      icon: '🔍',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onSendToIntel,
      description: 'Add to intelligence database'
    },
    {
      key: 'lab',
      label: 'Lab',
      icon: '🧪',
      color: 'bg-green-600 hover:bg-green-700',
      action: onSendToLab,
      description: 'Save to research lab notes'
    },
    {
      key: 'magna-carta',
      label: 'Magna Carta',
      icon: '📜',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: onSendToMagnaCarta,
      description: 'Add to strategic planning'
    },
    {
      key: 'grind',
      label: 'Grind',
      icon: '⚡',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: onSendToGrind,
      description: 'Add to daily grind tasks'
    },
    {
      key: 'analyzer',
      label: 'Analyzer',
      icon: '📊',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: onSendToAnalyzer,
      description: 'Send for deep analysis'
    }
  ];

  return (
    <div className="mt-3">
      {/* Main Action Bar */}
      <div className="flex flex-wrap gap-2 mb-3">
        {actionButtons.map(({ key, label, icon, color, action, description }) => (
          <button
            key={key}
            onClick={() => action && handleSendTo(key, action)}
            disabled={!action || sendingTo === key}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-medium transition-all duration-200 text-sm ${color} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
            title={description}
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
            {sendingTo === key && (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
        ))}
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium transition-colors duration-200 text-sm"
        >
          <span>{isExpanded ? '−' : '+'}</span>
          <span>More</span>
        </button>
      </div>

      {/* Expanded Actions Panel */}
      {isExpanded && (
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
          <h4 className="text-sm font-semibold text-text-light mb-3 flex items-center">Research Actions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Quick Actions */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text-dark uppercase tracking-wide">Quick Actions</h5>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigator.clipboard.writeText(research.analysis)}
                  className="w-full flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                >
                  <span className="text-xs text-text-light">Copy Analysis</span>
                  <span className="text-text-dark">📋</span>
                </button>
                
                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(research.query)}`, '_blank')}
                  className="w-full flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                >
                  <span className="text-xs text-text-light">Google Search</span>
                  <span className="text-text-dark">🔍</span>
                </button>
                
                <button
                  onClick={() => window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(research.query)}`, '_blank')}
                  className="w-full flex items-center justify-between p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                >
                  <span className="text-xs text-text-light">Google Scholar</span>
                  <span className="text-text-dark">📚</span>
                </button>
              </div>
            </div>

            {/* Research Details */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-text-dark uppercase tracking-wide">Research Info</h5>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-dark">Query:</span>
                  <span className="text-text-light font-medium">{research.query}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-dark">Images:</span>
                  <span className="text-text-light">{research.images.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-dark">Sources:</span>
                  <span className="text-text-light">{research.sources.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-dark">Timestamp:</span>
                  <span className="text-text-light">{new Date(research.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-3 pt-3 border-t border-slate-600">
            <h5 className="text-xs font-medium text-text-dark uppercase tracking-wide mb-2">Export Options</h5>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(research, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `research-${research.query.replace(/[^a-z0-9]/gi, '-')}.json`;
                  link.click();
                }}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-xs text-text-light transition-colors duration-200"
              >
                📄 Export JSON
              </button>
              
              <button
                onClick={() => {
                  const text = `Research: ${research.query}\n\n${research.analysis}\n\nSources: ${research.sources.map(s => s.title).join(', ')}`;
                  const dataBlob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `research-${research.query.replace(/[^a-z0-9]/gi, '-')}.txt`;
                  link.click();
                }}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-xs text-text-light transition-colors duration-200"
              >
                📝 Export Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchActions;
