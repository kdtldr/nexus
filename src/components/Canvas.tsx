'use client';

import { useState } from 'react';
import { AGENTS } from './Sidebar';

type CanvasProps = {
  activeAgent: string;
  onSend: (text: string) => void;
};

const AGENT_SUGGESTS: Record<string, { label: string; group: string; icon: string }[]> = {
  riley: [
    { group: 'Plan', label: 'Draft Q3 priorities', icon: '📋' },
    { group: 'Plan', label: 'Weekly standup agenda', icon: '📅' },
    { group: 'Review', label: 'Summarise my week', icon: '📊' },
    { group: 'Review', label: 'Outstanding approvals', icon: '✅' },
    { group: 'Automate', label: 'Set up daily briefing', icon: '⚡' },
  ],
  pax: [
    { group: 'Research', label: 'Analyse competitor pricing', icon: '🔍' },
    { group: 'Research', label: 'Market size for Series B', icon: '📈' },
    { group: 'Synthesise', label: 'Summarise industry reports', icon: '📑' },
    { group: 'Synthesise', label: 'Key trends this quarter', icon: '📉' },
  ],
  nova: [
    { group: 'Create', label: 'Brand positioning doc', icon: '✨' },
    { group: 'Create', label: 'Campaign concept ideas', icon: '💡' },
    { group: 'Refine', label: 'Review messaging draft', icon: '✏️' },
    { group: 'Refine', label: 'Improve landing copy', icon: '🎯' },
  ],
  quinn: [
    { group: 'Analyse', label: 'Revenue dashboard', icon: '📊' },
    { group: 'Analyse', label: 'Churn cohort analysis', icon: '📉' },
    { group: 'Report', label: 'Executive summary PDF', icon: '📄' },
    { group: 'Report', label: 'Board deck metrics', icon: '📋' },
  ],
  leaf: [
    { group: 'Automate', label: 'Sync CRM to Notion', icon: '🔄' },
    { group: 'Automate', label: 'Alert on Slack anomalies', icon: '🔔' },
    { group: 'Build', label: 'New onboarding flow', icon: '🏗️' },
    { group: 'Build', label: 'Invoice automation', icon: '⚙️' },
  ],
  rose: [
    { group: 'Write', label: 'Cold outreach sequence', icon: '📧' },
    { group: 'Write', label: 'Newsletter draft', icon: '📰' },
    { group: 'Respond', label: 'Reply to support queue', icon: '💬' },
    { group: 'Respond', label: 'Investor update email', icon: '💼' },
  ],
};

const RUNWAY_CARDS = [
  { icon: '📎', label: 'Attach file' },
  { icon: '🔗', label: 'Connect tool' },
  { icon: '📅', label: 'Schedule' },
  { icon: '🧠', label: 'Memory' },
];

const GREETINGS: Record<string, { eyebrow: string; headline: string; sub: string }> = {
  riley: {
    eyebrow: 'Good morning, Jordan',
    headline: "What shall we\ntackle today?",
    sub: "Riley is your chief of staff — briefing, planning, and prioritisation across your entire workspace.",
  },
  pax: {
    eyebrow: 'Research mode',
    headline: "What do you\nneed to know?",
    sub: "Pax digs deep into data, reports, and markets — then distils it into what actually matters.",
  },
  nova: {
    eyebrow: 'Creative canvas',
    headline: "What shall we\ncreate today?",
    sub: "Nova blends strategy with creative instinct to build narratives, campaigns, and brand direction.",
  },
  quinn: {
    eyebrow: 'Data workspace',
    headline: "What story does\nyour data tell?",
    sub: "Quinn turns raw numbers into clear insights, dashboards, and reports your team will actually read.",
  },
  leaf: {
    eyebrow: 'Automation hub',
    headline: "What should we\nautomate next?",
    sub: "Leaf connects your tools, builds workflows, and handles the repetitive work so you don't have to.",
  },
  rose: {
    eyebrow: 'Communications',
    headline: "Who shall we\nreach out to?",
    sub: "Rose crafts the right message for every audience — from cold outreach to investor updates.",
  },
};

