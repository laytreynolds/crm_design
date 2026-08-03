export function Tooltip({ label, children }) {
  return (
    <span className="cds-tooltip">
      {children}
      <span className="cds-tooltip-bubble">{label}</span>
    </span>
  );
}
