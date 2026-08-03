export function Toast({ tone = 'default', children }) {
  return (
    <div className={`cds-toast${tone !== 'default' ? ` cds-toast--${tone}` : ''}`}>{children}</div>
  );
}
