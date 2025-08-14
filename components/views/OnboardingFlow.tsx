
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import CUE from '../../services/cueRuntime';
import { guideTitle, guideContent, tourScript, finalWords } from '../../services/onboardingContent';
import Sidebar from '../layout/Sidebar';
import Workspace from '../layout/Workspace';
import RightRail from '../layout/RightRail';
import Footer from '../layout/Footer';
import { LexCard } from './LexCard';

type OnboardingStep = 'entry' | 'name' | 'permissions' | 'guide' | 'tour' | 'finishing' | 'skipped';

const OnboardingFlow: React.FC = () => {
    const [step, setStep] = useState<OnboardingStep>('entry');
    const [name, setName] = useState('');
    const [micStatus, setMicStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
    const [tourIndex, setTourIndex] = useState(-1);
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const { completeOnboarding, setHighlightedNavItem } = useAppContext();
    
    const handleTransition = useCallback((nextStep: OnboardingStep) => {
        setIsFadingOut(true);
        setTimeout(() => {
            setStep(nextStep);
            setIsFadingOut(false);
        }, 500);
    }, []);
    
    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        handleTransition('permissions');
    };

    const handleRequestPermission = useCallback(async () => {
        CUE.tts.speak(`Thanks, ${name}. To give you the full voice-first experience, I'll need microphone access.`);
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStatus('granted');
            CUE.tts.speak("Aight, bet. Mic is live. Now for the playbook.");
        } catch (error) {
            console.error("Microphone permission denied:", error);
            setMicStatus('denied');
            CUE.tts.speak("That's cool. Voice features will be disabled. Let's continue with the playbook.");
        }
    }, [name]);
    
    const handleSkip = useCallback(() => {
        // Skip onboarding completely and go directly to the final state
        CUE.tts.cancel();
        
        // Clear any highlighted navigation items
        setHighlightedNavItem(null);
        
        // Set the view to Pulse (dashboard) immediately
        CUE.page({ to: 'pulse' });
        
        // Complete onboarding as skipped
        completeOnboarding(name || 'Operator', true);
        
        // Set step to skipped to hide the overlay
        setStep('skipped');
        
        // If mic is available, speak the final message
        if (micStatus === 'granted') {
            CUE.tts.speak("Alright, the Ops Center is yours. Welcome to the Pulse. Let's get started.");
        }
    }, [completeOnboarding, name, micStatus, setHighlightedNavItem]);

    useEffect(() => {
        const handleTtsEnd = () => {
            if (step === 'permissions' && micStatus !== 'unknown') {
                handleTransition('guide');
            } else if (step === 'guide') {
                handleTransition('tour');
                setTourIndex(0);
            } else if (step === 'tour' && tourIndex < tourScript.length - 1) {
                setTourIndex(i => i + 1);
            } else if (step === 'tour' && tourIndex === tourScript.length - 1) {
                setStep('finishing');
            } else if (step === 'finishing') {
                setHighlightedNavItem(null);
                completeOnboarding(name, false);
            } else if (step === 'skipped') {
                setHighlightedNavItem(null);
                completeOnboarding(name || 'Operator', true);
            }
        };
        
        window.addEventListener('lex.tts.end', handleTtsEnd);
        return () => window.removeEventListener('lex.tts.end', handleTtsEnd);
    }, [step, tourIndex, micStatus, name, completeOnboarding, setHighlightedNavItem, handleTransition]);
    
    useEffect(() => {
        if (step === 'tour' && tourIndex >= 0 && tourIndex < tourScript.length) {
            const currentTourStep = tourScript[tourIndex];
            setHighlightedNavItem(currentTourStep.view);
            CUE.page({ to: currentTourStep.view });
            CUE.tts.speak(currentTourStep.content);
        }
    }, [step, tourIndex, setHighlightedNavItem]);

    useEffect(() => {
        if (step === 'guide') {
            setIsFadingOut(false);
            const spokenGuideContent = `Alright, ${name}. ${guideContent}`;
            CUE.tts.speak(spokenGuideContent);
        } else if (step === 'finishing') {
            setHighlightedNavItem(null);
            CUE.page({ to: 'pulse' });
            CUE.tts.speak(finalWords);
        }
    }, [step, setHighlightedNavItem, name]);


    const renderContent = () => {
        switch (step) {
            case 'entry':
                return <LexCard onEnter={() => handleTransition('name')} />;
            case 'name':
                return (
                    <form onSubmit={handleNameSubmit} className="max-w-2xl text-center">
                        <h1 className="text-5xl font-extrabold text-white mb-4">First things first...</h1>
                        <p className="text-xl text-slate-300 mb-8">What should I call you?</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-700 border border-border-color rounded-lg p-4 text-white placeholder-slate-400 text-2xl text-center mb-8 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            placeholder="Your Name"
                            autoFocus
                        />
                        <button type="submit" className="bg-primary-blue text-white rounded-lg px-8 py-4 font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!name.trim()}>Continue</button>
                    </form>
                );
            case 'permissions':
                 return (
                    <div className="max-w-2xl text-center">
                        <h1 className="text-5xl font-extrabold text-white mb-4">Mic Check, 1, 2...</h1>
                        <p className="text-xl text-slate-300 mb-12">
                            To use voice commands and dictation, I'll need access to your microphone.
                        </p>
                        <button
                            onClick={handleRequestPermission}
                            className="bg-primary-blue text-white rounded-lg px-8 py-4 font-semibold text-lg hover:opacity-90 transition-opacity disabled:bg-slate-600 disabled:cursor-not-allowed"
                            disabled={micStatus !== 'unknown'}
                        >
                            {micStatus === 'unknown' ? 'Allow Microphone' : 'Locking In...'}
                        </button>
                        {micStatus === 'denied' && <p className="text-warning-red mt-4 text-sm">Mic access denied. You'll have to type. We can still work.</p>}
                    </div>
                );
            case 'guide':
                 return (
                     <div className="max-w-3xl text-left bg-slate-800 p-8 rounded-2xl shadow-2xl">
                        <h1 className="text-4xl font-extrabold text-white mb-6">{guideTitle}</h1>
                        <div className="text-lg text-slate-300 space-y-4 whitespace-pre-line max-h-[60vh] overflow-y-auto pr-4">
                            {`Alright, ${name}.\n\n${guideContent}`}
                        </div>
                        <p className="text-teal-400 mt-8 animate-pulse">LEX is reading The Playbook...</p>
                    </div>
                )
            default:
                return null;
        }
    };

    const isOverlayVisible = step !== 'tour' && step !== 'finishing' && step !== 'skipped';

    return (
        <>
            <div className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-500
                ${isOverlayVisible && !isFadingOut ? 'bg-bg-main/80 backdrop-blur-md opacity-100' : 'opacity-0 pointer-events-none'}
                `}>
                <div className={`p-8 transition-all duration-500 ${isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    {renderContent()}
                </div>
            </div>
            
            {step !== 'entry' && step !== 'finishing' && step !== 'skipped' && (
                <button 
                    onClick={handleSkip}
                    className="fixed bottom-8 right-8 z-[60] bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300"
                >
                    Skip to the Ops Center
                </button>
            )}

            <div className={isOverlayVisible ? 'invisible' : ''}>
                 <div className="h-screen w-screen flex flex-col font-sans antialiased">
                    <div className="flex flex-grow overflow-hidden">
                        <Sidebar />
                        <Workspace />
                        <RightRail />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default OnboardingFlow;
