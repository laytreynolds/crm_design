import { useCallback, useEffect, useRef, useState } from 'react';
import { getOrderDetail } from './orderData.js';

const DRAFT_KEY_PREFIX = 'chadwell-order-draft-v1';
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

/** Deep-merges a saved draft over the current order so fields added to the
 * schema after the draft was saved (e.g. a new column) aren't wiped out by
 * a stale nested object like `account` or `bankDetails`. */
function deepMerge(base, patch) {
  if (typeof patch !== 'object' || patch === null || Array.isArray(patch)) return patch;
  const result = { ...base };
  for (const key of Object.keys(patch)) {
    const baseValue = base?.[key];
    const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
    result[key] = isPlainObject(baseValue) && isPlainObject(patch[key])
      ? deepMerge(baseValue, patch[key])
      : patch[key];
  }
  return result;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
export function useOrderDraft(orderId) {
  const draftKey = `${DRAFT_KEY_PREFIX}:${orderId ?? 'default'}`;
  const [order, setOrder] = useState(() => getOrderDetail(orderId));
  const [draftStatus, setDraftStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const saveTimer = useRef(null);
  const latestOrder = useRef(order);
  useEffect(() => {
    latestOrder.current = order;
  });

  // Restore any draft left over from a previous visit to this order. The
  // caller remounts this hook (via a `key`) when switching orders, so this
  // only needs to run once per order on mount.
  useEffect(() => {
    let draft;
    try {
      const raw = localStorage.getItem(draftKey);
      draft = raw ? JSON.parse(raw) : null;
    } catch {
      draft = null;
    }
    if (!draft) return;

    const { __savedAt, ...fields } = draft;
    setOrder((prev) => deepMerge(prev, fields));
    setDraftStatus('saved');
    setLastSavedAt(__savedAt ? new Date(__savedAt) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const scheduleSave = useCallback(() => {
    setDraftStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const savedAt = Date.now();
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({ ...latestOrder.current, __savedAt: savedAt }),
        );
      } catch {
        // Private browsing or a full quota — the in-memory form still works.
      }
      setDraftStatus('saved');
      setLastSavedAt(new Date(savedAt));
    }, AUTOSAVE_DELAY);
  }, [draftKey]);

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

  // The uploaded File itself isn't kept in state, only a blob URL for
  // preview/download — File instances don't survive the JSON draft roundtrip.
  const addDocument = useCallback(
    (file) => {
      if (!file) return;
      const { date, time } = stamp(new Date());
      const doc = {
        id: Date.now(),
        name: file.name,
        category: 'Other',
        size: formatFileSize(file.size),
        date,
        time,
        uploadedBy: 'You',
        url: URL.createObjectURL(file),
      };
      setOrder((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const updateDocument = useCallback(
    (id, patch) => {
      setOrder((prev) => ({
        ...prev,
        documents: prev.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const removeDocument = useCallback(
    (id) => {
      setOrder((prev) => {
        const doc = prev.documents.find((d) => d.id === id);
        if (doc?.url) URL.revokeObjectURL(doc.url);
        return { ...prev, documents: prev.documents.filter((d) => d.id !== id) };
      });
      scheduleSave();
    },
    [scheduleSave],
  );

  const clearDraft = useCallback(() => {
    clearTimeout(saveTimer.current);
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setDraftStatus('idle');
    setLastSavedAt(null);
  }, [draftKey]);

  /** Commit the order: the draft has served its purpose and is dropped. */
  const saveOrder = useCallback(() => clearDraft(), [clearDraft]);

  /** Throw the draft away and go back to the order as it was loaded. */
  const discardDraft = useCallback(() => {
    clearDraft();
    setOrder(getOrderDetail(orderId));
  }, [clearDraft, orderId]);

  let draftLabel = '';
  if (draftStatus === 'saving') {
    draftLabel = 'Saving draft…';
  } else if (draftStatus === 'saved' && lastSavedAt) {
    const pad = (n) => String(n).padStart(2, '0');
    draftLabel = `Draft saved ${pad(lastSavedAt.getHours())}:${pad(lastSavedAt.getMinutes())}`;
  }

  return {
    order,
    setField,
    addNote,
    updateNote,
    removeNote,
    addDocument,
    updateDocument,
    removeDocument,
    saveOrder,
    discardDraft,
    draftLabel,
  };
}
