import { useAuth } from './AuthContext.jsx';
import { LoginPage } from './LoginPage.jsx';

export function AuthGate({ children }) {
  const { authed, login } = useAuth();
  if (!authed) return <LoginPage onLogin={login} />;
  return children;
}
