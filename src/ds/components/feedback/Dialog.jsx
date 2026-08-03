export function Dialog({ title, children, onClose, actions }) {
  return (
    <div className="cds-dialog-overlay" onClick={onClose}>
      <div
        className="cds-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3>{title}</h3>}
        {children}
        {actions && <div className="cds-dialog-actions">{actions}</div>}
      </div>
    </div>
  );
}
