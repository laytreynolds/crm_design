export function Switch({ label, checked, onChange, disabled }) {
  return (
    <label className="cds-switch">
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      <span className="cds-switch-track" />
      {label}
    </label>
  );
}
