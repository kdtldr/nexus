'use client';

import { useState } from 'react';

const SUB_AGENTS = [
  { id: 'P', color: '#8250C8', bg: '#EDE1F8' },
  { id: 'N', color: '#14A38A', bg: '#D9F1EC' },
  { id: 'Q', color: '#3E82F7', bg: '#DCE9FD' },
  { id: 'L', color: '#4FA84A', bg: '#DFEFDE' },
];

const SUGGESTIONS = [
  {
    color: '#FFAD00',
    title: 'Launch something',
    sub: 'Ship a campaign end-to-end',
    items: [
      { icon: '✦', text: 'Write a **LinkedIn post** about our Q2 launch — in our voice.' },
      { icon: '▦', text: 'Design a **carousel** from last week\'s blog post.' },
      { icon: '✉', text: 'Draft this week\'s **newsletter** from the 3 top-performing posts.' },
      { icon: '▶', text: 'Cut a **60-sec YouTube short** from the podcast episode.' },
    ],
  },
  {
    color: '#3E82F7',
    title: 'Report on something',
    sub: 'Agents pull the numbers and write it up',
    items: [
      { icon: '↗', text: "Summarize **yesterday's ad spend** across Meta + Google." },
      { icon: '⊞', text: 'Compare **this week vs. last week** across all channels.' },
      { icon: '★', text: "What's our **best-performing post** of the month — and why?" },
      { icon: '◎', text: 'Weekly **competitor scan** — who moved, what launched.' },
    ],
  },
  {
    color: '#4FA84A',
    title: 'Keep a rhythm going',
    sub: 'Schedule something recurring',
    items: [
      { icon: '◈', text: 'Every morning, compile a **news brief** on our category.' },
      { icon: '□', text: 'Post to **LinkedIn + X** Mon/Wed/Fri at 9am — pick the angle.' },
      { icon: 'P', text: 'Flag any **brand mention** with sentiment < 0.3 and draft a reply.' },
      { icon: '✦', text: 'Queue **4 posts/week** for the next month — approve before sending.' },
    ],
  },
];

const RUNWAY_TASKS = [
  { id: 'r1', label: 'News...', agent: 'R', color: '#FFAD00', bg: '#FFF3D1', col: 0, width: 1, status: 'shipped' },
  { id: 'r2', label: 'Thumbn...', agent: 'L', color: '#4FA84A', bg: '#DFEFDE', col: 1, width: 1, status: 'shipped' },
  { id: 'r3', label: 'Repurpose...', agent: 'N', color: '#8250C8', bg: '#EDE1F8', col: 2, width: 1, status: 'shipped' },
  { id: 'r4', label: 'Q2 LinkedIn nar...', agent: 'R', color: '#FFAD00', bg: '#FFF3D1', col: 3, width: 2, status: 'running' },
  { id: 'r5', label: 'Ad repor...', agent: 'Q', color: '#3E82F7', bg: '#DCE9FD', col: 5, width: 1, status: 'queued' },
  { id: 'r6', label: 'Newsletter...', agent: 'N', color: '#8250C8', bg: '#EDE1F8', col: 6, width: 1, status: 'queued' },
  { id: 'r7', label: 'Competiti...', agent: 'Q', color: '#3E82F7', bg: '#DCE9FD', col: 7, width: 1, status: 'queued' },
  { id: 'r8', label: 'EOD...', agent: 'R', color: '#FFAD00', bg: '#FFF3D1', col: 8, width: 1, status: 'queued' },
];

const HOURS = ['8a', '9a', '10a', '11a', '12p', '1', '2p', '3p', '4p', '5p', '6p', '7p'];
const NOW_COL = 4.3; // "NOW" marker position between col 4 and 5

