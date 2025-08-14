import React from 'react';
import { AlertTriangle, CheckCircle, Info, Settings } from 'lucide-react';

interface ConfigStatus {
  service: string;
  status: 'configured' | 'missing' | 'optional';
  description: string;
  helpUrl?: string;
}

const ConfigurationStatus: React.FC = () => {
  const configs: ConfigStatus[] = [
    {
      service: 'Google Gemini AI',
      status: import.meta.env.VITE_GEMINI_API_KEY ? 'configured' : 'missing',
      description: 'Required for AI-powered research and analysis',
      helpUrl: 'https://makersuite.google.com/app/apikey'
    },
    {
      service: 'Google Custom Search',
      status: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY ? 'configured' : 'missing',
      description: 'Required for image search and web results',
      helpUrl: 'https://console.cloud.google.com/'
    }
  ];

  const missingConfigs = configs.filter(c => c.status === 'missing');
  const hasMissingConfigs = missingConfigs.length > 0;

  if (!hasMissingConfigs) {
    return null; // Don't show if everything is configured
  }

  return (
    <div className="fixed top-20 right-4 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-accent-fuchsia" />
          <h3 className="font-semibold text-white">Configuration Required</h3>
        </div>
        
        <p className="text-sm text-slate-400 mb-4">
          Some features require API keys to function properly. Configure them to unlock the full potential of LEX.
        </p>

        <div className="space-y-3">
          {configs.map((config) => (
            <div key={config.service} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded">
              {config.status === 'configured' ? (
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              ) : config.status === 'missing' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm">{config.service}</h4>
                <p className="text-xs text-slate-400 mt-1">{config.description}</p>
                
                {config.status === 'missing' && config.helpUrl && (
                  <a
                    href={config.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent-fuchsia hover:text-accent-fuchsia/80 mt-2"
                  >
                    Get API Key →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded text-sm text-blue-300">
          <p className="font-medium mb-1">Quick Setup</p>
          <p className="text-xs">
            1. Copy <code className="bg-slate-700 px-1 rounded">env.local.example</code> to <code className="bg-slate-700 px-1 rounded">.env.local</code><br/>
            2. Add your API keys<br/>
            3. Restart the development server
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-3 px-3 py-2 bg-accent-fuchsia hover:bg-accent-fuchsia/80 text-white rounded text-sm font-medium transition-colors"
        >
          Reload After Configuration
        </button>
      </div>
    </div>
  );
};

export default ConfigurationStatus;
