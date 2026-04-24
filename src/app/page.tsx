'use client';

import { useState } from 'react';
import Rail from '@/components/Rail';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Canvas from '@/components/Canvas';
import ThreadPane from '@/components/ThreadPane';
import TweaksPanel from '@/components/TweaksPanel';
import type { Message } from '@/components/ThreadPane';
import type { TweakState } from '@/components/TweaksPanel';
import { AGENTS } from '@/components/Sidebar';

const AGENT_REPLIES: Record<string, string[]> = {
  riley: [
    "On it. I'll pull together the key priorities and flag any blockers.",
    "Got it — drafting the agenda now. Anything specific to include?",
    "Sure. I'll check the calendar and surface what needs your attention today.",
  ],
  pax: [
    "Searching across the latest reports. Give me a moment…",
    "Analysing the data. I'll surface the key patterns and outliers.",
    "Found 12 relevant sources. Let me synthesise the key insights.",
  ],
  nova: [
    "Love the brief. Let me explore a few angles and come back with options.",
    "Thinking about positioning… Here are three directions worth exploring.",
    "Great starting point. I'll riff on this and push it further.",
  ],
  quinn: [
    "Running the numbers. I'll have a clean summary ready shortly.",
    "Pulling the relevant data and structuring it for the report.",
    "Interesting question. Let me model this across a few dimensions.",
  ],
  leaf: [
    "Checking the available integrations. This looks automatable.",
    "I can build this workflow. Let me map out the steps first.",
    "Connecting to the APIs now. I'll ping you when it's live.",
  ],
  rose: [
    "Great brief. I'll draft three variants with different tones.",
    "On it — personalising the sequence now for each segment.",
    "Crafting the message. I'll keep it human, warm, and direct.",
  ],
};

function agentReply(agentId: string): string {
  const replies = AGENT_REPLIES[agentId] ?? AGENT_REPLIES.riley;
  return replies[Math.floor(Math.random() * replies.length)];
}

const DEMO_MESSAGES: Message[] = [
  {
    id: 'demo-1',
    role: 'user',
    text: 'Can you run a quick market analysis for our Series B deck?',
    ts: '10:24 am',
  },
  {
    id: 'demo-task',
    role: 'agent',
    text: '',
    ts: '10:24 am',
    type: 'task',
  },
  {
    id: 'demo-widgets',
    role: 'agent',
    text: '',
    ts: '10:31 am',
    type: 'widgets',
  },
  {
    id: 'demo-2',
    role: 'agent',
    text: 'Done — I found 142 high-fit leads and ran scoring across 8 criteria. Top segment is Series A SaaS in fintech. Want me to draft the outreach?',
    ts: '10:31 am',
  },
  {
    id: 'demo-approval',
    role: 'agent',
    text: '',
    ts: '10:32 am',
    type: 'approval',
  },
];

export default function Page() {
  const [tweaks, setTweaks] = useState<TweakState>({
    activeAgent: 'riley',
    showThread: false,
    showSidebar: true,
    compactMode: false,
    streamMode: true,
    approvalGate: true,
  });
  const [showTweaks, setShowTweaks] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);

  function handleSend(text: string) {
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: `m-${Date.now()}`, role: 'user', text, ts };
    const replyMsg: Message = {
      id: `r-${Date.now()}`,
      role: 'agent',
      text: agentReply(tweaks.activeAgent),
      ts,
    };

    setMessages(prev => [...prev, userMsg, replyMsg]);

    if (!tweaks.showThread) {
      setTweaks(t => ({ ...t, showThread: true }));
    }
  }

  function handleTweakChange(next: Partial<TweakState>) {
    setTweaks(t => ({ ...t, ...next }));
  }

  const agent = AGENTS.find(a => a.id === tweaks.activeAgent) ?? AGENTS[0];

  return (
    <>
      <div className="shell">
        <Rail
          activeNav={activeNav}
          onNav={setActiveNav}
          onTweaks={() => setShowTweaks(true)}
        />

        {tweaks.showSidebar && (
          <Sidebar
            activeAgent={tweaks.activeAgent}
            onAgent={id => handleTweakChange({ activeAgent: id })}
          />
        )}

        <div className="main">
          <Topbar
            activeAgent={tweaks.activeAgent}
            showThread={tweaks.showThread}
            onToggleThread={() => handleTweakChange({ showThread: !tweaks.showThread })}
            onTweaks={() => setShowTweaks(true)}
          />

          <div className="content">
            <Canvas
              activeAgent={tweaks.activeAgent}
              onSend={handleSend}
            />

            {tweaks.showThread && (
              <ThreadPane
                activeAgent={tweaks.activeAgent}
                messages={messages}
                onClose={() => handleTweakChange({ showThread: false })}
                onSend={handleSend}
              />
            )}
          </div>
        </div>
      </div>

      {showTweaks && (
        <TweaksPanel
          tweaks={tweaks}
          onChange={handleTweakChange}
          onClose={() => setShowTweaks(false)}
        />
      )}
    </>
  );
}
