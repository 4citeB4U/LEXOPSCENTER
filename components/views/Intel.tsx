import React, { useState, useRef, useEffect } from 'react';
import { runImageOnly, primeLexIntelImages } from '../../src/lib/lexintelImages';
import { makeInputDictationEnabled } from '../../services/universalDictation';
import { Search, History, Save, Trash2, BookOpen } from 'lucide-react';

interface PastSearch {
  id: string;
  query: string;
  timestamp: Date;
  results: {
    web: any[];
    images: any[];
    duckDuckGo: any;
  };
  saved: boolean;
}

export default function Intel() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'web' | 'images'>('web');
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [pastSearches, setPastSearches] = useState<PastSearch[]>([]);
  const [selectedSearch, setSelectedSearch] = useState<PastSearch | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load past searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lexintel-past-searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPastSearches(parsed.map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load past searches:', e);
      }
    }
  }, []);

  // Save past searches to localStorage
  useEffect(() => {
    localStorage.setItem('lexintel-past-searches', JSON.stringify(pastSearches));
  }, [pastSearches]);

  // Make search input dictation-enabled
  useEffect(() => {
    if (searchInputRef.current) {
      makeInputDictationEnabled(searchInputRef.current);
    }
  }, []);

  // Prime image search
  useEffect(() => {
    primeLexIntelImages();
  }, []);

  const executeGoogleSearch = (searchQuery: string) => {
    console.log('Executing Google search for:', searchQuery);
    
    // Execute web search
    if (window.google?.search?.cse?.element) {
      const webEl = window.google.search.cse.element.getElement('lexintel-results');
      if (webEl) {
        webEl.execute(searchQuery);
      }
    }

    // Execute image search
    runImageOnly(searchQuery);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchStatus('Executing comprehensive search...');

    try {
      // Execute both web and image search simultaneously
      executeGoogleSearch(query);

      // Get DuckDuckGo insights
      setSearchStatus('Getting additional insights...');
      const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&no_redirect=1&t=lexintel`);
      const ddgData = await ddgResponse.json();

      // Create new past search entry
      const newSearch: PastSearch = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
        results: {
          web: [], // Google CSE will populate this
          images: [], // Google CSE will populate this
          duckDuckGo: ddgData
        },
        saved: false
      };

      setPastSearches(prev => [newSearch, ...prev.slice(0, 19)]); // Keep last 20 searches
      setSelectedSearch(newSearch);
      setSearchStatus('Search completed successfully!');

    } catch (error) {
      console.error('Search error:', error);
      setSearchStatus('Search completed with some issues');
    } finally {
      setLoading(false);
      setTimeout(() => setSearchStatus(''), 3000);
    }
  };

  const saveSearch = (search: PastSearch) => {
    setPastSearches(prev => 
      prev.map(s => 
        s.id === search.id ? { ...s, saved: true } : s
      )
    );
    
    // Save to Lab (you can implement Lab storage logic here)
    console.log('Saving search to Lab:', search);
  };

  const deleteSearch = (searchId: string) => {
    setPastSearches(prev => prev.filter(s => s.id !== searchId));
    if (selectedSearch?.id === searchId) {
      setSelectedSearch(null);
    }
  };

  const loadSearch = (search: PastSearch) => {
    setQuery(search.query);
    setSelectedSearch(search);
    executeGoogleSearch(search.query);
  };

  return (
    <div className="flex h-full bg-slate-900">
      {/* Past Searches Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-accent-fuchsia" />
          <h2 className="text-lg font-semibold text-white">Past Searches</h2>
        </div>
        
        {pastSearches.length === 0 ? (
          <div className="text-slate-400 text-sm italic">
            No searches yet. Start searching to build your research history.
          </div>
        ) : (
          <div className="space-y-2">
            {pastSearches.map((search) => (
              <div 
                key={search.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSearch?.id === search.id
                    ? 'border-accent-fuchsia bg-slate-700'
                    : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                }`}
                onClick={() => loadSearch(search)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{search.query}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {search.timestamp.toLocaleDateString()} {search.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveSearch(search);
                      }}
                      className={`p-1 rounded hover:bg-slate-600 transition-colors ${
                        search.saved ? 'text-green-400' : 'text-slate-400 hover:text-green-400'
                      }`}
                      title={search.saved ? 'Already saved' : 'Save to Lab'}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSearch(search.id);
                      }}
                      className="p-1 rounded hover:bg-slate-600 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Search Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-accent-fuchsia" />
            <h1 className="text-3xl font-bold text-white">Let's Search</h1>
          </div>
          <p className="text-slate-400">
            Comprehensive research engine combining Google search results with deep insights
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex gap-3">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What would you like to research? (Click to enable voice dictation)"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-fuchsia dictation-enabled"
              data-dictation-enabled="true"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-accent-fuchsia hover:bg-accent-fuchsia/80 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
          
          {/* Search Status */}
          {searchStatus && (
            <div className="mt-3 text-sm text-slate-400 italic">
              {searchStatus}
            </div>
          )}
        </div>

        {/* Results Tabs */}
        <div className="mb-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'web'
                  ? 'bg-accent-fuchsia text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Web Results
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'images'
                  ? 'bg-accent-fuchsia text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Images
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {/* Web Results */}
          {activeTab === 'web' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Web Results</h3>
              <div
                id="lexintel-results"
                className="gcse-searchresults"
                data-defaultToImageSearch="false"
                style={{ minHeight: '400px' }}
              />
            </div>
          )}

          {/* Image Results */}
          {activeTab === 'images' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Image Results</h3>
              <div
                id="lexintel-images"
                className="gcse-searchresults-only"
                data-enableImageSearch="true"
                data-defaultToImageSearch="true"
                data-disableWebSearch="true"
                data-image_type="photo"
                data-image_size="large"
                style={{ minHeight: '400px' }}
              />
            </div>
          )}
        </div>

        {/* Selected Search Info */}
        {selectedSearch && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-accent-fuchsia" />
              <h3 className="font-semibold text-white">Current Research Session</h3>
            </div>
            <div className="text-slate-300">
              <strong>Query:</strong> {selectedSearch.query}
            </div>
            <div className="text-slate-400 text-sm">
              <strong>Started:</strong> {selectedSearch.timestamp.toLocaleString()}
            </div>
            {selectedSearch.saved && (
              <div className="text-green-400 text-sm mt-1">
                ✓ Saved to Lab for analysis
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
