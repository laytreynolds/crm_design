export function Radio({ label, name, checked, onChange, disabled }) {
  return (
    <label className="cds-radio">
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} />
      {label}
    </label>
  );
}
