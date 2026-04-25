'use client';

import { useState } from 'react';
import Rail from '@/components/Rail';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Canvas from '@/components/Canvas';
import TweaksPanel from '@/components/TweaksPanel';
import type { TweakState } from '@/components/TweaksPanel';

export default function Page() {
  const [activeConv, setActiveConv] = useState('c1');
  const [activeNav, setActiveNav] = useState('home');
  const [showTweaks, setShowTweaks] = useState(false);
  const [tweaks, setTweaks] = useState<TweakState>({
    activeAgent: 'riley',
    showThread: false,
    showSidebar: true,
    compactMode: false,
    streamMode: true,
    approvalGate: true,
  });

  function handleSend(text: string) {
    console.log('Send:', text);
  }

  return (
    <>
      <div className="shell">
        <Rail
          activeNav={activeNav}
          onNav={setActiveNav}
          onTweaks={() => setShowTweaks(true)}
        />
        {tweaks.showSidebar && (
          <Sidebar activeConv={activeConv} onConv={setActiveConv} />
        )}
        <div className="main">
          <Topbar onTweaks={() => setShowTweaks(true)} />
          <div className="content">
            <Canvas onSend={handleSend} />
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
