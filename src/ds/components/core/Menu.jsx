import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

/**
 * Action dropdown: a trigger button that opens a popover list of actions.
 *
 * items: [{ label, icon?, onSelect, disabled? }]
 *
 * Keyboard: Enter/Space/Down opens the menu and focuses the first item,
 * Up opens and focuses the last; within the menu Arrow keys, Home/End move
 * focus, Enter/Space selects, Escape closes and returns focus to the trigger.
 * Clicking outside closes it.
 */
export function Menu({
  label,
  icon,
  items = [],
  variant = 'secondary',
  size = 'sm',
  align = 'start',
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Move focus onto a menu item by index, wrapping at both ends.
  const focusItem = useCallback((index) => {
    const count = itemRefs.current.length;
    if (count === 0) return;
    const next = (index + count) % count;
    itemRefs.current[next]?.focus();
  }, []);

  // Close on outside click and on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const openTo = useCallback(
    (edge) => {
      setOpen(true);
      // Wait for the list to render before moving focus into it.
      requestAnimationFrame(() => focusItem(edge === 'last' ? -1 : 0));
    },
    [focusItem],
  );

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTo('first');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openTo('last');
    }
  };

  const onItemKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(index + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(index - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(-1);
        break;
      case 'Tab':
        // Tabbing away dismisses the menu without stealing focus back.
        close(false);
        break;
      default:
        break;
    }
  };

  const select = (item) => {
    if (item.disabled) return;
    close();
    item.onSelect?.();
  };

  return (
    <div className="cds-menu" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`cds-btn cds-btn--${variant} cds-btn--${size} cds-menu-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
      >
        {icon}
        {label}
        <Icon
          name="expand_more"
          size={18}
          className={`cds-menu-caret${open ? ' cds-menu-caret--open' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`cds-menu-list cds-menu-list--${align}`}
          id={menuId}
          role="menu"
          aria-label={label}
        >
          {items.map((item, i) => (
            <button
              type="button"
              key={item.label}
              ref={(el) => (itemRefs.current[i] = el)}
              className="cds-menu-item"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              onClick={() => select(item)}
              onKeyDown={(e) => onItemKeyDown(e, i)}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
