'use client';

import { useState } from 'react';

const CONVERSATIONS = {
  TODAY: [
    { id: 'c1', title: 'Q2 LinkedIn narrative — draft 3', time: 'now', color: '#FFAD00' },
    { id: 'c2', title: 'Repurpose blog → 4 Instagr...', time: '11:40a', color: '#4FA84A' },
    { id: 'c3', title: 'YouTube thumbnail — prici...', time: '10:05a', color: '#3E82F7' },
    { id: 'c4', title: 'Daily news brief · Apr 24', time: '8:00a', color: '#FFAD00' },
  ],
  YESTERDAY: [
    { id: 'c5', title: 'Meme generator → 6 variati...', time: '4:20p', color: '#8250C8' },
    { id: 'c6', title: 'Quote cards from podcast clip', time: '2:10p', color: '#14A38A' },
    { id: 'c7', title: "Essay: why agentic marketi...", time: '11:02a', color: '#FFAD00' },
    { id: 'c8', title: 'Facebook ad — spring promo', time: '9:15a', color: '#E5526E' },
  ],
  'EARLIER THIS WEEK': [
    { id: 'c9', title: 'Weekly competitor scan', time: 'Tue', color: '#3E82F7' },
    { id: 'c10', title: "Newsletter → 'Agentic is a verb'", time: 'Mon', color: '#FFAD00' },
    { id: 'c11', title: 'Brand voice: softer, less hype', time: 'Mon', color: '#14A38A' },
    { id: 'c12', title: 'Pricing page copy v2', time: 'Fri', color: '#8250C8' },
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
      {/* Workspace selector */}
      <div className="sidebar__workspace">
        <div className="sidebar__workspace-logo">S</div>
        <div className="sidebar__workspace-info">
          <div className="sidebar__workspace-name">Simplified</div>
          <div className="sidebar__workspace-plan">BUSINESS · 12 SEATS</div>
        </div>
        <ChevronIcon />
      </div>

      {/* Agent */}
      <div className="sidebar__agent">
        <div className="sidebar__agent-avatar">R</div>
        <div className="sidebar__agent-info">
          <div className="sidebar__agent-name">Riley</div>
          <div className="sidebar__agent-role">CMO · Lead agent</div>
        </div>
        <ChevronIcon />
      </div>

      {/* New conversation */}
      <div className="sidebar__new-wrap">
        <button className="sidebar__new-btn">
          <PlusIcon /> New conversation
        </button>
      </div>

      {/* Search */}
      <div className="sidebar__search-wrap">
        <div className="sidebar__search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="sidebar__search-kbd">⌘K</span>
        </div>
      </div>

      {/* Conversation list */}
      <div className="sidebar__body">
        {Object.entries(CONVERSATIONS).map(([group, convs]) => {
          const filtered = convs.filter(c =>
            !search || c.title.toLowerCase().includes(search.toLowerCase())
          );
          if (!filtered.length) return null;
          return (
            <div key={group}>
              <div className="sidebar__group-label">{group}</div>
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  className={`sidebar__conv${activeConv === conv.id ? ' sidebar__conv--active' : ''}`}
                  onClick={() => onConv(conv.id)}
                >
                  <span className="sidebar__conv-dot" style={{ background: conv.color }} />
                  <span className="sidebar__conv-title">{conv.title}</span>
                  <span className="sidebar__conv-time">{conv.time}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__credits">
          <div className="sidebar__credits-label">
            <span>27,284</span>
            <span className="sidebar__credits-total"> / 40,000 credits</span>
          </div>
          <div className="sidebar__credits-bar">
            <div className="sidebar__credits-fill" style={{ width: '68%' }} />
          </div>
        </div>
        <button className="sidebar__upgrade">Upgrade</button>
      </div>
    </aside>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--ink-4)' }}>
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
