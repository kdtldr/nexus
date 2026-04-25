'use client';

import { useState } from 'react';

const CONVERSATIONS = {
  TODAY: [
    { id: 'c1', title: 'Q2 LinkedIn narrative — draft 3', time: 'now', color: '#FFAD00', status: 'running' },
    { id: 'c2', title: 'Repurpose blog → 4 Instagr...', time: '11:40a', color: '#4FA84A', status: 'done' },
    { id: 'c3', title: 'YouTube thumbnail — prici...', time: '10:05a', color: '#3E82F7', status: 'done' },
    { id: 'c4', title: 'Daily news brief · Apr 24', time: '8:00a', color: '#FFAD00', status: 'done' },
  ],
  YESTERDAY: [
    { id: 'c5', title: 'Meme generator → 6 variati...', time: '4:20p', color: '#8250C8', status: 'done' },
    { id: 'c6', title: 'Quote cards from podcast clip', time: '2:10p', color: '#14A38A', status: 'done' },
    { id: 'c7', title: 'Essay: why agentic marketi...', time: '11:02a', color: '#FFAD00', status: 'done' },
    { id: 'c8', title: 'Facebook ad — spring promo', time: '9:15a', color: '#E5526E', status: 'done' },
  ],
  'EARLIER THIS WEEK': [
    { id: 'c9', title: 'Weekly competitor scan', time: 'Tue', color: '#3E82F7', status: 'done' },
    { id: 'c10', title: "Newsletter → 'Agentic is a verb'", time: 'Mon', color: '#FFAD00', status: 'done' },
    { id: 'c11', title: 'Brand voice: softer, less hype', time: 'Mon', color: '#14A38A', status: 'done' },
    { id: 'c12', title: 'Pricing page copy v2', time: 'Fri', color: '#8250C8', status: 'done' },
  ],
};

type SidebarProps = {
  activeConv: string;
  onConv: (id: string) => void;
};

export default function Sidebar({ activeConv, onConv }: SidebarProps) {
  const [search, setSearch] = useState('');

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="ws-badge">S</div>
        <div>
          <div className="ws-name">Simplified</div>
          <div className="ws-tier">Business · 12 seats</div>
        </div>
        <button className="ws-switch"><ChevronIcon /></button>
      </div>

      <div className="agent-switch">
        <div className="av">R</div>
        <div className="meta">
          <div className="name">Riley</div>
          <div className="role">CMO · Lead agent</div>
        </div>
        <ChevronIcon />
      </div>

      <button className="new-chat">
        <PlusIcon /> New conversation
      </button>

      <div className="sidebar-search">
        <span className="ico"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search conversations…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <kbd>⌘K</kbd>
      </div>

      <div className="convos">
        {Object.entries(CONVERSATIONS).map(([group, convs]) => {
          const filtered = convs.filter(c =>
            !search || c.title.toLowerCase().includes(search.toLowerCase())
          );
          if (!filtered.length) return null;
          return (
            <div key={group} className="convo-group">
              <div className="convo-group-label">{group}</div>
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  className={`convo${conv.status === 'running' ? ' running' : ' done'}${activeConv === conv.id ? ' active' : ''}`}
                  onClick={() => onConv(conv.id)}
                >
                  <span className="dot" style={{ background: conv.color }} />
                  <span className="title">{conv.title}</span>
                  <span className="time">{conv.time}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="sidebar-foot">
        <div className="usage">
          <strong>27,284</strong> / 40,000 credits
          <div className="usage-bar"><span /></div>
        </div>
        <button className="upgrade">Upgrade</button>
      </div>
    </aside>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
