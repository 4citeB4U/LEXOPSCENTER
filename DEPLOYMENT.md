# 🚀 LEXOPSCENTER Deployment Guide

## 📋 Prerequisites

Before your LEXOPSCENTER application can run automatically on GitHub, you need to complete these setup steps:

### 1. **Set Up Local Environment**
```bash
# Your .env.local file should contain:
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

**Note:** Your `.env.local` file is already configured correctly with both `VITE_GEMINI_API_KEY` and `GEMINI_API_KEY`.

### 2. **Enable GitHub Pages**
- Go to your repository: `https://github.com/4citeB4U/LEXOPSCENTER`
- Click **Settings** → **Pages**
- Set **Source** to "GitHub Actions"
- Click **Save**

### 3. **Set Up GitHub Secrets**
- Go to **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**
- Add this secret:
  - **Name**: `GEMINI_API_KEY`
  - **Value**: Your actual Google Gemini API key (same as in .env.local)
  - Click **Add secret**

### 4. **Test Locally First**
```bash
npm install
npm run dev
```
Visit `http://localhost:5173` to ensure everything works locally.

## 🔄 Automatic Deployment

Once configured, your app will automatically deploy on every push to the `main` branch:

1. **Push your code** to GitHub
2. **GitHub Actions** automatically builds your app
3. **Deploys to GitHub Pages** at: `https://4citeB4U.github.io/LEXOPSCENTER`

## 🛠️ Manual Deployment

If you prefer manual deployment:

```bash
# Build the application
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 Access Your App

- **Development**: `http://localhost:5173` (run `npm run dev`)
- **Production**: `https://4citeB4U.github.io/LEXOPSCENTER`

## ⚠️ Important Notes

- **Environment Variables**: The app needs `GEMINI_API_KEY` to function properly
- **Local Testing**: Always test locally with `npm run dev` before pushing
- **API Key Security**: Never commit your `.env.local` file to Git
- **Build Process**: Uses Vite for fast builds and optimal production output
- **PWA Ready**: Includes service worker and manifest for app-like experience

## 🔍 Troubleshooting

### Build Fails
- Check that `GEMINI_API_KEY` is set in GitHub Secrets
- Ensure all dependencies are installed (`npm install`)
- Check GitHub Actions logs for specific error messages
- Verify your API key is valid and has proper permissions

### App Doesn't Load
- Verify GitHub Pages is enabled and set to "GitHub Actions"
- Check the deployed URL is correct
- Ensure the build completed successfully in GitHub Actions

### Missing Features
- Verify your API key has the correct permissions
- Check browser console for JavaScript errors
- Ensure all environment variables are properly set

## 📱 PWA Features

Your app includes Progressive Web App capabilities:
- **Offline Support**: Service worker caches resources
- **Installable**: Users can add to home screen
- **App-like Experience**: Full-screen mode and native feel

---

**Need help?** Check the GitHub Actions logs or create an issue in the repository.
