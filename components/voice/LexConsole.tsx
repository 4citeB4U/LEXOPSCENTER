
import React, { useState } from 'react';
import { useVoiceControl } from '../../contexts/VoiceControlContext';
import CUE from '../../services/cueRuntime';
import VoiceWave from './VoiceWave';
import { useAppContext } from '../../contexts/AppContext';
import { handleShareBackup } from '../../services/dataService';

const councilButtons = [
    { id: 'note', icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z', label: 'Quick Note' },
    { id: 'intel', icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z', label: 'Quick Intel' },
    { id: 'garage', icon: 'M12 6v2m0 10v2m6-8h2m-14 0H4m11.5-5.5L18 4m-9.5 9.5L6 18M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', label: 'The Garage' },
    { id: 'email', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', label: 'Email Backup' },
];

const MicIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-8 w-8 ${className || 'text-white'}`}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;

const LexConsole: React.FC = () => {
    const { phase } = useVoiceControl();
    const { setQuickActionModal } = useAppContext();
    const [isHovered, setIsHovered] = useState(false);
    const [tapCount, setTapCount] = useState(0);

    const handleMicToggle = () => {
        setTapCount(prev => prev + 1);
        setTimeout(() => setTapCount(0), 500);
        CUE.mic.toggle();
    };
    
    const handleCouncilClick = (id: 'note' | 'intel' | 'email' | 'garage' | string) => {
        if (id === 'garage') {
            CUE.page({to: 'garage'});
            return;
        }
        if (id === 'email') {
            handleShareBackup();
            return;
        }
        setQuickActionModal(id as 'note' | 'intel');
    }

    const phaseClasses = {
        IDLE: 'bg-slate-700 hover:bg-slate-600',
        LISTENING: 'lex-console-listening',
        THINKING: 'bg-slate-700',
        SPEAKING: 'bg-teal-600',
        PAUSED: 'bg-slate-600',
    };
    
    const iconColorClass = {
        IDLE: 'text-white',
        LISTENING: '', // No icon
        THINKING: 'text-primary-blue animate-pulse',
        SPEAKING: 'text-teal-200',
        PAUSED: 'text-slate-400'
    }[phase];


    const buttonClasses = `relative rounded-full flex items-center justify-center transition-all duration-300 ease-in-out w-20 h-20 shadow-lg ${phaseClasses[phase]}`;

    return (
        <div 
            className="relative flex items-center justify-center p-16 -m-16" // Expands hover area
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Hover Council */}
            {councilButtons.map((btn, i) => {
                const angle = -140 + (i * (100 / (councilButtons.length - 1)));
                return (
                    <button
                        key={btn.id}
                        onClick={() => handleCouncilClick(btn.id)}
                        title={btn.label}
                        className="absolute w-12 h-12 bg-slate-700 hover:bg-accent-fuchsia rounded-full flex items-center justify-center transition-all duration-300 ease-out"
                        style={{
                            transform: `rotate(${angle}deg) translate(80px) rotate(${-angle}deg) scale(${isHovered ? 1 : 0.5})`,
                            opacity: isHovered ? 1 : 0,
                            pointerEvents: isHovered ? 'auto' : 'none',
                            transitionDelay: isHovered ? `${i * 40}ms` : '0ms'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={btn.icon} />
                        </svg>
                    </button>
                )
            })}
        
            {/* Main Console Button */}
            <div className="relative flex flex-col items-center">
                 <button
                    onClick={handleMicToggle}
                    aria-label={phase === 'LISTENING' ? 'Stop listening' : 'Start listening'}
                    className={buttonClasses}
                >
                    {phase === 'THINKING' && <div className="lex-console-thinking-ring"></div>}
                    
                    <div className="absolute inset-0 p-6">
                        <VoiceWave isActive={phase === 'LISTENING'} />
                    </div>
                    {phase !== 'LISTENING' && <MicIcon className={iconColorClass} />}
                </button>
                {/* Tap Meter */}
                <div className="flex gap-1.5 mt-3 h-1 w-16">
                    {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className={`h-full w-1/4 rounded-full transition-all duration-200 ${tapCount > i ? 'bg-accent-fuchsia' : 'bg-slate-600'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LexConsole;
