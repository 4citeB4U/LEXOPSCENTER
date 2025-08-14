import React, { useState, useRef, useEffect } from 'react';
import { useVoiceControl } from '../../contexts/VoiceControlContext';
import CUE from '../../services/cueRuntime';
import VoiceWave from '../voice/VoiceWave';
import { useAppContext } from '../../contexts/AppContext';
import { handleShareBackup } from '../../services/dataService';
import { universalDictation } from '../../services/universalDictation';
import { Mic, Search, Settings, BookOpen, Mail, Target, Edit3 } from 'lucide-react';

const quickActions = [
  { id: 'magna_carta', icon: BookOpen, label: 'Magna Carta' },
  { id: 'grind', icon: Target, label: 'The Grind' },
  { id: 'intel', icon: Search, label: 'Quick Intel' },
  { id: 'garage', icon: Settings, label: 'Settings' },
  { id: 'email', icon: Mail, label: 'Email' },
];

const MicIcon: React.FC<{className?: string}> = ({className}) => <Mic className={className || "w-6 h-6"} />;

const Footer: React.FC = () => {
    const { phase } = useVoiceControl();
    const { setQuickActionModal } = useAppContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isLongPressed, setIsLongPressed] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('lex-username') || 'Operator');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState(username);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const micButtonRef = useRef<HTMLButtonElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);

    // Detect mobile vs desktop
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Update mic active state based on universal dictation
    useEffect(() => {
        const updateMicState = () => {
            const isActive = universalDictation.isActive();
            setIsMicActive(isActive);
            
            // Update data attribute for universal dictation system
            if (micButtonRef.current) {
                micButtonRef.current.setAttribute('data-mic-active', isActive.toString());
            }
        };

        // Check every 100ms for mic state changes
        const interval = setInterval(updateMicState, 100);
        return () => clearInterval(interval);
    }, []);

    // Listen for username updates from Settings
    useEffect(() => {
        const handleUsernameUpdate = (event: CustomEvent) => {
            setUsername(event.detail);
        };

        window.addEventListener('username-updated', handleUsernameUpdate as EventListener);
        return () => window.removeEventListener('username-updated', handleUsernameUpdate as EventListener);
    }, []);

    // Load username customization settings
    useEffect(() => {
        const loadUsernameSettings = () => {
            const storedUsername = localStorage.getItem('lex-username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        };

        loadUsernameSettings();
        // Also listen for storage changes
        window.addEventListener('storage', loadUsernameSettings);
        return () => window.removeEventListener('storage', loadUsernameSettings);
    }, []);

    const handleMicToggle = () => {
        setTapCount(prev => prev + 1);
        setTimeout(() => setTapCount(0), 500);
        
        if (isMicActive) {
            // Stop dictation if already active
            universalDictation.stopDictation();
        } else {
            // Start voice control
            CUE.mic.toggle();
        }
        
        // On mobile, hide buttons when mic is pressed
        if (isMobile && isLongPressed) {
            setIsLongPressed(false);
        }
    };

    // Desktop hover handlers
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false);
        }
    };

    // Mobile long press handlers
    const handleTouchStart = () => {
        if (isMobile) {
            longPressTimer.current = setTimeout(() => {
                setIsLongPressed(true);
            }, 2000); // 2 seconds
        }
    };

    const handleTouchEnd = () => {
        if (isMobile && longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleTouchMove = () => {
        if (isMobile && longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };
    
    const handleCouncilClick = (id: string) => {
        if (id === 'garage') {
            CUE.page({to: 'garage'});
        } else if (id === 'magna_carta') {
            CUE.page({to: 'magna_carta'});
        } else if (id === 'grind') {
            CUE.page({to: 'grind'});
        } else if (id === 'intel') {
            CUE.page({to: 'intel'});
        } else if (id === 'email') {
            window.location.href = 'mailto:';
        } else {
            setQuickActionModal(id as 'note' | 'intel');
        }
        
        // Hide buttons after selection (both mobile and desktop)
        setIsHovered(false);
        setIsLongPressed(false);
    };

    // Username editing handlers
    const startEditingUsername = () => {
        setIsEditingUsername(true);
        setTempUsername(username);
        setTimeout(() => {
            if (usernameInputRef.current) {
                usernameInputRef.current.focus();
                usernameInputRef.current.select();
            }
        }, 100);
    };

    const saveUsername = () => {
        if (tempUsername.trim()) {
            const newUsername = tempUsername.trim();
            setUsername(newUsername);
            localStorage.setItem('lex-username', newUsername);
        }
        setIsEditingUsername(false);
    };

    const cancelUsernameEdit = () => {
        setTempUsername(username);
        setIsEditingUsername(false);
    };

    const handleUsernameKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveUsername();
        } else if (e.key === 'Escape') {
            cancelUsernameEdit();
        }
    };

    const handleUsernameBlur = () => {
        saveUsername();
    };

    // Mic button colors based on phase and dictation state
    const getMicButtonColor = () => {
        if (isMicActive) {
            return 'bg-accent-fuchsia hover:bg-accent-fuchsia/80'; // Active dictation
        }
        
        switch (phase) {
            case 'SPEAKING':
                return 'bg-red-600 hover:bg-red-700';
            case 'LISTENING':
                return 'bg-green-600 hover:bg-green-700';
            default:
                return 'bg-purple-600 hover:bg-purple-700';
        }
    };

    const buttonClasses = `relative rounded-full flex items-center justify-center transition-all duration-300 ease-in-out w-16 h-16 shadow-lg ${getMicButtonColor()}`;

    // Determine when buttons should be visible
    const shouldShowButtons = isMobile ? isLongPressed : isHovered;

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 h-[60px] flex items-center justify-between px-4">
            {/* Left side - Username Display */}
            <div className="w-16 flex flex-col items-start justify-center">
                <div className="text-xs text-slate-400 font-medium mb-1">OPERATOR</div>
                {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                        <input
                            ref={usernameInputRef}
                            type="text"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            onKeyDown={handleUsernameKeyPress}
                            onBlur={handleUsernameBlur}
                            className="bg-slate-800 border border-accent-fuchsia rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent-fuchsia"
                            maxLength={20}
                        />
                    </div>
                ) : (
                    <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={startEditingUsername}
                        title="Click to edit username"
                    >
                        <div className="text-white font-bold text-lg tracking-wider transform-gpu transition-all duration-300 hover:scale-105" 
                             style={{
                                 color: localStorage.getItem('lex-username-text-color') || '#FFFFFF',
                                 backgroundColor: localStorage.getItem('lex-username-bg-color') || 'transparent',
                                 fontSize: `${localStorage.getItem('lex-username-font-size') || 18}px`,
                                 fontWeight: Number(localStorage.getItem('lex-username-font-weight')) || 700,
                                 textShadow: `
                                     -1px -1px 0 #1e293b,
                                     1px -1px 0 #1e293b,
                                     -1px 1px 0 #1e293b,
                                     1px 1px 0 #1e293b,
                                     2px 2px 4px rgba(0,0,0,0.5),
                                     0 0 20px rgba(217, 70, 239, 0.3)
                                 `,
                                 filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                             }}>
                            {username}
                        </div>
                        <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                )}
            </div>
            
            {/* Center - Mic Button with Quick Actions - ABSOLUTELY CENTERED */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                {/* Quick Actions - Perfectly even distribution around mic */}
                {quickActions.map((btn, i) => {
                    // Calculate perfect circle positions: 72° apart (360° / 5)
                    const angle = (i * 72) - 90; // Start from top (-90°)
                    const distance = 100; // 100px from center
                    
                    const x = Math.cos(angle * Math.PI / 180) * distance;
                    const y = Math.sin(angle * Math.PI / 180) * distance;
                    
                    return (
                        <button
                            key={btn.id}
                            onClick={() => handleCouncilClick(btn.id)}
                            title={btn.label}
                            className="absolute w-12 h-12 bg-slate-700 hover:bg-accent-fuchsia rounded-full flex items-center justify-center transition-all duration-300 ease-out shadow-lg cursor-pointer z-10 border-2 border-transparent hover:border-accent-fuchsia/50"
                            style={{
                                transform: `translate(${x}px, ${y}px) scale(${shouldShowButtons ? 1 : 0.8})`,
                                opacity: shouldShowButtons ? 1 : 0,
                                pointerEvents: shouldShowButtons ? 'auto' : 'none',
                                transitionDelay: shouldShowButtons ? `${i * 50}ms` : '0ms',
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: '-24px', // Half of button width
                                marginTop: '-24px'   // Half of button height
                            }}
                        >
                            <btn.icon className="w-6 h-6 text-white" />
                        </button>
                    )
                })}
            
                {/* Mic Button Container - Centered */}
                <div 
                    className="relative flex flex-col items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                >
                    {/* Main Console Button */}
                    <button
                        ref={micButtonRef}
                        onClick={handleMicToggle}
                        aria-label={isMicActive ? 'Stop dictation' : (phase === 'LISTENING' ? 'Stop listening' : 'Start listening')}
                        className={buttonClasses}
                        data-mic-active={isMicActive.toString()}
                    >
                        {phase === 'THINKING' && <div className="lex-console-thinking-ring"></div>}
                        
                        <div className="absolute inset-0 p-4">
                            <VoiceWave isActive={phase === 'LISTENING' || isMicActive} />
                        </div>
                        {phase !== 'LISTENING' && !isMicActive && <MicIcon className="text-white" />}
                        {isMicActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </button>
                    
                    {/* Tap Meter - 4 dots showing click count */}
                    <div className="flex gap-2 mt-3 h-2">
                        {Array.from({length: 4}).map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                    tapCount > i 
                                        ? 'bg-accent-fuchsia shadow-lg shadow-accent-fuchsia/50' 
                                        : 'bg-slate-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Right side - Watermark */}
            <div className="text-right text-slate-400/30 text-xs font-light">
                <p>By Leeway Industries. A rapid webdevelop.com product.</p>
            </div>
        </footer>
    );
};

export default Footer;
