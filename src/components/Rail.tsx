'use client';

type RailProps = {
  activeNav: string;
  onNav: (id: string) => void;
  onTweaks: () => void;
};

export default function Rail({ activeNav, onNav, onTweaks }: RailProps) {
  return (
    <aside className="rail">
      <div className="rail__logo">✦</div>

      <button className={`rail__btn${activeNav === 'home' ? ' rail__btn--active' : ''}`} title="Home" onClick={() => onNav('home')}>
        <HomeIcon />
      </button>
      <button className={`rail__btn${activeNav === 'pages' ? ' rail__btn--active' : ''}`} title="Pages" onClick={() => onNav('pages')}>
        <PagesIcon />
      </button>
      <button className={`rail__btn${activeNav === 'agents' ? ' rail__btn--active' : ''}`} title="Agents" onClick={() => onNav('agents')}>
        <AgentsIcon />
      </button>
      <button className={`rail__btn${activeNav === 'starred' ? ' rail__btn--active' : ''}`} title="Starred" onClick={() => onNav('starred')}>
        <StarIcon />
      </button>
      <button className={`rail__btn${activeNav === 'share' ? ' rail__btn--active' : ''}`} title="Share" onClick={() => onNav('share')}>
        <ShareIcon />
      </button>
      <button className="rail__btn rail__btn--active" title="Notifications" onClick={() => onNav('notif')}>
        <BellIcon />
        <span className="rail__badge">3</span>
      </button>

      <div className="rail__spacer" />

      <button className="rail__btn" title="More" style={{ marginBottom: 4 }}>
        <MoreIcon />
      </button>
      <button className="rail__btn" title="Help">
        <HelpIcon />
      </button>
      <div className="rail__avatar" title="Your profile">SS</div>
    </aside>
  );
}

function HomeIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function PagesIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
}
function AgentsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
}
function StarIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ShareIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function BellIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function MoreIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
}
function HelpIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
