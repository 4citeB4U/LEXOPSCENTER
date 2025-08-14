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
    
    // Debug logging
    console.log('🔍 ImageSearchService initialized:');
    console.log('  - API Key present:', !!this.apiKey);
    console.log('  - Search Engine ID present:', !!this.searchEngineId);
    console.log('  - API Key length:', this.apiKey?.length || 0);
    console.log('  - Search Engine ID:', this.searchEngineId);
    
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️ Google Search API credentials not configured:');
      console.warn('  - VITE_GOOGLE_SEARCH_API_KEY:', this.apiKey ? 'Present' : 'Missing');
      console.warn('  - VITE_GOOGLE_SEARCH_ENGINE_ID:', this.searchEngineId ? 'Present' : 'Missing');
      console.warn('  - Check your .env.local file and restart the dev server');
    } else {
      console.log('✅ Google Search API credentials configured successfully');
    }
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
      console.warn('⚠️ Google Search API credentials not configured - using fallback images');
      return this.generateFallbackImages(query);
    }

    try {
      console.log(`🔍 Searching for images: "${query}"`);
      console.log(`  - API Key: ${this.apiKey.substring(0, 10)}...`);
      console.log(`  - Search Engine ID: ${this.searchEngineId}`);
      
      const searchUrl = `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=${maxResults}&safe=active`;
      console.log(`  - Search URL: ${searchUrl.replace(this.apiKey, '***API_KEY***')}`);
      
      const response = await fetch(searchUrl);

      console.log(`  - Response status: ${response.status} ${response.statusText}`);
      console.log(`  - Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Search API error: ${response.status} ${response.statusText}`);
        console.error(`  - Error response:`, errorText);
        
        // Handle specific error cases
        if (response.status === 403) {
          console.error('  - This usually means the API key is invalid or has insufficient permissions');
        } else if (response.status === 400) {
          console.error('  - This usually means the search engine ID is invalid');
        } else if (response.status === 429) {
          console.error('  - This means you have exceeded your API quota');
        }
        
        throw new Error(`Search API error: ${response.status} - ${errorText}`);
      }

      const data: SearchResponse = await response.json();
      console.log(`✅ Search successful:`, data);
      console.log(`  - Found ${data.items?.length || 0} images`);
      
      if (data.items && data.items.length > 0) {
        return data.items;
      } else {
        console.warn('  - No images found, using fallback images');
        return this.generateFallbackImages(query);
      }
    } catch (error) {
      console.error('❌ Image search failed:', error);
      
      // Provide more specific error information
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('  - Network error - check your internet connection');
      } else if (error instanceof Error && error.message.includes('API key')) {
        console.error('  - API key issue - verify your VITE_GOOGLE_SEARCH_API_KEY');
      } else if (error instanceof Error && error.message.includes('search engine')) {
        console.error('  - Search engine ID issue - verify your VITE_GOOGLE_SEARCH_ENGINE_ID');
      }
      
      return this.generateFallbackImages(query);
    }
  }

  async searchWebAndImages(query: string, maxResults: number = 4): Promise<{
    webResults: any[];
    imageResults: ImageSearchResult[];
  }> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️ Google Search API credentials not configured - using fallback data');
      return {
        webResults: [],
        imageResults: this.generateFallbackImages(query)
      };
    }

    try {
      console.log(`🔍 Searching for web and images: "${query}"`);
      
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

      console.log(`✅ Combined search successful:`);
      console.log(`  - Web results: ${webData.items?.length || 0}`);
      console.log(`  - Image results: ${imageData.items?.length || 0}`);

      return {
        webResults: webData.items || [],
        imageResults: imageData.items || this.generateFallbackImages(query)
      };
    } catch (error) {
      console.error('❌ Combined search failed:', error);
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

  // Test method to verify API connection
  async testConnection(): Promise<boolean> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️ Cannot test connection - credentials not configured');
      return false;
    }

    try {
      console.log('🧪 Testing Google Custom Search API connection...');
      const response = await fetch(
        `${this.baseUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=test&num=1`
      );
      
      if (response.ok) {
        console.log('✅ API connection test successful');
        return true;
      } else {
        console.error(`❌ API connection test failed: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return false;
    }
  }
}

export const imageSearchService = new ImageSearchService();
export type { ImageSearchResult, SearchResponse };
