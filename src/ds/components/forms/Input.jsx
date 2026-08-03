export function Input({
  label,
  hint,
  error,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="cds-field">
      {label && <label>{label}</label>}
      <input
        className={`cds-input${error ? ' cds-input--error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {(hint || error) && (
        <span className="cds-hint" style={error ? { color: 'var(--state-danger)' } : undefined}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
