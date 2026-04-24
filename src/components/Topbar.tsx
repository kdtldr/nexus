'use client';

import { AGENTS } from './Sidebar';

type TopbarProps = {
  activeAgent: string;
  showThread: boolean;
  onToggleThread: () => void;
  onTweaks: () => void;
};

export default function Topbar({ activeAgent, showThread, onToggleThread, onTweaks }: TopbarProps) {
  const agent = AGENTS.find(a => a.id === activeAgent) ?? AGENTS[0];

  return (
    <header className="topbar">
      <div className="topbar__breadcrumb">
        <span>Workspace</span>
        <span className="topbar__breadcrumb-sep">/</span>
        <span className="topbar__breadcrumb-current">{agent.name}</span>
      </div>

      <div className="topbar__status">
        <div className="topbar__status-dot" />
        Active
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__actions">
        <button className="topbar__btn" onClick={onToggleThread}>
          <ThreadIcon />
          {showThread ? 'Hide thread' : 'Show thread'}
        </button>
        <button className="topbar__btn" onClick={onTweaks}>
          <TweaksIcon />
          Tweaks
        </button>
        <button className="topbar__btn topbar__btn--primary">
          <ShareIcon />
          Share
        </button>
      </div>
    </header>
  );
}

function ThreadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function TweaksIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="8" y1="12" x2="20" y2="12"/>
      <line x1="12" y1="18" x2="20" y2="18"/>
      <circle cx="2" cy="6" r="2" fill="currentColor" stroke="none"/>
      <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}
