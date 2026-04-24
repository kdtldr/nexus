'use client';

type RailProps = {
  activeNav: string;
  onNav: (id: string) => void;
  onTweaks: () => void;
};

const NAV_ITEMS = [
  { id: 'home',    icon: <HomeIcon />,    label: 'Home' },
  { id: 'agents',  icon: <AgentsIcon />,  label: 'Agents' },
  { id: 'tasks',   icon: <TasksIcon />,   label: 'Tasks', badge: true },
  { id: 'files',   icon: <FilesIcon />,   label: 'Files' },
  { id: 'integrations', icon: <IntegrationsIcon />, label: 'Integrations' },
];

export default function Rail({ activeNav, onNav, onTweaks }: RailProps) {
  return (
    <aside className="rail">
      <div className="rail__logo">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="currentColor"/>
          <path d="M9 6L12 8V12L9 14L6 12V8L9 6Z" fill="black" fillOpacity="0.25"/>
        </svg>
      </div>

      <nav className="rail__nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`rail__btn${activeNav === item.id ? ' rail__btn--active' : ''}`}
            title={item.label}
            onClick={() => onNav(item.id)}
          >
            {item.icon}
            {item.badge && <span className="badge" />}
          </button>
        ))}
      </nav>

      <div className="rail__spacer" />

      <button className="rail__btn" title="Settings" onClick={onTweaks}>
        <SettingsIcon />
      </button>
      <div className="rail__avatar" title="Your profile">JK</div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function AgentsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      <circle cx="18" cy="7" r="3"/>
      <path d="M21 19c0-2.5-1.8-4.5-4-5"/>
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  );
}

function IntegrationsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="1"/>
      <rect x="13" y="2" width="9" height="9" rx="1"/>
      <rect x="2" y="13" width="9" height="9" rx="1"/>
      <rect x="13" y="13" width="9" height="9" rx="1"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
