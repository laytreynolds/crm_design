import { useState } from 'react';
import { Button, Input } from '../ds/index.js';
import './login.css';

export function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password || checking) return;
    setChecking(true);
    setError('');
    const ok = await onLogin(password);
    setChecking(false);
    if (!ok) {
      setError('Incorrect password.');
      setPassword('');
    }
  }

  return (
    <div className="login-page">
      <form className="login-card cds-card cds-card--elevated" onSubmit={handleSubmit}>
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Chadwell Logo"
          className="login-logo"
        />
        <h1 className="login-title">Enter password to continue</h1>
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          disabled={checking}
        />
        <Button type="submit" size="lg" disabled={checking || !password}>
          {checking ? 'Checking…' : 'Enter'}
        </Button>
      </form>
    </div>
  );
}
