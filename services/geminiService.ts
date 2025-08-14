import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { View, IntelResult, GroundingChunk, VoiceCommand, Audience, CareerBlueprint, CareerPlanItem, SuggestedGoal, CollegeRec, Domain, Horizon } from '../types';
import { imageSearchService, ImageSearchResult } from './imageSearchService';

// Use Vite's import.meta.env for environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

// Initialize AI only if API key is available
let ai: GoogleGenAI | null = null;

if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        console.log("✅ Gemini AI initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize Gemini AI:", error);
        ai = null;
    }
} else {
    console.warn("⚠️ VITE_GEMINI_API_KEY not set. Gemini AI features will be disabled.");
}

const getPersonalityInstruction = (flow: number): string => {
    if (flow >= 90) return "You must adopt a street-hustle, confident, and slang-heavy tone. Be direct and use modern slang naturally. You are a sharp, savvy co-pilot from the streets who knows how to get things done.";
    if (flow >= 40) return "You must adopt a casual, encouraging, and slightly informal tone. Be a friendly and approachable partner.";
    return "You must adopt a professional, formal, and academic tone. Be a helpful and respectful assistant.";
}

// --- REGULAR CHAT FUNCTIONS ---

export const lexRespond = async (prompt: string, flow: number, audience: Audience): Promise<string> => {
  if (!ai) {
    return "I'm sorry, the AI service is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.";
  }

  const personality = getPersonalityInstruction(flow);
  const systemPrompt = `You are LΞX, an AI academic co-pilot. ${personality} Respond to the user's query in a helpful, engaging way. Keep responses concise but informative.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40
      }
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI response generation failed:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};

// --- VOICE COMMAND PROCESSING ---

const commandSchema = {
    type: Type.OBJECT,
    properties: {
        action: { type: Type.STRING, description: "Action to perform: 'navigate', 'talk', or 'contextual_command'." },
        page: { type: Type.STRING, description: "Required if action is 'navigate'. Valid pages: pulse, magna_carta, grind, lab, intel, analyzer, campus, garage, playbook.", nullable: true },
        spokenResponse: { type: Type.STRING, description: "The text to be spoken back to the user." },
        command: { type: Type.STRING, description: "Required if action is 'contextual_command'. E.g., 'search' or 'analyze_camera_view'.", nullable: true },
        payload: { type: Type.OBJECT, description: "Data for the contextual command, e.g., { query: 'Nike' }.", nullable: true, properties: { query: {type: Type.STRING } } },
    },
    required: ["action", "spokenResponse"],
};

export const processVoiceCommand = async (prompt: string, currentView: View, flow: number, audience: Audience): Promise<VoiceCommand> => {
    if (!ai) return { action: 'talk', spokenResponse: "I'm sorry, the AI service is not configured. Please set your API key." };
    
    const personality = getPersonalityInstruction(flow);
    try {
        const systemInstruction = `You are the brain of a voice assistant named LEX, integrated into an academic operations app. ${personality} Your current view is '${currentView}'. Your audience setting is '${audience}', adjust your spoken response content appropriately. Your job is to understand a user's request and return a JSON object that determines the application's response according to the provided schema. Do not use asterisks or any markdown for emphasis in your spokenResponse.

- **Navigation**: Only trigger navigation if the user uses an explicit command like "take me to", "let's go to", "navigate to", or "open". The spokenResponse should confirm the action, e.g., "Navigating to The Intel." Valid pages are: 'pulse', 'magna_carta', 'grind', 'lab', 'intel', 'analyzer', 'campus', 'garage', 'playbook'. If a page name is mentioned without a navigation command, do not navigate.

- **Contextual Commands**: If the user is on a specific page, interpret their request in that context.
  - If on 'intel' and they want to search (e.g., "look up Nike"), set action to 'contextual_command', command to 'search', and payload to { "query": "Nike" }.
  - If on 'analyzer' and they ask what you see (e.g., "analyze what you see", "what's in front of me?"), set action to 'contextual_command', command to 'analyze_camera_view'.

- **General Talk**: If the request is a question or statement not covered above, set action to 'talk' and provide a helpful, concise answer. If you can't do something like an "investigation," offer a helpful alternative like an intel search.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User request: "${prompt}"`,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: commandSchema }
        });

        const result = JSON.parse(response.text) as VoiceCommand;
        if (result.action === 'navigate' && !result.page) {
             return { action: 'talk', spokenResponse: "I'm not sure where you wanted to go. Could you say that again?" };
        }
        return result;
    } catch (error) {
        console.error("Error processing voice command with Gemini:", error);
        const fallbackText = await lexRespond(prompt, flow, audience);
        return { action: 'talk', spokenResponse: fallbackText };
    }
};

// --- INTEL & BLUEPRINT SUITE ---

