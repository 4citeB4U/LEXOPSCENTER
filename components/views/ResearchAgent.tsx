



import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { getIntel } from '../../services/geminiService';
import { researchStorageService } from '../../services/researchStorageService';
import { IntelResult, ImageSearchResult } from '../../types';
import ImageResults from './ImageResults';
import ResearchActions from './ResearchActions';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14.5 2 14.5 8 20 8"></polyline></svg>;

const ResearchAgent: React.FC = () => {
  const { setQuickActionModal } = useAppContext();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IntelResult | null>(null);
  const [error, setError] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const intelResults = await getIntel(query.trim());
      setResults(intelResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image: ImageSearchResult) => {
    window.open(image.link, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const showFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Action handlers for sending research to different areas
  const handleSendToIntel = async (research: IntelResult) => {
    try {
      await researchStorageService.addToIntel(research);
      showFeedback(`✅ Research added to Intel: ${research.query}`);
    } catch (error) {
      showFeedback(`❌ Failed to add to Intel: ${error}`);
    }
  };

  const handleSendToLab = async (research: IntelResult) => {
    try {
      await researchStorageService.addToLab(research);
      showFeedback(`✅ Research added to Lab: ${research.query}`);
    } catch (error) {
      showFeedback(`❌ Failed to add to Lab: ${error}`);
    }
  };

  const handleSendToMagnaCarta = async (research: IntelResult) => {
    try {
      await researchStorageService.addToMagnaCarta(research);
      showFeedback(`✅ Research added to Magna Carta: ${research.query}`);
    } catch (error) {
      showFeedback(`❌ Failed to add to Magna Carta: ${error}`);
    }
  };

  const handleSendToGrind = async (research: IntelResult) => {
    try {
      await researchStorageService.addToGrind(research);
      showFeedback(`✅ Research added to Grind: ${research.query}`);
    } catch (error) {
      showFeedback(`❌ Failed to add to Grind: ${error}`);
    }
  };

  const handleSendToAnalyzer = async (research: IntelResult) => {
    try {
      await researchStorageService.addToAnalyzer(research);
      showFeedback(`✅ Research sent to Analyzer: ${research.query}`);
    } catch (error) {
      showFeedback(`❌ Failed to send to Analyzer: ${error}`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header - Compact */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700 bg-slate-800">
        <h1 className="text-xl font-bold text-text-light mb-2">Research Agent</h1>
        <p className="text-xs text-text-dark">
          Get comprehensive research results with AI analysis and visual aids
        </p>
      </div>

      {/* Search Input - Compact */}
      <div className="flex-shrink-0 p-3 border-b border-slate-700 bg-slate-800">
        <div className="flex">
          <div className="relative flex-1">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your research topic..."
              className="w-full pl-12 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-l-lg text-text-light placeholder-text-dark focus:outline-none focus:ring-2 focus:ring-accent-fuchsia focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-accent-fuchsia hover:bg-accent-fuchsia/80 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-r-lg transition-colors duration-200 flex items-center text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <SearchIcon />
                <span className="ml-2">Research</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Feedback */}
      {actionFeedback && (
        <div className="flex-shrink-0 mx-4 mt-2 p-2 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-green-400 text-xs">{actionFeedback}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex-shrink-0 mx-4 mt-2 p-2 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Results - Compact Layout */}
      {results && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Research Analysis - Compact */}
          <div className="bg-slate-800 rounded-lg p-3">
            <h2 className="text-base font-semibold text-text-light mb-2 flex items-center">
              <FileIcon />
              Research Analysis: {results.query}
            </h2>
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-text-light leading-relaxed text-xs max-h-24 overflow-y-auto"
                dangerouslySetInnerHTML={{ 
                  __html: results.analysis.replace(/\n/g, '<br>') 
                }} 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <ResearchActions 
            research={results}
            onSendToIntel={handleSendToIntel}
            onSendToLab={handleSendToLab}
            onSendToMagnaCarta={handleSendToMagnaCarta}
            onSendToGrind={handleSendToGrind}
            onSendToAnalyzer={handleSendToAnalyzer}
          />

          {/* Image Results - Compact */}
          <ImageResults 
            images={results.images} 
            title="Research Images"
            maxImages={4}
            onImageClick={handleImageClick}
          />

          {/* Sources - Compact */}
          {results.sources.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-text-light mb-2 flex items-center">
                <LinkIcon />
                Sources & References
              </h3>
              <div className="space-y-1">
                {results.sources.slice(0, 3).map((source, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-accent-fuchsia text-xs">•</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xs truncate"
                    >
                      {source.title}
                    </a>
                  </div>
                ))}
                {results.sources.length > 3 && (
                  <p className="text-xs text-text-dark text-center">
                    +{results.sources.length - 3} more sources
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamp - Compact */}
          <div className="text-center text-text-dark text-xs">
            Research completed at {new Date(results.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-3 border-t border-slate-700 bg-slate-800">
        <div className="text-center">
          <button
            onClick={() => setQuickActionModal('intel')}
            className="inline-flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-text-light rounded-lg transition-colors duration-200 text-sm"
          >
            <SearchIcon />
            <span className="ml-2">Quick Intel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchAgent;