
import React, { Suspense, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import { VoiceControlProvider } from './contexts/VoiceControlContext';
import OnboardingFlow from './components/views/OnboardingFlow';
import Workspace from './components/layout/Workspace';
import Sidebar from './components/layout/Sidebar';
import RightRail from './components/layout/RightRail';
import MobileHeader from './components/layout/MobileHeader';
import Footer from './components/layout/Footer';
import DesktopHeader from './components/layout/DesktopHeader';
import ErrorBoundary from './components/ErrorBoundary';
import ConfigurationStatus from './components/ConfigurationStatus';
import { Loader2 } from 'lucide-react';
import { primeLexIntelImages } from './src/lib/lexintelImages'; // Corrected import path

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-accent-fuchsia animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Loading LEX Ops Center</h2>
      <p className="text-slate-400">Initializing your academic co-pilot...</p>
    </div>
  </div>
);

function App() {
  // Prime the image search at app startup
  useEffect(() => {
    primeLexIntelImages();
  }, []);

  // Load and apply customization settings on startup
  useEffect(() => {
    // Load background image
    const backgroundImage = localStorage.getItem('lex-background-image');
    if (backgroundImage) {
      document.documentElement.style.setProperty('--app-background-image', `url(${backgroundImage})`);
    }

    // Load background opacity
    const backgroundOpacity = localStorage.getItem('lex-background-opacity');
    if (backgroundOpacity) {
      document.documentElement.style.setProperty('--app-background-opacity', backgroundOpacity);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <VoiceControlProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="app-container h-screen bg-bg-main text-text-light overflow-hidden">
              {/* Show DesktopHeader on desktop, MobileHeader on mobile */}
              <div className="block md:hidden">
                <MobileHeader onMenuClick={() => {}} onChatClick={() => {}} />
              </div>
              <div className="hidden md:block">
                <DesktopHeader />
              </div>
              <div className="flex h-full">
                <Sidebar />
                {/* Main content area should not overlap sidebar or chat */}
                <div className="flex-1 flex flex-col overflow-auto">
                  <Workspace />
                </div>
                <RightRail />
              </div>
              <OnboardingFlow />
              <ConfigurationStatus />
              <Footer />
            </div>
          </Suspense>
        </VoiceControlProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
