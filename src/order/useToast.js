import { useCallback, useEffect, useRef, useState } from 'react';

/** Single-slot toast: a newer message replaces the one on screen. */
export function useToast(duration = 2200) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = useCallback(
    (msg) => {
      setMessage(msg);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  return { message, show };
}
