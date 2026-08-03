export function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label className="cds-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      {label}
    </label>
  );
}
