import { Icon } from '../ds/index.js';
import { NAV_GROUPS } from './navigation.js';

export function Sidebar({ active, onNavigate }) {
  return (
    <aside className="os-sidebar">
      <div className="os-sb-logo">
        <img src="/logo.png" alt="Chadwell Logo" style={{ width: '100%', height: 'auto' }} />
      </div>

      <nav aria-label="Main">
        {NAV_GROUPS.map((group) => (
          <div className="os-sb-section" key={group.label}>
            <div className="os-sb-group">{group.label}</div>
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <a
                  key={item.id}
                  className={`os-sb-item${isActive ? ' os-sb-item-active' : ''}`}
                  href="#"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(item.id);
                  }}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