export default function Canvas({ activeAgent, onSend }: CanvasProps) {
  const [prompt, setPrompt] = useState('');
  const agent = AGENTS.find(a => a.id === activeAgent) ?? AGENTS[0];
  const suggests = AGENT_SUGGESTS[activeAgent] ?? [];
  const greeting = GREETINGS[activeAgent] ?? GREETINGS.riley;

  const groups = suggests.reduce<Record<string, typeof suggests>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  function handleSend() {
    if (!prompt.trim()) return;
    onSend(prompt);
    setPrompt('');
  }

  function handleChip(label: string) {
    onSend(label);
  }

  return (
    <div className="canvas">
      <div className="canvas__inner">
        {/* Greeting */}
        <div className="greeting">
          <div className="greeting__eyebrow">{greeting.eyebrow}</div>
          <h1 className="greeting__headline" style={{ whiteSpace: 'pre-line' }}>
            {greeting.headline}
          </h1>
          <p className="greeting__sub">{greeting.sub}</p>
        </div>

        {/* Persona card */}
        <div className="persona">
          <div className="persona__avatar" style={{ background: agent.tint }}>
            <span style={{ fontSize: 24, color: agent.color }}>{agent.emoji}</span>
          </div>
          <div className="persona__body">
            <div className="persona__name" style={{ color: agent.color }}>{agent.name}</div>
            <div className="persona__role">{agent.role}</div>
            <div className="persona__description">
              {getAgentDescription(activeAgent)}
            </div>
            <div className="persona__tags">
              {getAgentTags(activeAgent).map(tag => (
                <span
                  key={tag}
                  className="persona__tag"
                  style={{ background: agent.tint, borderColor: agent.color + '40', color: agent.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="persona__actions">
            <button className="persona__btn persona__btn--primary">Start task</button>
            <button className="persona__btn">View history</button>
          </div>
        </div>

        {/* Prompt */}
        <div className="prompt-box">
          <textarea
            className="prompt-box__textarea"
            placeholder={`Ask ${agent.name} anything…`}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
            }}
            rows={3}
          />
          <div className="prompt-box__footer">
            <div className="prompt-box__attach">
              <button className="prompt-box__tool-btn"><AttachIcon /> Attach</button>
              <button className="prompt-box__tool-btn"><ToolIcon /> Tools</button>
              <button className="prompt-box__model-sel">
                <ModelIcon />
                Nexus Pro
                <ChevronIcon />
              </button>
            </div>
            <button
              className="prompt-box__send"
              disabled={!prompt.trim()}
              onClick={handleSend}
            >
              <SendIcon />
              Send
              <span style={{ opacity: 0.6, fontSize: 11 }}>⌘↵</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="suggest">
          {Object.entries(groups).map(([group, chips]) => (
            <div key={group}>
              <div className="suggest__group-label">{group}</div>
              <div className="suggest__chips">
                {chips.map(chip => (
                  <button
                    key={chip.label}
                    className="suggest__chip"
                    onClick={() => handleChip(chip.label)}
                  >
                    <span className="suggest__chip-icon">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Runway */}
        <div className="runway">
          <span className="runway__label">Quick run</span>
          <div className="runway__divider" />
          <div className="runway__cards">
            {RUNWAY_CARDS.map(card => (
              <button key={card.label} className="runway__card">
                <div className="runway__card-icon" style={{ background: 'var(--surface-2)' }}>
                  {card.icon}
                </div>
                {card.label}
              </button>
            ))}
          </div>
          <div className="runway__spacer" />
          <button className="runway__run">
            <RunIcon />
            Run
          </button>
        </div>
      </div>
    </div>
  );
}

function getAgentDescription(id: string): string {
  const descs: Record<string, string> = {
    riley:  "Riley orchestrates your priorities, meetings, and cross-team work — acting as a force multiplier on everything you already do.",
    pax:    "Pax synthesises vast amounts of information quickly, turning dense documents and data into crisp, actionable insights.",
    nova:   "Nova combines strategic thinking with creative craft to produce work that resonates — from brand voice to campaign concepts.",
    quinn:  "Quinn models data, surfaces patterns, and builds the reports your stakeholders actually want to read.",
    leaf:   "Leaf integrates your tech stack and automates repetitive workflows so your team focuses on high-leverage work.",
    rose:   "Rose writes with precision and empathy — crafting outreach, updates, and communications that get results.",
  };
  return descs[id] ?? '';
}

function getAgentTags(id: string): string[] {
  const tags: Record<string, string[]> = {
    riley:  ['Planning', 'Prioritisation', 'Briefings'],
    pax:    ['Research', 'Synthesis', 'Analysis'],
    nova:   ['Strategy', 'Copywriting', 'Ideation'],
    quinn:  ['Analytics', 'Dashboards', 'SQL'],
    leaf:   ['Automation', 'Integrations', 'APIs'],
    rose:   ['Email', 'Outreach', 'Comms'],
  };
  return tags[id] ?? [];
}

function AttachIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function RunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
