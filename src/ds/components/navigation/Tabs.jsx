export function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="cds-tabs">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`cds-tab${t.value === active ? ' cds-tab--active' : ''}`}
          onClick={() => onChange && onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
