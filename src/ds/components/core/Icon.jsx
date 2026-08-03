/**
 * Material Symbols glyph. The design uses inline `<span class="material-symbols-outlined">`
 * throughout; this wraps that in one place so sizing stays consistent.
 */
export function Icon({ name, size = 18, className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined${className ? ` ${className}` : ''}`}
      style={{ fontSize: size, lineHeight: 1, ...style }}
    >
      {name}
    </span>
  );
}
