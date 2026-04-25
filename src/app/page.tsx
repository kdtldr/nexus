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

  const mode = session ? 'chat' : 'home';
  const wsState = session ? 'open' : 'closed';

  return (
    <>
      <div
        className="app"
        data-theme="light"
        data-density="balanced"
        data-mode={mode}
        data-ws={wsState}
      >
        <Rail
          activeNav={activeNav}
          onNav={(id) => {
            setActiveNav(id);
            if (id === 'home') setSession(null);
          }}
          onTweaks={() => setShowTweaks(true)}
        />

        <Sidebar activeConv={activeConv} onConv={handleConvSelect} />

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
