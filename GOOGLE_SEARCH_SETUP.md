# 🔍 Google Custom Search API Setup Guide

This guide will help you set up Google Custom Search API to enable image search functionality in your LEXOPSCENTER application.

## 🚀 **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `LEXOPSCENTER-Search`
4. Click **"Create"**

## 🔑 **Step 2: Enable Custom Search API**

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Custom Search API"**
3. Click on it and click **"Enable"**

## 🎯 **Step 3: Create API Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your API key (you'll need this later)
4. **Optional**: Restrict the API key to Custom Search API only

## 🔍 **Step 4: Create Custom Search Engine**

1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click **"Create a search engine"**
3. Enter your site URL (can be any URL for now)
4. Give it a name: `LEXOPSCENTER Search`
5. Click **"Create"**

## ⚙️ **Step 5: Configure Search Engine**

1. In your search engine settings, click **"Setup"**
2. Go to **"Basics"** tab
3. Copy your **Search Engine ID** (cx parameter)
4. Go to **"Sites to search"** tab
5. Add: `https://www.google.com` (to search the entire web)
6. Go to **"Image Search"** tab
7. Enable **"Image Search"**
8. Click **"Save"**

## 🔧 **Step 6: Configure Environment Variables**

### **Local Development (.env.local)**
```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Google Custom Search API
VITE_GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### **GitHub Secrets**
1. Go to your repository: `https://github.com/4citeB4U/LEXOPSCENTER/settings/secrets/actions`
2. Add these secrets:
   - **Name**: `VITE_GOOGLE_SEARCH_API_KEY`
   - **Value**: Your Google Search API key
   - **Name**: `VITE_GOOGLE_SEARCH_ENGINE_ID`
   - **Value**: Your Search Engine ID

## 📊 **Step 7: Test the Setup**

1. Start your development server: `npm run dev`
2. Go to the **Research Agent** page
3. Search for any topic (e.g., "quantum physics")
4. You should see both text analysis and relevant images

## 💰 **Pricing & Limits**

- **Free Tier**: 100 searches per day
- **Paid**: $5 per 1000 searches
- **Image Search**: Same pricing as web search

## 🎯 **Features You'll Get**

✅ **Text Research**: AI-powered analysis of any topic  
✅ **Image Results**: Relevant images with titles and sources  
✅ **Career Analysis**: Visual career path diagrams and education images  
✅ **Source Links**: Clickable links to original content  
✅ **Responsive Design**: Works on all devices  

## 🔍 **Example Search Results**

When you search for "machine learning career path", you'll get:

1. **AI Analysis**: Comprehensive overview of ML careers
2. **Career Images**: Career path diagrams, education infographics
3. **Education Images**: University programs, degree requirements
4. **Source Links**: Links to original images and content

## 🚨 **Troubleshooting**

### **No Images Appearing**
- Check API key and Search Engine ID are correct
- Verify Custom Search API is enabled
- Check browser console for errors
- Ensure image search is enabled in your search engine

### **API Quota Exceeded**
- Check your Google Cloud billing
- Monitor usage in Google Cloud Console
- Consider upgrading to paid tier

### **Images Not Loading**
- Check image URLs in browser console
- Some images may be blocked by CORS
- Images are loaded lazily for performance

## 📱 **Mobile Optimization**

The image search results are fully responsive:
- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout  
- **Mobile**: Single column with optimized spacing

## 🎨 **Customization**

You can customize the image display by modifying:
- `components/views/ImageResults.tsx` - Image grid layout
- `services/imageSearchService.ts` - Search parameters
- `types.ts` - Data structures

## 🚀 **Next Steps**

After setup, you can:
1. **Enhance Career Advisor** with career path images
2. **Add School Explorer** with university images
3. **Create Visual Notes** with topic-related images
4. **Build Image Galleries** for research topics

---

**Need help?** Check the GitHub Actions logs or create an issue in the repository.
