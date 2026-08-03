export function Tag({ children, onRemove }) {
  return (
    <span className="cds-tag">
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove">
          ×
        </button>
      )}
    </span>
  );
}
