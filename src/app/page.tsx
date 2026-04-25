'use client';

import { useState, useEffect } from 'react';
import Rail from '@/components/Rail';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Canvas from '@/components/Canvas';
import WorkspaceView from '@/components/WorkspaceView';
import TweaksPanel from '@/components/TweaksPanel';
import type { TweakState } from '@/components/TweaksPanel';

type ActiveSession = {
  prompt: string;
  convId: string;
};

export default function Page() {
  const [activeConv, setActiveConv] = useState('c1');
  const [activeNav, setActiveNav] = useState('home');
  const [showTweaks, setShowTweaks] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [tweaks, setTweaks] = useState<TweakState>({
    activeAgent: 'riley',
    showThread: false,
    showSidebar: true,
    compactMode: false,
    streamMode: true,
    approvalGate: true,
  });

  // data-theme and data-density must be on <html> (= :root) for CSS vars to resolve
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-density', 'balanced');
    return () => {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-density');
    };
  }, []);

  function handleSend(text: string) {
    setSession({ prompt: text, convId: `conv-${Date.now()}` });
  }

  function handleConvSelect(id: string) {
    setActiveConv(id);
    setSession({ prompt: 'Q2 LinkedIn narrative — draft 3', convId: id });
  }

  function handleCloseSession() {
    setSession(null);
  }

  return (
    <>
      <div
        className="app"
        data-mode={session ? 'chat' : 'home'}
        data-ws={session ? 'open' : 'closed'}
      >
        <Rail
          activeNav={activeNav}
          onNav={(id) => {
            setActiveNav(id);
            if (id === 'home') setSession(null);
          }}
          onTweaks={() => setShowTweaks(true)}
        />

        {/* Sidebar only visible on home — collapses when session is active */}
        {!session && (
          <Sidebar activeConv={activeConv} onConv={handleConvSelect} />
        )}

        {session ? (
          <WorkspaceView
            key={session.convId}
            agentName="Riley"
            agentColor="#FFAD00"
            agentBg="#FFF3D1"
            initialPrompt={session.prompt}
            onClose={handleCloseSession}
          />
        ) : (
          <div className="main">
            <Topbar onTweaks={() => setShowTweaks(true)} />
            <Canvas onSend={handleSend} />
          </div>
        )}
      </div>

      {showTweaks && (
        <TweaksPanel
          tweaks={tweaks}
          onChange={next => setTweaks(t => ({ ...t, ...next }))}
          onClose={() => setShowTweaks(false)}
        />
      )}
    </>
  );
}
