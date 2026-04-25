'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'agent';
  text: string;
  ts: string;
  hasArtifact?: boolean;
};

type ArtifactTab = 'draft' | 'outline' | 'versions';

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

function parseArtifact(raw: string) {
  return raw.trim().split('\n');
}

export default function WorkspaceView({ agentName, agentColor, agentBg, initialPrompt, onClose }: WorkspaceViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<ArtifactTab>('draft');
  const [isTyping, setIsTyping] = useState(true);
  const [visibleChars, setVisibleChars] = useState(0);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const artifactLines = parseArtifact(ARTIFACT_CONTENT);
  const fullText = ARTIFACT_CONTENT;

  useEffect(() => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setMessages([{ id: 'u0', role: 'user', text: initialPrompt, ts }]);

    const agentDelay = setTimeout(() => {
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

    return () => clearTimeout(agentDelay);
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
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', text: input, ts };
    setMessages(prev => [...prev, userMsg]);
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
    <div className="workspace">
      {/* ── Thread column ── */}
      <div className="thread-col">
        <div className="thread-col__head">
          <div className="thread-col__agent">
            <div className="thread-col__agent-av" style={{ background: agentColor }}>{agentName[0]}</div>
            <div>
              <div className="thread-col__agent-name">{agentName}</div>
              <div className="thread-col__agent-status">
                <span className="thread-col__agent-dot" />
                LIVE
              </div>
            </div>
          </div>
          <button className="thread-col__close" onClick={onClose} title="Back to home">
            <BackIcon />
          </button>
        </div>

        <div className="thread-col__messages">
          {messages.map(msg => (
            <div key={msg.id} className={`msg${msg.role === 'user' ? ' msg--user' : ''}`}>
              <div
                className="msg__av"
                style={msg.role === 'agent'
                  ? { background: agentBg, color: agentColor }
                  : { background: 'var(--ink)', color: 'var(--amber-300)' }}
              >
                {msg.role === 'agent' ? agentName[0] : 'SS'}
              </div>
              <div className="msg__body">
                <div className="msg__bubble">{msg.text}</div>
                {msg.hasArtifact && (
                  <button className="msg__artifact-link">
                    <DocIcon />
                    Q2 LinkedIn narrative — draft {isTyping ? '(writing…)' : '3'}
                  </button>
                )}
                <div className="msg__time">{msg.ts}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="thread-col__composer">
          <div className="thread-col__input">
            <input
              type="text"
              placeholder={`Reply to ${agentName}…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button className="thread-col__send" onClick={handleSend}>
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Artifact pane ── */}
      <div className="artifact-pane">
        <div className="artifact-pane__head">
          <div className="artifact-pane__tabs">
            {(['draft', 'outline', 'versions'] as ArtifactTab[]).map(tab => (
              <button
                key={tab}
                className={`artifact-pane__tab${activeTab === tab ? ' artifact-pane__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'versions' && <span style={{ marginLeft: 4, fontSize: 10, background: 'var(--surface-2)', borderRadius: 'var(--r-full)', padding: '1px 6px', color: 'var(--ink-4)' }}>3</span>}
              </button>
            ))}
          </div>
          <div className="artifact-pane__actions">
            <button className="artifact-pane__btn" onClick={handleCopy}>
              <CopyIcon />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="artifact-pane__btn">
              <ShareIcon />
              Share
            </button>
            <button className="artifact-pane__btn" style={{ background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' }}>
              <PublishIcon />
              Publish
            </button>
          </div>
        </div>

        <div className="artifact-pane__body">
          {activeTab === 'draft' && (
            <div className="artifact-doc">
              {displayedText.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                  return <h1 key={i}>{line.replace(/\*\*/g, '')}</h1>;
                }
                if (line.startsWith('*') && line.endsWith('*') && line.length > 2 && !line.startsWith('**')) {
                  return <p key={i} className="artifact-meta">{line.replace(/\*/g, '')}</p>;
                }
                if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '0 0 var(--s-5)' }} />;
                if (line === '') return <br key={i} />;
                const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
              })}
              {isTyping && <span className="artifact-typing" />}
            </div>
          )}
          {activeTab === 'outline' && (
            <div className="artifact-doc">
              <h1>Outline</h1>
              {['Hook — the shift', 'Problem framing', 'Three Q2 launches', 'Vision statement', 'CTA'].map((item, i) => (
                <p key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--ink-4)', fontVariantNumeric: 'tabular-nums', minWidth: 20 }}>{i + 1}.</span>
                  {item}
                </p>
              ))}
            </div>
          )}
          {activeTab === 'versions' && (
            <div className="artifact-doc">
              <h1>Version history</h1>
              {[
                { v: 'Draft 3', time: 'Just now', note: 'Current — tighter hook, removed stats' },
                { v: 'Draft 2', time: '11:40a', note: 'Added Q2 milestones section' },
                { v: 'Draft 1', time: '10:05a', note: 'First pass from brief' },
              ].map(ver => (
                <div key={ver.v} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 'var(--s-4)', paddingBottom: 'var(--s-4)', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 'var(--t-body-sm)' }}>{ver.v}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{ver.note}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-4)', flexShrink: 0 }}>{ver.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function SendIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function DocIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function CopyIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
}
function ShareIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function PublishIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
}
