export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  children,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`cds-btn cds-btn--${variant} cds-btn--${size}`}
    >
      {icon}
      {children}
    </button>
  );
}
