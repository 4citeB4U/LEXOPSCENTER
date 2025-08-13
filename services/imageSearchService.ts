interface ImageSearchResult {
  title: string;
  link: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
  snippet: string;
  source: string;
}

interface SearchResponse {
  items: ImageSearchResult[];
  searchInformation: {
    totalResults: string;
    searchTime: number;
  };
}

class ImageSearchService {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '';
    this.searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || '';
  }

  // Generate fallback images based on search query
  private generateFallbackImages(query: string): ImageSearchResult[] {
    const baseQuery = query.toLowerCase();
    const fallbackImages = [
      {
        title: `${query} - Research Diagram`,
        link: `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(query)}`,
        image: {
          src: `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(query)}`,
          width: 300,
          height: 300
        },
        snippet: `Visual representation of ${query} research topic`,
        source: 'LEX Research System'
      },
      {
        title: `${query} - Analysis Chart`,
        link: `https://via.placeholder.com/300x300/8b5cf6/ffffff?text=${encodeURIComponent(query + ' Chart')}`,
        image: {
          src: `https://via.placeholder.com/300x300/8b5cf6/ffffff?text=${encodeURIComponent(query + ' Chart')}`,
          width: 300,
          height: 300
        },
        snippet: `Analytical chart for ${query} research`,
        source: 'LEX Research System'
      },
      {
        title: `${query} - Infographic`,
        link: `https://via.placeholder.com/300x300/ec4899/ffffff?text=${encodeURIComponent(query + ' Info')}`,
        image: {
          src: `https://via.placeholder.com/300x300/ec4899/ffffff?text=${encodeURIComponent(query + ' Info')}`,
          width: 300,
          height: 300
        },
        snippet: `Comprehensive infographic for ${query}`,
        source: 'LEX Research System'
      }
    ];

    return fallbackImages;
  }

  async searchImages(query: string, maxResults: number = 6): Promise<ImageSearchResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('Google Search API credentials not configured - using fallback images');
      return this.generateFallbackImages(query);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=${maxResults}&safe=active`
      );

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      return data.items || this.generateFallbackImages(query);
    } catch (error) {
      console.error('Image search failed:', error);
      return this.generateFallbackImages(query);
    }
  }

  async searchWebAndImages(query: string, maxResults: number = 4): Promise<{
    webResults: any[];
    imageResults: ImageSearchResult[];
  }> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('Google Search API credentials not configured - using fallback data');
      return {
        webResults: [],
        imageResults: this.generateFallbackImages(query)
      };
    }

    try {
      // Search for web results
      const webResponse = await fetch(
        `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=${maxResults}`
      );

      // Search for image results
      const imageResponse = await fetch(
        `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=${maxResults}&safe=active`
      );

      const webData = await webResponse.json();
      const imageData = await imageResponse.json();

      return {
        webResults: webData.items || [],
        imageResults: imageData.items || this.generateFallbackImages(query)
      };
    } catch (error) {
      console.error('Combined search failed:', error);
      return {
        webResults: [],
        imageResults: this.generateFallbackImages(query)
      };
    }
  }

  // Generate relevant image search queries based on research topic
  generateImageQueries(topic: string): string[] {
    const baseQuery = topic.toLowerCase();
    const imageQueries = [
      `${baseQuery} diagram`,
      `${baseQuery} chart`,
      `${baseQuery} infographic`,
      `${baseQuery} illustration`,
      `${baseQuery} photo`,
      `${baseQuery} example`
    ];
    
    return imageQueries.slice(0, 3); // Return top 3 most relevant queries
  }
}

export const imageSearchService = new ImageSearchService();
export type { ImageSearchResult, SearchResponse };
