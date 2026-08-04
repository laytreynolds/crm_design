import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ds/index.js';
import { useAuth } from '../auth/AuthContext.jsx';
import './topbar.css';

const CURRENT_USER = {
  initials: 'LR',
  name: 'Layton Reynolds',
  email: 'layton@chadwelltelecom.co.uk',
};

export function Topbar() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="app-topbar">
      <button type="button" className="app-topbar-collapse" aria-label="Collapse sidebar">
        <Icon name="left_panel_close" size={20} />
      </button>

      <div className="app-topbar-brand">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chadwell" />
      </div>

      <div className="app-topbar-right">
        <div className="app-topbar-user-menu" ref={menuRef}>
          <button
            type="button"
            className="app-topbar-user"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="app-topbar-avatar" aria-hidden="true">
              {CURRENT_USER.initials}
            </span>
            <div className="app-topbar-user-text">
              <span className="app-topbar-name">{CURRENT_USER.name}</span>
              <span className="app-topbar-email">{CURRENT_USER.email}</span>
            </div>
            <Icon
              name="expand_more"
              size={18}
              className={`app-topbar-user-chevron${menuOpen ? ' app-topbar-user-chevron-open' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="app-topbar-user-dropdown" role="menu">
              <button
                type="button"
                className="app-topbar-user-dropdown-item"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="person" size={18} />
                Profile
              </button>
              <button
                type="button"
                className="app-topbar-user-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <Icon name="logout" size={18} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
