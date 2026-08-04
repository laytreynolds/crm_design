import { useState } from 'react';
import { Icon } from '../ds/index.js';
import { NAV_GROUPS } from './navigation.js';

export function Sidebar({ active, onNavigate }) {
  const [expanded, setExpanded] = useState(() => new Set());
  const [selectedChild, setSelectedChild] = useState(null);

  // Only one group's children are ever shown at a time — inline under its
  // item on desktop, as a bottom sheet on mobile (see the >900px override in
  // sidebar.css). Keeping this exclusive avoids two sheets stacking.
  function toggleExpanded(id) {
    setExpanded((prev) => (prev.has(id) ? new Set() : new Set([id])));
  }

  function handleItemClick(item) {
    if (item.children) toggleExpanded(item.id);
    onNavigate?.(item.id);
  }

  function handleChildClick(childId) {
    setSelectedChild(childId);
    onNavigate?.(childId);
    // On mobile the children list is a sheet covering the screen, so picking
    // one should dismiss it. Desktop keeps it open for browsing more items.
    if (window.matchMedia('(max-width: 900px)').matches) {
      setExpanded(new Set());
    }
  }

  return (
    <aside className="os-sidebar">
      {expanded.size > 0 && (
        <button
          type="button"
          className="os-sb-backdrop"
          aria-label="Close menu"
          onClick={() => setExpanded(new Set())}
        />
      )}

      <div className="os-sb-logo">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chadwell Logo" style={{ width: '100%', height: 'auto' }} />
      </div>

      <nav aria-label="Main">
        {NAV_GROUPS.map((group) => (
          <div className="os-sb-section" key={group.label}>
            <div className="os-sb-group">{group.label}</div>
            {group.items.map((item) => {
              const isActive = item.id === active;
              const isExpanded = expanded.has(item.id);
              return (
                <div className="os-sb-item-wrap" key={item.id}>
                  <a
                    className={`os-sb-item${isActive ? ' os-sb-item-active' : ''}`}
                    href="#"
                    aria-current={isActive ? 'page' : undefined}
                    aria-expanded={item.children ? isExpanded : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item);
                    }}
                  >
                    <Icon name={item.icon} />
                    <span className="os-sb-item-label">{item.label}</span>
                    {item.children && (
                      <Icon
                        name="expand_more"
                        size={18}
                        className={`os-sb-chevron${isExpanded ? ' os-sb-chevron-open' : ''}`}
                      />
                    )}
                  </a>

                  {item.children && isExpanded && (
                    <div className="os-sb-children">
                      <div className="os-sb-children-header">
                        <span>{item.label}</span>
                        <button
                          type="button"
                          className="os-sb-children-close"
                          aria-label="Close menu"
                          onClick={() => setExpanded(new Set())}
                        >
                          <Icon name="close" size={18} />
                        </button>
                      </div>
                      {item.children.map((childGroup, i) => (
                        <div className="os-sb-childgroup" key={childGroup.group ?? i}>
                          {childGroup.group && (
                            <div className="os-sb-subgroup">{childGroup.group}</div>
                          )}
                          {childGroup.items.map((child) => {
                            const isChildActive = child.id === selectedChild;
                            return (
                              <a
                                key={child.id}
                                className={`os-sb-subitem${isChildActive ? ' os-sb-subitem-active' : ''}`}
                                href="#"
                                aria-current={isChildActive ? 'page' : undefined}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleChildClick(child.id);
                                }}
                              >
                                <span className="os-sb-bullet" />
                                {child.label}
                              </a>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
