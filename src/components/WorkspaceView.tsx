'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'agent';
  text: string;
  ts: string;
  hasArtifact?: boolean;
};

type WsTab = 'draft' | 'outline' | 'versions';

type WorkspaceViewProps = {
  agentName: string;
  agentColor: string;
  agentBg: string;
  initialPrompt: string;
  onClose: () => void;
};

const ARTIFACT_CONTENT = `**Q2 LinkedIn Narrative — Draft 3**

*Shalu Sharma · Riley · Apr 25, 2026*

---

The shift isn't subtle anymore.

Every marketing team we talk to is running the same play: more output, same headcount, tighter deadlines. The tools changed. The expectations didn't catch up.

That's the gap **Simplified** was built for.

This quarter, we shipped three things that matter:

**Agent-to-agent workflows.** Your brief goes to Riley. Riley hands off to Nova for creative, Quinn for reporting, Leaf for scheduling. No copy-pasting. No briefing the same context three times. The work flows.

**Real-time brand enforcement.** Every piece of output — post, ad, email — is checked against your brand kit before it leaves the workspace. Not after. Not in review. Before.

**Runway visibility.** You can see everything your team has in flight, queued, and shipped — across every agent, every channel — in a single timeline. No status updates. No Slack threads asking "where's that thing."

We're not building a better content tool.

We're building the operating system for marketing teams that want to move faster without breaking what makes them good.

More next quarter. This is just the start.`;

