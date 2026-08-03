export function Badge({ tone = 'success', children }) {
  return <span className={`cds-badge cds-badge--${tone}`}>{children}</span>;
}
