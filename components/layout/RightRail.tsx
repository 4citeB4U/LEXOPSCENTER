
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useVoiceControl } from '../../contexts/VoiceControlContext';
import { ChatMessage, Phase } from '../../types';
import { Save, Send } from 'lucide-react';

const SaveIcon = () => <Save className="w-4 h-4" />;

const PhaseIndicator: React.FC<{ phase: Phase, transcript: string }> = ({ phase, transcript }) => {
    const textClasses = "text-center text-sm text-slate-400";
    const phaseInfo: Record<Phase, { text: string; color: string }> = {
        IDLE: { text: "Tap mic to start", color: "border-slate-600" },
        LISTENING: { text: transcript || "Listening...", color: "border-indigo-500 animate-pulse" },
        SPEAKING: { text: "Speaking...", color: "border-teal-500" },
        THINKING: { text: "Thinking...", color: "border-amber-500" },
        PAUSED: { text: "Paused", color: "border-slate-500" },
    };

    const {text, color} = phaseInfo[phase];

  return (
    <div className="border-b border-slate-700" style={{height: '56px', padding: '0.7rem 1rem'}}>
      <div className={`border-2 ${color} rounded-lg p-2 transition-all h-full flex items-center justify-center`}>
        <p className={textClasses}>{text}</p>
      </div>
    </div>
  );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-indigo-500 self-end'
        : 'bg-slate-700 self-start';
    
    if (message.isThinking) {
        return (
            <div className="bg-slate-700 self-start rounded-lg p-3 max-w-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className={`rounded-lg p-3 max-w-sm break-words ${bubbleClasses}`}>
            <p className="text-white">{message.text}</p>
        </div>
    );
};

const RightRail: React.FC = () => {
  const { chatHistory, saveAndClearChat, isRightRailOpen } = useAppContext();
  const { phase, transcript } = useVoiceControl();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message to chat
      const userMessage: ChatMessage = {
        role: 'user',
        text: chatInput.trim(),
        isThinking: false
      };
      
      // For now, just clear the input - you can integrate with your chat system later
      setChatInput('');
      
      // You can add the message to chat history here if needed
      // addMessageToChat(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const railClasses = [
    'right-rail',
    'w-80',
    'bg-slate-800',
    'flex',
    'flex-col',
    'h-full',
    'border-l',
    'border-slate-700',
    'shrink-0',
    'z-30', // Ensure it stays above main content but does not overlap
    'fixed md:static top-[60px] md:top-0 right-0', // Fixed on mobile below header, static on desktop
    'max-h-screen',
    isRightRailOpen ? 'right-rail-open' : ''
  ].join(' ');

  return (
    <aside className={railClasses}>
      <div className="flex flex-col h-full">
        <PhaseIndicator phase={phase} transcript={transcript} />
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {chatHistory.length > 0 ? chatHistory.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            )) : (
              <div className="text-center text-slate-500 pt-10">
                  <p>Chat history is empty.</p>
                  <p className="text-xs mt-2">Conversations are saved to your notes.</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="p-4 border-t border-slate-700">
        {/* Chat Input Box */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-fuchsia focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="p-2 bg-accent-fuchsia hover:bg-accent-fuchsia/80 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <button 
            onClick={saveAndClearChat}
            disabled={chatHistory.length === 0}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm bg-slate-700 hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
            <SaveIcon />
            Save & Clear Chat
        </button>
        </div>
      </div>
    </aside>
  );
};

export default RightRail;
