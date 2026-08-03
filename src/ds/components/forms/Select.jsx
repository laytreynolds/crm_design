export function Select({ label, hint, options = [], value, onChange, disabled }) {
  return (
    <div className="cds-field">
      {label && <label>{label}</label>}
      <select className="cds-select" value={value} onChange={onChange} disabled={disabled}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="cds-hint">{hint}</span>}
    </div>
  );
}