type CanvasProps = {
  onSend: (text: string) => void;
};

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export default function Canvas({ onSend }: CanvasProps) {
  const [prompt, setPrompt] = useState('');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() +
    ' · ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() +
    ' · ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  function handleSend() {
    if (!prompt.trim()) return;
    onSend(prompt);
    setPrompt('');
  }

  return (
    <div className="canvas">
      <div className="canvas__inner">

        {/* ── Greeting ── */}
        <div className="greeting">
          <h1 className="greeting__headline">
            Morning, <em className="greeting__name">Shalu.</em>
          </h1>
          <div className="greeting__date">{dateStr}</div>
        </div>

        {/* ── Agent live card ── */}
        <div className="agent-card">
          <div className="agent-card__avatar">R</div>
          <div className="agent-card__body">
            <div className="agent-card__header">
              <span className="agent-card__name">Riley</span>
              <span className="agent-card__badge">CMO AGENT</span>
            </div>
            <div className="agent-card__status">
              <span className="agent-card__live"><span className="agent-card__live-dot" />LIVE</span>
              <span className="agent-card__task">Drafting <strong>Q2 LinkedIn narrative</strong> · ran 3 tools · 42s in</span>
            </div>
          </div>
          <div className="agent-card__sub-agents">
            {SUB_AGENTS.map(a => (
              <div key={a.id} className="agent-card__sub" style={{ background: a.bg, color: a.color }}>{a.id}</div>
            ))}
            <div className="agent-card__sub agent-card__sub--more">+2</div>
          </div>
        </div>

        {/* ── Prompt ── */}
        <div className="prompt-box">
          <textarea
            className="prompt-box__textarea"
            placeholder="Ask Riley to ship something — a post, a campaign, a report..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
            rows={4}
          />
          <div className="prompt-box__footer">
            <div className="prompt-box__pills">
              <button className="prompt-box__pill prompt-box__pill--amber">
                <span>✦</span> Auto
              </button>
              <button className="prompt-box__pill">
                <GoalIcon /> Goal
              </button>
              <button className="prompt-box__pill">
                <GridIcon /> Brand kit
              </button>
              <button className="prompt-box__pill prompt-box__pill--icon"><AttachIcon /></button>
              <button className="prompt-box__pill prompt-box__pill--icon"><MicIcon /></button>
            </div>
            <div className="prompt-box__right">
              <span className="prompt-box__chars">{prompt.length} chars</span>
              <button className="prompt-box__send" onClick={handleSend} disabled={!prompt.trim()}>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ── 3-col suggestions ── */}
        <div className="suggest-grid">
          {SUGGESTIONS.map(col => (
            <div key={col.title} className="suggest-col">
              <div className="suggest-col__header">
                <span className="suggest-col__dot" style={{ background: col.color }} />
                <span className="suggest-col__title">{col.title}</span>
              </div>
              <div className="suggest-col__sub">{col.sub}</div>
              <div className="suggest-col__items">
                {col.items.map((item, i) => (
                  <button key={i} className="suggest-item" onClick={() => onSend(item.text.replace(/\*\*/g, ''))}>
                    <span className="suggest-item__icon">{item.icon}</span>
                    <span className="suggest-item__text">{renderBold(item.text)}</span>
                    <span className="suggest-item__arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Today's runway ── */}
        <div className="runway">
          <div className="runway__head">
            <span className="runway__title">Today's runway</span>
            <span className="runway__meta">4 shipped · 1 running · 3 queued · ETA 6:45p</span>
          </div>
          <div className="runway__track-wrap">
            {/* Hour labels */}
            <div className="runway__hours">
              {HOURS.map(h => <span key={h} className="runway__hour">{h}</span>)}
            </div>
            {/* Track */}
            <div className="runway__track">
              {/* NOW line */}
              <div className="runway__now" style={{ left: `${(NOW_COL / HOURS.length) * 100}%` }}>
                <span className="runway__now-label">NOW</span>
              </div>
              {/* Task blocks */}
              {RUNWAY_TASKS.map(task => (
                <div
                  key={task.id}
                  className={`runway__block runway__block--${task.status}`}
                  style={{
                    left: `${(task.col / HOURS.length) * 100}%`,
                    width: `${(task.width / HOURS.length) * 100}%`,
                    background: task.bg,
                    borderColor: task.color + '60',
                  }}
                >
                  <span className="runway__block-agent" style={{ background: task.color, color: '#fff' }}>{task.agent}</span>
                  <span className="runway__block-label" style={{ color: task.color }}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom action cards ── */}
        <div className="action-cards">
          {[
            { icon: '⊞', title: 'Browse skills', desc: '312 prebuilt skills across writing, design, analytics, ops.' },
            { icon: '📅', title: 'Open calendar', desc: 'See scheduled runs, approvals, and what ships when.' },
            { icon: '+', title: 'Build a new agent', desc: 'Role + tools + voice. Ready in under 3 minutes.' },
          ].map(card => (
            <button key={card.title} className="action-card">
              <span className="action-card__icon">{card.icon}</span>
              <div className="action-card__body">
                <div className="action-card__title">{card.title}</div>
                <div className="action-card__desc">{card.desc}</div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

function GoalIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function GridIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function AttachIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
}
function MicIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
}
function SendIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