export default function WorkspaceView({ agentName, agentColor, agentBg, initialPrompt, onClose }: WorkspaceViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<WsTab>('draft');
  const [isTyping, setIsTyping] = useState(true);
  const [visibleChars, setVisibleChars] = useState(0);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fullText = ARTIFACT_CONTENT;

  useEffect(() => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages([{ id: 'u0', role: 'user', text: initialPrompt, ts }]);

    const t = setTimeout(() => {
      const replyTs = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: 'a0', role: 'agent',
        text: "On it. I'll draft the Q2 LinkedIn narrative — pulling from our recent launches and shaping it around what actually moved this quarter.",
        ts: replyTs,
        hasArtifact: true,
      }]);
      setIsTyping(true);
      setVisibleChars(0);
    }, 800);

    return () => clearTimeout(t);
  }, [initialPrompt]);

  useEffect(() => {
    if (!isTyping) return;
    if (visibleChars >= fullText.length) { setIsTyping(false); return; }
    const speed = visibleChars < 200 ? 8 : 4;
    const t = setTimeout(() => setVisibleChars(c => Math.min(c + 6, fullText.length)), speed);
    return () => clearTimeout(t);
  }, [isTyping, visibleChars, fullText.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const ts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages(prev => [...prev, { id: `u${Date.now()}`, role: 'user', text: input, ts }]);
    setInput('');

    setTimeout(() => {
      const replyTs = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: `a${Date.now()}`, role: 'agent',
        text: "Got it — updating the draft now.",
        ts: replyTs, hasArtifact: true,
      }]);
    }, 700);
  }

  function handleCopy() {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const displayedText = fullText.slice(0, visibleChars);

  return (
    <>
      {/* Thread pane */}
      <div className="thread-pane">
        <div className="thread-head">
          <div className="av" style={{ background: agentBg, color: agentColor }}>{agentName[0]}</div>
          <div>
            <div className="title">{agentName}</div>
            <div className="sub">LIVE · active session</div>
          </div>
          <div className="spacer" />
          <button className="head-btn" onClick={onClose}>
            <BackIcon /> Back
          </button>
        </div>

        <div className="thread-scroll">
          <div className="thread-inner">
            <div className="day-divider">Today</div>

            {messages.map(msg => (
              <div key={msg.id} className={`m${msg.role === 'user' ? ' user' : ' riley'}`}>
                <div
                  className="m-av"
                  style={msg.role === 'agent'
                    ? { background: agentBg, color: agentColor }
                    : { background: 'var(--nx-panel-2)', color: 'var(--nx-ink-2)' }}
                >
                  {msg.role === 'agent' ? agentName[0] : 'SS'}
                </div>
                <div className="m-body">
                  <div className="m-head">
                    <span className="m-name">{msg.role === 'agent' ? agentName : 'You'}</span>
                    <span className="m-time">{msg.ts}</span>
                  </div>
                  <div className="m-text"><p>{msg.text}</p></div>
                  {msg.hasArtifact && (
                    <div className="artifact-list">
                      <div className="artifact">
                        <div className="thumb"><DocIcon /></div>
                        <div className="info">
                          <div className="name">Q2 LinkedIn narrative — draft {isTyping ? '(writing…)' : '3'}</div>
                          <div className="kind">doc · {isTyping ? 'generating' : '420 words'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="prompt-dock">
          <div className="prompt-dock-inner">
            <div className="prompt-wrap">
              <input
                type="text"
                className="prompt-textarea"
                style={{ minHeight: 'auto', padding: '10px 14px' }}
                placeholder={`Reply to ${agentName}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              />
              <div className="prompt-toolbar">
                <div className="spacer" />
                <button className="prompt-send" onClick={handleSend} disabled={!input.trim()}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace panel */}
      <div className="workspace">
        <div className="ws-head">
          <div className="ws-title">
            <span className="dot" />
            Q2 LinkedIn narrative
          </div>
          <div className="spacer" />
          <button className="ws-icon" onClick={handleCopy} title="Copy">
            <CopyIcon />
          </button>
          <button className="ws-icon" title="Share">
            <ShareIcon />
          </button>
          <button className="ws-icon" title="Publish" style={{ background: 'var(--nx-ink)', color: 'var(--nx-canvas)', borderRadius: 7 }}>
            <PublishIcon />
          </button>
        </div>

        <div className="ws-tabs">
          {(['draft', 'outline', 'versions'] as WsTab[]).map(tab => (
            <button
              key={tab}
              className={`ws-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'versions' && <span className="count">3</span>}
            </button>
          ))}
        </div>

        <div className="ws-body">
          {activeTab === 'draft' && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.65, color: 'var(--nx-ink-2)' }}>
              {displayedText.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                  return <h3 key={i} style={{ marginBottom: 8, color: 'var(--nx-ink)' }}>{line.replace(/\*\*/g, '')}</h3>;
                }
                if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                  return <p key={i} style={{ color: 'var(--nx-ink-3)', fontSize: 12, marginBottom: 12 }}>{line.replace(/\*/g, '')}</p>;
                }
                if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--nx-line)', margin: '12px 0 16px' }} />;
                if (line === '') return <br key={i} />;
                const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--nx-ink)">$1</strong>');
                return <p key={i} style={{ marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: bold }} />;
              })}
              {isTyping && <span style={{ display: 'inline-block', width: 2, height: '1em', background: 'var(--nx-accent)', marginLeft: 2, animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} />}
            </div>
          )}

          {activeTab === 'outline' && (
            <div>
              <h4 style={{ marginBottom: 16, color: 'var(--nx-ink)' }}>Outline</h4>
              {['Hook — the shift', 'Problem framing', 'Three Q2 launches', 'Vision statement', 'CTA'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--nx-line)', fontSize: 14, color: 'var(--nx-ink-2)' }}>
                  <span style={{ color: 'var(--nx-ink-4)', fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 20 }}>{i + 1}.</span>
                  {item}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'versions' && (
            <div>
              <h4 style={{ marginBottom: 16, color: 'var(--nx-ink)' }}>Version history</h4>
              {[
                { v: 'Draft 3', time: 'Just now', note: 'Current — tighter hook, removed stats' },
                { v: 'Draft 2', time: '11:40a', note: 'Added Q2 milestones section' },
                { v: 'Draft 1', time: '10:05a', note: 'First pass from brief' },
              ].map(ver => (
                <div key={ver.v} className="ws-artifact">
                  <div className="preview"><DocIcon /></div>
                  <div className="info">
                    <div className="name">{ver.v}</div>
                    <div className="meta">{ver.time}</div>
                    <div className="desc">{ver.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </>
  );
}

function BackIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function SendIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function DocIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function CopyIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
}
function ShareIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function PublishIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
}
