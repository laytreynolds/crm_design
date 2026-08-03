import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import './sidebar.css';

export function AppShell({ active, onNavigate, children }) {
  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="app-main-col">
        <Topbar />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
