'use client';

import { AGENTS } from './Sidebar';

type TweakState = {
  activeAgent: string;
  showThread: boolean;
  showSidebar: boolean;
  compactMode: boolean;
  streamMode: boolean;
  approvalGate: boolean;
};

type TweaksPanelProps = {
  tweaks: TweakState;
  onChange: (next: Partial<TweakState>) => void;
  onClose: () => void;
};

export default function TweaksPanel({ tweaks, onChange, onClose }: TweaksPanelProps) {
  return (
    <div className="tweaks-overlay" onClick={onClose}>
      <div className="tweaks-panel" onClick={e => e.stopPropagation()}>
        <div className="tweaks-panel__head">
          <TweaksIcon />
          <h2 className="tweaks-panel__title">Tweaks</h2>
          <button
            style={{
              width: 28, height: 28, borderRadius: 'var(--r-xs)', border: 'none',
              background: 'transparent', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--ink-4)', cursor: 'pointer',
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="tweaks-panel__body">
          {/* Active agent */}
          <div>
            <div className="tweaks-section__title">Active Agent</div>
            {AGENTS.map(agent => (
              <div
                key={agent.id}
                className={`agent-option${tweaks.activeAgent === agent.id ? ' agent-option--active' : ''}`}
                onClick={() => onChange({ activeAgent: agent.id })}
              >
                <div
                  className="agent-option__dot"
                  style={{ background: agent.color }}
                />
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 'var(--r-xs)',
                    background: agent.tint, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0,
                    color: agent.color,
                  }}
                >
                  {agent.emoji}
                </div>
                <div className="agent-option__name">{agent.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', marginRight: 4 }}>
                  {agent.role.split(' ')[0]}
                </div>
                {tweaks.activeAgent === agent.id && (
                  <span className="agent-option__check">✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Layout */}
          <div>
            <div className="tweaks-section__title">Layout</div>
            <div className="tweaks-row">
              <span className="tweaks-row__label">Show sidebar</span>
              <button
                className={`toggle${tweaks.showSidebar ? ' toggle--on' : ''}`}
                onClick={() => onChange({ showSidebar: !tweaks.showSidebar })}
              />
            </div>
            <div className="tweaks-row">
              <span className="tweaks-row__label">Show thread pane</span>
              <button
                className={`toggle${tweaks.showThread ? ' toggle--on' : ''}`}
                onClick={() => onChange({ showThread: !tweaks.showThread })}
              />
            </div>
            <div className="tweaks-row">
              <span className="tweaks-row__label">Compact mode</span>
              <button
                className={`toggle${tweaks.compactMode ? ' toggle--on' : ''}`}
                onClick={() => onChange({ compactMode: !tweaks.compactMode })}
              />
            </div>
          </div>

          {/* Behaviour */}
          <div>
            <div className="tweaks-section__title">Behaviour</div>
            <div className="tweaks-row">
              <span className="tweaks-row__label">Stream responses</span>
              <button
                className={`toggle${tweaks.streamMode ? ' toggle--on' : ''}`}
                onClick={() => onChange({ streamMode: !tweaks.streamMode })}
              />
            </div>
            <div className="tweaks-row">
              <span className="tweaks-row__label">Approval gate</span>
              <button
                className={`toggle${tweaks.approvalGate ? ' toggle--on' : ''}`}
                onClick={() => onChange({ approvalGate: !tweaks.approvalGate })}
              />
            </div>
          </div>

          {/* Accent colour */}
          <div>
            <div className="tweaks-section__title">Accent colour</div>
            <div className="swatch-row">
              {[
                { color: '#FFAD00', label: 'Amber' },
                { color: '#14A38A', label: 'Teal' },
                { color: '#8250C8', label: 'Purple' },
                { color: '#3E82F7', label: 'Blue' },
                { color: '#4FA84A', label: 'Green' },
                { color: '#E5526E', label: 'Rose' },
                { color: '#1B1D22', label: 'Ink' },
              ].map(s => (
                <button
                  key={s.color}
                  className={`swatch${s.label === 'Amber' ? ' swatch--active' : ''}`}
                  style={{ background: s.color }}
                  title={s.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TweaksIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="8" y1="12" x2="20" y2="12"/>
      <line x1="12" y1="18" x2="20" y2="18"/>
      <circle cx="2" cy="6" r="2" fill="var(--amber-500)" stroke="none"/>
      <circle cx="6" cy="12" r="2" fill="var(--amber-500)" stroke="none"/>
      <circle cx="10" cy="18" r="2" fill="var(--amber-500)" stroke="none"/>
    </svg>
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

export type { TweakState };
