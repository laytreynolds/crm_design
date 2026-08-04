import { useState } from 'react';
import { Icon } from '../ds/index.js';
import { NAV_GROUPS } from './navigation.js';

export function Sidebar({ active, onNavigate }) {
  const [expanded, setExpanded] = useState(() => new Set());
  const [selectedChild, setSelectedChild] = useState(null);

  function toggleExpanded(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleItemClick(item) {
    if (item.children) toggleExpanded(item.id);
    onNavigate?.(item.id);
  }

  function handleChildClick(childId) {
    setSelectedChild(childId);
    onNavigate?.(childId);
  }

  return (
    <aside className="os-sidebar">
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
                <div key={item.id}>
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