export const getIntel = async (query: string): Promise<IntelResult> => {
    if (!ai) {
        // Return fallback research data when AI is not available
        const fallbackImages = await imageSearchService.generateFallbackImages(query);
        return {
            query,
            analysis: `Research on "${query}" is currently unavailable because the AI service is not configured. Please set VITE_GEMINI_API_KEY in your environment variables to enable AI-powered research.

To get started:
1. Create a .env.local file in your project root
2. Add: VITE_GEMINI_API_KEY=your_actual_api_key_here
3. Restart your development server

In the meantime, you can still use the image search features.`,
            images: fallbackImages,
            timestamp: new Date().toISOString(),
            sources: fallbackImages.map(img => ({
                title: img.title,
                url: img.link,
                type: 'image'
            }))
        };
    }
    
    try {
        // Get both AI analysis and image search results
        const [aiAnalysis, imageResults] = await Promise.all([
            // AI analysis
            ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: [{ role: "user", parts: [{ text: `Provide a comprehensive overview of "${query}". Your response should be well-structured for a student. Include key concepts, definitions, and practical examples. Format the response in markdown with clear headings and bullet points.` }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1500,
                    topP: 0.8,
                    topK: 40
                }
            }),
            // Image search
            imageSearchService.searchImages(query, 6)
        ]);

        const aiResponse = await aiAnalysis.response;
        const analysis = aiResponse.text();

        return {
            query,
            analysis,
            images: imageResults,
            timestamp: new Date().toISOString(),
            sources: imageResults.map(img => ({
                title: img.title,
                url: img.link,
                type: 'image'
            }))
        };
    } catch (error) {
        console.error("Intel research failed:", error);
        throw new Error("Failed to get research results. Please try again.");
    }
};

export const generateCareerBlueprint = async (careerTitle: string, description: string): Promise<CareerBlueprint> => {
    if (!ai) {
        // Return fallback career blueprint when AI is not available
        const fallbackImages = await imageSearchService.generateFallbackImages(`${careerTitle} career path`);
        return {
            key_responsibilities: ["AI service not configured - please set VITE_GEMINI_API_KEY"],
            education_pathway: [{
                title: "Configuration Required",
                category: "setup",
                description: "Please set VITE_GEMINI_API_KEY in your environment variables to enable AI-powered career analysis."
            }],
            skills_development: ["API Configuration", "Environment Setup"],
            timeline: "Immediate setup required",
            salary_range: "N/A - Service not configured",
            growth_potential: "Enable AI service for detailed analysis",
            images: fallbackImages,
            visualAids: {
                careerPath: fallbackImages,
                education: fallbackImages
            }
        };
    }
    
    try {
        // Get both AI analysis and career-related images
        const [aiAnalysis, imageResults] = await Promise.all([
            // AI career analysis
            ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: [{ role: "user", parts: [{ text: `Analyze the career path for a "${careerTitle}". The user's goal is: "${description}".

Generate a comprehensive career blueprint in valid JSON format. The response must be complete and properly formatted JSON.

Structure:
{
  "key_responsibilities": ["responsibility1", "responsibility2"],
  "education_pathway": [
    {
      "title": "Education step title",
      "category": "education",
      "description": "Description without citations or brackets"
    }
  ],
  "skills_development": ["skill1", "skill2"],
  "timeline": "Estimated timeline",
  "salary_range": "Typical salary range",
  "growth_potential": "Career growth description"
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown formatting
- Ensure all JSON is complete and properly closed
- Remove any citations or brackets from descriptions
- Keep descriptions concise but informative` }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                    topP: 0.8,
                    topK: 40
                }
            }),
            // Career-related images
            imageSearchService.searchImages(`${careerTitle} career path`, 4)
        ]);

        const aiResponse = await aiAnalysis.response;
        const text = aiResponse.text();
        
        // Clean the response text to extract valid JSON
        let jsonText = text.trim();
        
        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/```\n?$/, '');
        }
        
        // Try to find complete JSON by looking for balanced braces
        let braceCount = 0;
        let endIndex = -1;
        
        for (let i = 0; i < jsonText.length; i++) {
            if (jsonText[i] === '{') braceCount++;
            if (jsonText[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        
        if (endIndex !== -1) {
            jsonText = jsonText.substring(0, endIndex + 1);
        }
        
        // Parse the cleaned JSON
        const blueprint = JSON.parse(jsonText);
        
        // Validate the structure
        if (!blueprint.key_responsibilities || !blueprint.education_pathway) {
            throw new Error("Invalid blueprint structure received from AI");
        }
        
        // Add images to the blueprint
        blueprint.images = imageResults;
        blueprint.visualAids = {
            careerPath: imageResults.filter(img => 
                img.title.toLowerCase().includes('career') || 
                img.title.toLowerCase().includes('path') ||
                img.title.toLowerCase().includes('timeline')
            ),
            education: imageResults.filter(img => 
                img.title.toLowerCase().includes('education') || 
                img.title.toLowerCase().includes('degree') ||
                img.title.toLowerCase().includes('university')
            )
        };
        
        return blueprint;
    } catch (error) {
        console.error("Career blueprint generation failed:", error);
        console.error("Raw response:", text);
        
        // Return a fallback blueprint
        return {
            key_responsibilities: ["Analysis failed - please try again"],
            education_pathway: [{
                title: "Error in Analysis",
                category: "error",
                description: "The AI analysis encountered an error. Please try again or rephrase your request."
            }],
            skills_development: ["Please retry"],
            timeline: "Unknown",
            salary_range: "Unknown",
            growth_potential: "Please retry the analysis",
            images: [],
            visualAids: {
                careerPath: [],
                education: []
            }
        };
    }
};

// --- ANALYZER (DOCUMENT/IMAGE ANALYSIS) ---

export const analyzeFile = async (prompt: string, base64Data: string, mimeType: string): Promise<string> => {
    if (!ai) {
        return "I'm sorry, the AI service is not configured. Please set VITE_GEMINI_API_KEY in your environment variables to enable file analysis.";
    }
    
    try {
        const filePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, filePart] },
            config: {
                systemInstruction: "You are an expert document and image analyst. The user has uploaded a file and asked a question about it. Provide a clear, detailed, and accurate analysis based on the file's content.",
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing file with Gemini:", error);
        return "I'm sorry, I encountered an error while trying to analyze the file. Please check the console for details.";
    }
};