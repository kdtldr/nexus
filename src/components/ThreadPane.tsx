'use client';

import { useState, useRef, useEffect } from 'react';
import { AGENTS } from './Sidebar';

type Message = {
  id: string;
  role: 'user' | 'agent';
  text: string;
  ts: string;
  type?: 'text' | 'task' | 'widgets' | 'approval';
};

type ThreadPaneProps = {
  activeAgent: string;
  messages: Message[];
  onClose: () => void;
  onSend: (text: string) => void;
};

export default function ThreadPane({ activeAgent, messages, onClose, onSend }: ThreadPaneProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const agent = AGENTS.find(a => a.id === activeAgent) ?? AGENTS[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  }

  return (
    <aside className="thread-pane">
      <div className="thread-pane__head">
        <span
          className="thread-pane__agent-pill"
          style={{ background: agent.tint, borderColor: agent.color + '50', color: agent.color }}
        >
          <span>{agent.emoji}</span>
          {agent.name}
        </span>
        <span className="thread-pane__title">Thread</span>
        <button className="thread-pane__close" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="thread-pane__messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-4)', fontSize: 'var(--t-body-sm)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{agent.emoji}</div>
            <div>Send a message to start working with {agent.name}</div>
          </div>
        )}
        {messages.map(msg => {
          if (msg.type === 'task') return <TaskCard key={msg.id} agent={agent} />;
          if (msg.type === 'widgets') return <WidgetRow key={msg.id} />;
          if (msg.type === 'approval') return <ApprovalCard key={msg.id} />;

          return (
            <div key={msg.id} className={`msg${msg.role === 'user' ? ' msg--user' : ''}`}>
              <div
                className="msg__avatar"
                style={msg.role === 'agent'
                  ? { background: agent.tint, color: agent.color }
                  : { background: 'var(--ink)', color: 'var(--amber-300)' }
                }
              >
                {msg.role === 'agent' ? agent.emoji : 'JK'}
              </div>
              <div className="msg__body">
                <div className="msg__bubble">{msg.text}</div>
                <div className="msg__meta">{msg.ts}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="thread-composer">
        <div className="thread-composer__input">
          <input
            type="text"
            placeholder={`Reply to ${agent.name}…`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button className="thread-composer__send" onClick={handleSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

function TaskCard({ agent }: { agent: (typeof AGENTS)[0] }) {
  const steps = [
    { label: 'Gathering sources', done: true },
    { label: 'Analysing data', done: true },
    { label: 'Drafting summary', active: true },
    { label: 'Quality check', done: false },
  ];
  const progress = (steps.filter(s => s.done).length / steps.length) * 100;

  return (
    <div className="task-card">
      <div className="task-card__head">
        <div className="task-card__icon" style={{ background: agent.tint, color: agent.color }}>{agent.emoji}</div>
        <span className="task-card__title">Market analysis</span>
        <span
          className="task-card__status-badge"
          style={{ background: 'var(--warning-tint)', color: 'var(--warning)' }}
        >
          <RunningDot />
          Running
        </span>
      </div>
      <div className="task-card__body">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`task-card__step${step.done ? ' task-card__step--done' : step.active ? ' task-card__step--active' : ''}`}
          >
            <div className="task-card__step-icon">
              {step.done ? '✓' : step.active ? '●' : ''}
            </div>
            <span className="task-card__step-text">{step.label}</span>
          </div>
        ))}
        <div className="task-card__progress">
          <div className="task-card__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function WidgetRow() {
  return (
    <div className="widget-row">
      {[
        { label: 'Leads found', value: '142', delta: '+18', up: true },
        { label: 'Avg. score', value: '8.4', delta: '+0.6', up: true },
        { label: 'Dismissed', value: '23', delta: '-5', up: false },
      ].map(w => (
        <div key={w.label} className="widget">
          <div className="widget__label">{w.label}</div>
          <div className="widget__value">{w.value}</div>
          <div className={`widget__delta widget__delta--${w.up ? 'up' : 'down'}`}>
            {w.up ? '↑' : '↓'} {w.delta} vs last week
          </div>
        </div>
      ))}
    </div>
  );
}

function ApprovalCard() {
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState('');

  if (answered) {
    return (
      <div style={{
        padding: '12px 16px',
        background: answer === 'approve' ? 'var(--success-tint)' : 'var(--surface-2)',
        border: '1px solid',
        borderColor: answer === 'approve' ? 'var(--success)' : 'var(--line)',
        borderRadius: 'var(--r-md)',
        fontSize: 'var(--t-body-sm)',
        color: answer === 'approve' ? 'var(--success)' : 'var(--ink-3)',
        fontWeight: 500,
      }}>
        {answer === 'approve' ? '✓ Approved — continuing…' : '✗ Denied — task paused'}
      </div>
    );
  }

  return (
    <div className="approval-card">
      <div className="approval-card__eyebrow">
        <ApprovalIcon />
        Approval needed
      </div>
      <p className="approval-card__question">
        Ready to send the outreach sequence to 47 contacts. Proceed?
      </p>
      <div className="approval-card__actions">
        <button
          className="approval-card__btn approval-card__btn--approve"
          onClick={() => { setAnswer('approve'); setAnswered(true); }}
        >
          Approve
        </button>
        <button
          className="approval-card__btn approval-card__btn--deny"
          onClick={() => { setAnswer('deny'); setAnswered(true); }}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

function RunningDot() {
  return (
    <span style={{
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--warning)',
      animation: 'pulse 2s infinite',
    }} />
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function ApprovalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export type { Message };
