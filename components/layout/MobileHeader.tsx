
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Menu, MessageCircle } from 'lucide-react';

const MenuIcon = () => <Menu className="w-6 h-6" />;
const ChatIcon = () => <MessageCircle className="w-6 h-6" />;


interface MobileHeaderProps {
    onMenuClick: () => void;
    onChatClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, onChatClick }) => {
    return (
        <header className="mobile-header">
            <button onClick={onMenuClick} className="p-2 text-text-light hover:text-white" aria-label="Open menu">
                <MenuIcon />
            </button>
            <div className="text-lg font-bold text-white">LΞX</div>
            <button onClick={onChatClick} className="p-2 text-text-light hover:text-white" aria-label="Open chat">
                <ChatIcon />
            </button>
        </header>
    );
};

export default MobileHeader;
