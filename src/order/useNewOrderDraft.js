import { useCallback, useEffect, useRef, useState } from 'react';
import { blankOrder } from './newOrderData.js';

const DRAFT_KEY = 'chadwell-new-order-draft-v1';
const AUTOSAVE_DELAY = 800;

/** Immutably write a dot-path into the order object. */
function setIn(obj, path, value) {
  const [head, ...rest] = path.split('.');
  if (rest.length === 0) return { ...obj, [head]: value };
  return { ...obj, [head]: setIn(obj[head], rest.join('.'), value) };
}

/**
 * Form state plus a debounced local draft for the "New Order" page. Mirrors
 * useOrderDraft but starts blank and has no notes to manage.
 */
export function useNewOrderDraft() {
  const [order, setOrder] = useState(blankOrder);
  const [draftStatus, setDraftStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const saveTimer = useRef(null);
  const latestOrder = useRef(order);
  useEffect(() => {
    latestOrder.current = order;
  });

  // Restore any draft left over from a previous visit.
  useEffect(() => {
    let draft;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      draft = raw ? JSON.parse(raw) : null;
    } catch {
      draft = null;
    }
    if (!draft) return;

    const { __savedAt, ...fields } = draft;
    setOrder((prev) => ({ ...prev, ...fields }));
    setDraftStatus('saved');
    setLastSavedAt(__savedAt ? new Date(__savedAt) : null);
  }, []);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const scheduleSave = useCallback(() => {
    setDraftStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const savedAt = Date.now();
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...latestOrder.current, __savedAt: savedAt }),
        );
      } catch {
        // Private browsing or a full quota — the in-memory form still works.
      }
      setDraftStatus('saved');
      setLastSavedAt(new Date(savedAt));
    }, AUTOSAVE_DELAY);
  }, []);

  const setField = useCallback(
    (path, value) => {
      setOrder((prev) => setIn(prev, path, value));
      scheduleSave();
    },
    [scheduleSave],
  );

  const clearDraft = useCallback(() => {
    clearTimeout(saveTimer.current);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setDraftStatus('idle');
    setLastSavedAt(null);
  }, []);

  /** Commit the order: the draft has served its purpose and is dropped. */
  const createOrder = useCallback(() => clearDraft(), [clearDraft]);

  /** Throw the draft away and start over from a blank form. */
  const discardDraft = useCallback(() => {
    clearDraft();
    setOrder(blankOrder);
  }, [clearDraft]);

  let draftLabel = '';
  if (draftStatus === 'saving') {
    draftLabel = 'Saving draft…';
  } else if (draftStatus === 'saved' && lastSavedAt) {
    const pad = (n) => String(n).padStart(2, '0');
    draftLabel = `Draft saved ${pad(lastSavedAt.getHours())}:${pad(lastSavedAt.getMinutes())}`;
  }

  return { order, setField, createOrder, discardDraft, draftLabel };
}
