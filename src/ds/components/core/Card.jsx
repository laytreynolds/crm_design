export function Card({ elevated, children, style }) {
  return (
    <div className={`cds-card${elevated ? ' cds-card--elevated' : ''}`} style={style}>
      {children}
    </div>
  );
}
