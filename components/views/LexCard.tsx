import React from 'react';

export const LexCard: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center cursor-pointer group" onClick={onEnter}>
            <div className="lex-stage">
                <div className="lex-card">
                    <div className="lex-aura" aria-hidden="true"></div>
                    <div className="lex-glass" aria-hidden="true"></div>
                    <div className="lex-svg" dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="86%" height="86%" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><linearGradient id="lexGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="var(--primary-blue)"/><stop offset="1" stop-color="var(--accent-fuchsia)"/></linearGradient><filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1"/><feColorMatrix in="b1" type="matrix" values="0 0 0 0 0 0 0 0 0.9 0 0 0 0 0.95 0 0 0 0 1 0" result="c1"/><feMerge><feMergeNode in="c1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="160" letter-spacing="8" fill="url(#lexGradient)" filter="url(#glow)" font-weight="900">LΞX</text></g></svg>` }}></div>
                    <div className="lex-sheen" aria-hidden="true"></div>
                </div>
            </div>
            <h1 className="text-3xl font-bold text-white mt-8 group-hover:text-primary-blue transition-colors">Tap to Enter the Ops Center</h1>
        </div>
    );
};
