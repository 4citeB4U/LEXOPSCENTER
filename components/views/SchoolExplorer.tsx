import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { View } from '../../types';
import { makeInputDictationEnabled } from '../../services/universalDictation';
import { Search, MapPin, GraduationCap, Users, Star } from 'lucide-react';

// Use Vite's import.meta.env for environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export default function SchoolExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Make search input dictation-enabled
  useEffect(() => {
    if (searchInputRef.current) {
      makeInputDictationEnabled(searchInputRef.current);
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for schools:', searchQuery);
      // Implement school search logic here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="h-full bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">School Explorer</h1>
        <p className="text-slate-400">Discover educational institutions and programs</p>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for schools, programs, or locations (Click to enable voice dictation)"
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-fuchsia dictation-enabled"
            data-dictation-enabled="true"
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="px-6 py-3 bg-accent-fuchsia hover:bg-accent-fuchsia/80 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Sample Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'MIT', location: 'Cambridge, MA', students: '11,000+', rating: 4.9 },
          { name: 'Stanford', location: 'Stanford, CA', students: '17,000+', rating: 4.8 },
          { name: 'Harvard', location: 'Cambridge, MA', students: '31,000+', rating: 4.9 },
          { name: 'Caltech', location: 'Pasadena, CA', students: '2,200+', rating: 4.7 },
          { name: 'Princeton', location: 'Princeton, NJ', students: '8,000+', rating: 4.8 },
          { name: 'Yale', location: 'New Haven, CT', students: '12,000+', rating: 4.8 }
        ].map((school, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border cursor-pointer transition-all ${
              selectedSchool === school.name
                ? 'border-accent-fuchsia bg-slate-700'
                : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
            }`}
            onClick={() => setSelectedSchool(school.name)}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-8 h-8 text-accent-fuchsia" />
              <div>
                <h3 className="text-xl font-semibold text-white">{school.name}</h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{school.location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4" />
                <span className="text-sm">{school.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{school.rating}/5.0 rating</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected School Details */}
      {selectedSchool && (
        <div className="mt-6 p-6 bg-slate-800 rounded-lg border border-slate-600">
          <h3 className="text-xl font-semibold text-white mb-4">
            Details for {selectedSchool}
          </h3>
          <p className="text-slate-300">
            This is a placeholder for detailed information about {selectedSchool}. 
            In a real implementation, this would show comprehensive details about the institution.
          </p>
        </div>
      )}
    </div>
  );
}