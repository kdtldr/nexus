'use client';

import { useState } from 'react';

const SUB_AGENTS = [
  { id: 'P', bg: '#8250C8' },
  { id: 'N', bg: '#14A38A' },
  { id: 'Q', bg: '#3E82F7' },
  { id: 'L', bg: '#4FA84A' },
];

const SUGGESTIONS = [
  {
    color: '#FFAD00',
    title: 'Launch something',
    sub: 'Ship a campaign end-to-end',
    items: [
      { text: 'Write a **LinkedIn post** about our Q2 launch — in our voice.' },
      { text: 'Design a **carousel** from last week\'s blog post.' },
      { text: 'Draft this week\'s **newsletter** from the 3 top-performing posts.' },
      { text: 'Cut a **60-sec YouTube short** from the podcast episode.' },
    ],
  },
  {
    color: '#3E82F7',
    title: 'Report on something',
    sub: 'Agents pull the numbers and write it up',
    items: [
      { text: "Summarize **yesterday's ad spend** across Meta + Google." },
      { text: 'Compare **this week vs. last week** across all channels.' },
      { text: "What's our **best-performing post** of the month — and why?" },
      { text: 'Weekly **competitor scan** — who moved, what launched.' },
    ],
  },
  {
    color: '#4FA84A',
    title: 'Keep a rhythm going',
    sub: 'Schedule something recurring',
    items: [
      { text: 'Every morning, compile a **news brief** on our category.' },
      { text: 'Post to **LinkedIn + X** Mon/Wed/Fri at 9am — pick the angle.' },
      { text: 'Flag any **brand mention** with sentiment < 0.3 and draft a reply.' },
      { text: 'Queue **4 posts/week** for the next month — approve before sending.' },
    ],
  },
];

const RUNWAY_TASKS = [
  { id: 'r1', label: 'News brief', agent: 'R', agentBg: '#FFAD00', col: 0, width: 1, status: 'done' },
  { id: 'r2', label: 'Thumbnail', agent: 'L', agentBg: '#4FA84A', col: 1, width: 1, status: 'done' },
  { id: 'r3', label: 'Repurpose', agent: 'N', agentBg: '#8250C8', col: 2, width: 1, status: 'done' },
  { id: 'r4', label: 'Q2 LinkedIn narrative', agent: 'R', agentBg: '#FFAD00', col: 3, width: 2, status: 'run' },
  { id: 'r5', label: 'Ad report', agent: 'Q', agentBg: '#3E82F7', col: 5, width: 1, status: 'queued' },
  { id: 'r6', label: 'Newsletter', agent: 'N', agentBg: '#8250C8', col: 6, width: 1, status: 'queued' },
  { id: 'r7', label: 'Comp scan', agent: 'Q', agentBg: '#3E82F7', col: 7, width: 1, status: 'queued' },
  { id: 'r8', label: 'EOD report', agent: 'R', agentBg: '#FFAD00', col: 8, width: 1, status: 'queued' },
];

const HOURS = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
const NOW_COL = 4.3;

const QUICK_CARDS = [
  { icon: '⊞', bg: '#DCE9FD', color: '#3E82F7', title: 'Browse skills', desc: '312 prebuilt skills across writing, design, analytics, ops.' },
  { icon: '📅', bg: '#DFEFDE', color: '#4FA84A', title: 'Open calendar', desc: 'See scheduled runs, approvals, and what ships when.' },
  { icon: '+', bg: '#FFF3D1', color: '#FFAD00', title: 'Build a new agent', desc: 'Role + tools + voice. Ready in under 3 minutes.' },
];

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
  const dateStr =
    now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() +
    ' · ' +
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() +
    ' · ' +
    now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  function handleSend() {
    if (!prompt.trim()) return;
    onSend(prompt);
    setPrompt('');
  }

  return (
    <div className="canvas">
      <div className="canvas-inner">

        {/* Greeting */}
        <div className="greet">
          <h1 className="hi">Morning, <em>Shalu.</em></h1>
          <span className="date">{dateStr}</span>
        </div>

        {/* Riley persona card */}
        <div className="persona">
          <div className="av">R</div>
          <div className="body">
            <h3>
              Riley
              <span className="role-pill">CMO AGENT</span>
            </h3>
            <div className="status">
              <span className="live">
                <span className="ring" />
                LIVE
              </span>
              Drafting <b>Q2 LinkedIn narrative</b> · ran 3 tools · 42s in
            </div>
          </div>
          <div className="fleet">
            {SUB_AGENTS.map(a => (
              <div key={a.id} className="av-sm" style={{ background: a.bg }}>{a.id}</div>
            ))}
            <div className="more">+2</div>
          </div>
        </div>

        {/* Prompt */}
        <div className="prompt-wrap">
          <textarea
            className="prompt-textarea"
            placeholder="Ask Riley to ship something — a post, a campaign, a report…"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
            rows={3}
          />
          <div className="prompt-toolbar">
            <button className="prompt-mode">
              <span>✦</span> Auto
            </button>
            <button className="prompt-tool">
              <GoalIcon /> Goal
            </button>
            <button className="prompt-tool">
              <GridIcon /> Brand kit
            </button>
            <button className="prompt-tool attach">
              <AttachIcon />
            </button>
            <div className="spacer" />
            <button className="prompt-send" onClick={handleSend} disabled={!prompt.trim()}>
              <SendIcon />
            </button>
          </div>
        </div>

        {/* 3-col suggestions */}
        <div className="sugg-groups">
          {SUGGESTIONS.map(col => (
            <div key={col.title} className="sugg-group">
              <h4>
                <span className="spot" style={{ background: col.color }} />
                {col.title}
              </h4>
              <div className="sub">{col.sub}</div>
              <div className="sugg-list">
                {col.items.map((item, i) => (
                  <button
                    key={i}
                    className="sugg"
                    onClick={() => onSend(item.text.replace(/\*\*/g, ''))}
                  >
                    <span className="sugg-ico" style={{ background: col.color + '18' }}>
                      <ArrowIcon />
                    </span>
                    <span className="sugg-text">{renderBold(item.text)}</span>
                    <span className="arrow"><ArrowRightIcon /></span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Runway */}
        <div className="runway">
          <div className="runway-head">
            <h4>Today's runway</h4>
            <span className="meta">4 shipped · 1 running · 3 queued · ETA 6:45p</span>
          </div>
          <div className="runway-timeline">
            <div className="runway-hours">
              {HOURS.map(h => <span key={h}>{h}</span>)}
            </div>
            <div className="runway-track">
              <div className="now-line" style={{ left: `${(NOW_COL / HOURS.length) * 100}%` }} />
              {RUNWAY_TASKS.map(task => (
                <div
                  key={task.id}
                  className={`runway-bar ${task.status}`}
                  style={{
                    left: `${(task.col / HOURS.length) * 100}%`,
                    width: `${(task.width / HOURS.length) * 100}%`,
                  }}
                >
                  <span className="who" style={{ background: task.agentBg }}>{task.agent}</span>
                  <span className="what">{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick cards */}
        <div className="quick-row">
          {QUICK_CARDS.map(card => (
            <button key={card.title} className="quick-card">
              <div className="ico" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
              <div>
                <h5>{card.title}</h5>
                <p>{card.desc}</p>
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
function SendIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function ArrowIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}
function ArrowRightIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
