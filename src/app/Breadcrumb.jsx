import './breadcrumb.css';

/**
 * items: [{ label, onClick? }] — pass onClick to make a crumb a link back to
 * that screen; omit it for the trail's plain-text entries (including current).
 */
export function Breadcrumb({ items }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span className="crumb-item" key={item.label}>
          {i > 0 && <span className="crumb-sep">/</span>}
          {item.onClick ? (
            <button type="button" className="crumb-link" onClick={item.onClick}>
              {item.label}
            </button>
          ) : (
            <span className="crumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
