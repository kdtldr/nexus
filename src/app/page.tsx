'use client';

import { useState } from 'react';
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

  // Sidebar auto-collapses when a session is active
  const sidebarVisible = tweaks.showSidebar && !session;

  function handleSend(text: string) {
    setSession({ prompt: text, convId: `conv-${Date.now()}` });
  }

  function handleConvSelect(id: string) {
    setActiveConv(id);
    // Selecting a past conversation re-opens workspace
    setSession({ prompt: 'Q2 LinkedIn narrative — draft 3', convId: id });
  }

  function handleCloseSession() {
    setSession(null);
  }

  return (
    <>
      <div className="shell">
        <Rail
          activeNav={activeNav}
          onNav={(id) => {
            setActiveNav(id);
            // Clicking home from workspace returns to canvas
            if (id === 'home') setSession(null);
          }}
          onTweaks={() => setShowTweaks(true)}
        />

        <div
          className={`sidebar${sidebarVisible ? '' : ' sidebar--collapsed'}`}
          style={{ transition: 'width 220ms cubic-bezier(0.22,1,0.36,1)' }}
        >
          {sidebarVisible && (
            <Sidebar activeConv={activeConv} onConv={handleConvSelect} />
          )}
        </div>

        <div className="main">
          <Topbar onTweaks={() => setShowTweaks(true)} />

          <div className="content">
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
              <Canvas onSend={handleSend} />
            )}
          </div>
        </div>
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
