import { Icon } from '../ds/index.js';
import './topbar.css';

const CURRENT_USER = {
  initials: 'LR',
  name: 'Layton Reynolds',
  email: 'layton@chadwelltelecom.co.uk',
};

export function Topbar() {
  return (
    <header className="app-topbar">
      <button type="button" className="app-topbar-collapse" aria-label="Collapse sidebar">
        <Icon name="left_panel_close" size={20} />
      </button>

      <div className="app-topbar-right">
        <button type="button" className="app-topbar-icon-btn" aria-label="Notifications">
          <Icon name="notifications" size={20} />
          <span className="app-topbar-badge">5</span>
        </button>
        <div className="app-topbar-user">
          <span className="app-topbar-avatar" aria-hidden="true">
            {CURRENT_USER.initials}
          </span>
          <div className="app-topbar-user-text">
            <span className="app-topbar-name">{CURRENT_USER.name}</span>
            <span className="app-topbar-email">{CURRENT_USER.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
