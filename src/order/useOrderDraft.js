import { useCallback, useEffect, useRef, useState } from 'react';
import { initialOrder } from './orderData.js';

const DRAFT_KEY = 'chadwell-order-draft-v1';
const AUTOSAVE_DELAY = 800;

/** Read a dot-path out of the order object. */
export function getIn(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

/** Immutably write a dot-path into the order object. */
function setIn(obj, path, value) {
  const [head, ...rest] = path.split('.');
  if (rest.length === 0) return { ...obj, [head]: value };
  return { ...obj, [head]: setIn(obj[head], rest.join('.'), value) };
}

function stamp(now) {
  const pad = (n) => String(n).padStart(2, '0');
  let hours = now.getHours() % 12;
  if (hours === 0) hours = 12;
  return {
    date: `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`,
    time: `${pad(hours)}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? 'PM' : 'AM'}`,
  };
}

/**
 * Order form state plus a debounced local draft. Edits are held in
 * localStorage until the order is explicitly saved or discarded, so a
 * reload mid-call doesn't lose what the agent typed.
 */
export function useOrderDraft() {
  const [order, setOrder] = useState(initialOrder);
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

  const updateNote = useCallback(
    (id, patch) => {
      setOrder((prev) => ({
        ...prev,
        notes: prev.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const addNote = useCallback(() => {
    const { date, time } = stamp(new Date());
    setOrder((prev) => ({
      ...prev,
      notes: [...prev.notes, { id: Date.now(), text: '', date, time, author: 'You', status: 'Received' }],
    }));
    scheduleSave();
  }, [scheduleSave]);

  const removeNote = useCallback(
    (id) => {
      setOrder((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
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
  const saveOrder = useCallback(() => clearDraft(), [clearDraft]);

  /** Throw the draft away and go back to the order as it was loaded. */
  const discardDraft = useCallback(() => {
    clearDraft();
    setOrder(initialOrder);
  }, [clearDraft]);

  let draftLabel = '';
  if (draftStatus === 'saving') {
    draftLabel = 'Saving draft…';
  } else if (draftStatus === 'saved' && lastSavedAt) {
    const pad = (n) => String(n).padStart(2, '0');
    draftLabel = `Draft saved ${pad(lastSavedAt.getHours())}:${pad(lastSavedAt.getMinutes())}`;
  }

  return { order, setField, addNote, updateNote, removeNote, saveOrder, discardDraft, draftLabel };
}
