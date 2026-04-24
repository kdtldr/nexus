'use client';

import { useState } from 'react';

export const AGENTS = [
  { id: 'riley',  name: 'Riley',  role: 'Chief of Staff',        color: '#FFAD00', tint: '#FFF3D1', emoji: '✦' },
  { id: 'pax',    name: 'Pax',    role: 'Research & Analysis',   color: '#14A38A', tint: '#D9F1EC', emoji: '◈' },
  { id: 'nova',   name: 'Nova',   role: 'Creative Strategy',     color: '#8250C8', tint: '#EDE1F8', emoji: '◉' },
  { id: 'quinn',  name: 'Quinn',  role: 'Data & Reporting',      color: '#3E82F7', tint: '#DCE9FD', emoji: '⬡' },
  { id: 'leaf',   name: 'Leaf',   role: 'Ops & Automation',      color: '#4FA84A', tint: '#DFEFDE', emoji: '◆' },
  { id: 'rose',   name: 'Rose',   role: 'Comms & Outreach',      color: '#E5526E', tint: '#FADFE4', emoji: '◇' },
];

const RECENT = [
  { id: 't1', label: 'Q2 market analysis', meta: '2h', agentId: 'pax' },
  { id: 't2', label: 'Email sequence draft', meta: '5h', agentId: 'rose' },
  { id: 't3', label: 'Sprint planning deck', meta: 'Yesterday', agentId: 'riley' },
  { id: 't4', label: 'Competitor teardown', meta: '2d', agentId: 'nova' },
];

type SidebarProps = {
  activeAgent: string;
  onAgent: (id: string) => void;
};

export default function Sidebar({ activeAgent, onAgent }: SidebarProps) {
  const [search, setSearch] = useState('');

  const filteredAgents = AGENTS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <div className="sidebar__title">Workspace</div>
        <div className="sidebar__search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search agents, tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar__body">
        <div className="sidebar__group-label">Agents</div>
        {filteredAgents.map(agent => (
          <div
            key={agent.id}
            className={`sidebar__item${activeAgent === agent.id ? ' sidebar__item--active' : ''}`}
            onClick={() => onAgent(agent.id)}
          >
            <div
              className="sidebar__item-icon"
              style={{ background: agent.tint, color: agent.color }}
            >
              {agent.emoji}
            </div>
            <span className="sidebar__item-label">{agent.name}</span>
            <span className="sidebar__item-meta" style={{ color: agent.color, fontWeight: 600, fontSize: 10 }}>
              {agent.role.split(' ')[0]}
            </span>
          </div>
        ))}

        {!search && (
          <>
            <div className="sidebar__group-label" style={{ marginTop: 8 }}>Recent</div>
            {RECENT.map(item => {
              const agent = AGENTS.find(a => a.id === item.agentId)!;
              return (
                <div key={item.id} className="sidebar__item" onClick={() => onAgent(item.agentId)}>
                  <div
                    className="sidebar__item-dot"
                    style={{ background: agent.color }}
                  />
                  <span className="sidebar__item-label">{item.label}</span>
                  <span className="sidebar__item-meta">{item.meta}</span>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="sidebar__footer">
        <button className="sidebar__new-btn">
          <PlusIcon />
          New Task
        </button>
      </div>
    </aside>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
