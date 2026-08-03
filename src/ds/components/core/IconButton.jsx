export function IconButton({ icon, size = 'md', disabled, onClick, 'aria-label': ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`cds-icon-btn${size === 'sm' ? ' cds-icon-btn--sm' : ''}`}
    >
      {icon}
    </button>
  );
}
