import { IntelResult } from '../types';

// Simple in-memory storage (in a real app, this would use IndexedDB or a backend)
class ResearchStorageService {
  private storage: {
    intel: IntelResult[];
    lab: IntelResult[];
    magnaCarta: IntelResult[];
    grind: IntelResult[];
    analyzer: IntelResult[];
  };

  constructor() {
    this.storage = {
      intel: [],
      lab: [],
      magnaCarta: [],
      grind: [],
      analyzer: []
    };

    // Load from localStorage if available
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('lex_research_storage', JSON.stringify(this.storage));
    } catch (error) {
      console.error('Failed to save research to storage:', error);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('lex_research_storage');
      if (stored) {
        this.storage = { ...this.storage, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load research from storage:', error);
    }
  }

  // Add research to Intel database
  async addToIntel(research: IntelResult): Promise<void> {
    const existingIndex = this.storage.intel.findIndex(r => r.query === research.query);
    if (existingIndex >= 0) {
      this.storage.intel[existingIndex] = { ...research, timestamp: new Date().toISOString() };
    } else {
      this.storage.intel.unshift({ ...research, timestamp: new Date().toISOString() });
    }
    this.saveToStorage();
    console.log('Research added to Intel:', research.query);
  }

  // Add research to Lab notes
  async addToLab(research: IntelResult): Promise<void> {
    const labNote = {
      ...research,
      timestamp: new Date().toISOString(),
      type: 'lab_note',
      tags: ['research', 'lab']
    };
    this.storage.lab.unshift(labNote);
    this.saveToStorage();
    console.log('Research added to Lab:', research.query);
  }

  // Add research to Magna Carta (strategic planning)
  async addToMagnaCarta(research: IntelResult): Promise<void> {
    const magnaCartaItem = {
      ...research,
      timestamp: new Date().toISOString(),
      type: 'magna_carta',
      priority: 'medium',
      status: 'active'
    };
    this.storage.magnaCarta.unshift(magnaCartaItem);
    this.saveToStorage();
    console.log('Research added to Magna Carta:', research.query);
  }

  // Add research to Grind (daily tasks)
  async addToGrind(research: IntelResult): Promise<void> {
    const grindTask = {
      ...research,
      timestamp: new Date().toISOString(),
      type: 'grind_task',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
    };
    this.storage.grind.unshift(grindTask);
    this.saveToStorage();
    console.log('Research added to Grind:', research.query);
  }

  // Add research to Analyzer for deep analysis
  async addToAnalyzer(research: IntelResult): Promise<void> {
    const analyzerItem = {
      ...research,
      timestamp: new Date().toISOString(),
      type: 'analyzer',
      analysisDepth: 'deep',
      status: 'queued'
    };
    this.storage.analyzer.unshift(analyzerItem);
    this.saveToStorage();
    console.log('Research added to Analyzer:', research.query);
  }

  // Get all research from a specific area
  getResearch(area: keyof typeof this.storage): IntelResult[] {
    return this.storage[area] || [];
  }

  // Get research by query across all areas
  searchResearch(query: string): { area: string; research: IntelResult }[] {
    const results: { area: string; research: IntelResult }[] = [];
    const searchTerm = query.toLowerCase();

    Object.entries(this.storage).forEach(([area, researchList]) => {
      researchList.forEach(research => {
        if (research.query.toLowerCase().includes(searchTerm) || 
            research.analysis.toLowerCase().includes(searchTerm)) {
          results.push({ area, research });
        }
      });
    });

    return results;
  }

  // Remove research from a specific area
  removeResearch(area: keyof typeof this.storage, query: string): boolean {
    const index = this.storage[area].findIndex(r => r.query === query);
    if (index >= 0) {
      this.storage[area].splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Clear all research from a specific area
  clearArea(area: keyof typeof this.storage): void {
    this.storage[area] = [];
    this.saveToStorage();
  }

  // Get storage statistics
  getStats() {
    return {
      intel: this.storage.intel.length,
      lab: this.storage.lab.length,
      magnaCarta: this.storage.magnaCarta.length,
      grind: this.storage.grind.length,
      analyzer: this.storage.analyzer.length,
      total: Object.values(this.storage).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
}

export const researchStorageService = new ResearchStorageService();
