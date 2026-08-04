import { createContext, useCallback, useContext, useState } from 'react';
import { AUTH_STORAGE_KEY, PASSWORD_HASH } from './authConfig.js';

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readStoredAuth() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === PASSWORD_HASH;
  } catch {
    return false;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(readStoredAuth);

  const login = useCallback(async (password) => {
    const hash = await sha256Hex(password);
    if (hash !== PASSWORD_HASH) return false;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, hash);
    } catch {
      // localStorage unavailable (private browsing etc.) — stay authed for this tab only.
    }
    setAuthed(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
