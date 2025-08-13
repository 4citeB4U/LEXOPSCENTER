@echo off
echo Setting up LEXOPSCENTER environment variables...
echo.

REM Check if .env.local already exists
if exist .env.local (
    echo .env.local already exists. Backing up to .env.local.backup
    copy .env.local .env.local.backup
)

echo Creating .env.local file...
echo # LEXOPSCENTER Environment Variables > .env.local
echo # This file contains your actual API keys and should NOT be committed to Git >> .env.local
echo. >> .env.local
echo # Google Gemini API Key (Required for AI features) >> .env.local
echo GEMINI_API_KEY=your_actual_gemini_api_key_here >> .env.local
echo. >> .env.local
echo # Vite Environment Variables >> .env.local
echo VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here >> .env.local
echo. >> .env.local
echo # Google Custom Search API (Required for image search) >> .env.local
echo VITE_GOOGLE_SEARCH_API_KEY=your_actual_google_search_api_key_here >> .env.local
echo VITE_GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id_here >> .env.local
echo. >> .env.local
echo # Build Environment >> .env.local
echo NODE_ENV=development >> .env.local

echo.
echo .env.local file created successfully!
echo.
echo IMPORTANT: Edit .env.local and replace the placeholder values:
echo 1. Replace 'your_actual_gemini_api_key_here' with your real Google Gemini API key
echo 2. Replace 'your_actual_google_search_api_key_here' with your Google Search API key
echo 3. Replace 'your_actual_search_engine_id_here' with your Search Engine ID
echo.
echo For Google Search API setup, see: GOOGLE_SEARCH_SETUP.md
echo.
echo After editing, you can test locally with: npm run dev
echo.
pause
