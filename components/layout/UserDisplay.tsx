
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const UserDisplay: React.FC = () => {
    const { userProfile, greetingSettings } = useAppContext();
    
    if (!userProfile) return null;

    const nameStyle: React.CSSProperties = {
        fontFamily: greetingSettings?.fontFamily || 'inherit',
        fontSize: '1.5rem', // 24px
        lineHeight: '2rem', // 32px
        fontWeight: greetingSettings?.fontWeight || 'bold',
        letterSpacing: greetingSettings?.letterSpacing ? `${greetingSettings.letterSpacing}px` : undefined,
        color: greetingSettings?.textColor || undefined,
        transition: 'all 0.3s ease',
    };
    
    const nameClass = greetingSettings?.textEffect && greetingSettings.textEffect !== 'none' 
        ? `text-effect-${greetingSettings.textEffect}` 
        : '';

    return (
        <div className="mt-auto pt-6 p-4 border-t border-border-color shrink-0">
            <h3 className="text-xs text-text-dark mb-2 font-semibold tracking-wider">OPERATOR</h3>
            <div 
                style={nameStyle} 
                className={`font-bold truncate ${nameClass}`}
                title={userProfile.name}
            >
                {userProfile.name}
            </div>
        </div>
    );
};

export default UserDisplay;
