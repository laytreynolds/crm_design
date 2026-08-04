import { useState } from 'react';
import { AppShell } from './AppShell.jsx';
import { OrderPage } from '../order/OrderPage.jsx';
import { OrdersListPage } from '../orders/OrdersListPage.jsx';
import { ClientPage } from '../client/ClientPage.jsx';
import { ClientsListPage } from '../clients/ClientsListPage.jsx';
import { LeaderboardPage } from '../leaderboard/LeaderboardPage.jsx';
import { SettingsListPage } from '../settings/SettingsListPage.jsx';
import { SETTINGS_CONFIG } from '../settings/settingsData.js';
import { UsersListPage } from '../users/UsersListPage.jsx';
import { PermissionsListPage } from '../permissions/PermissionsListPage.jsx';

// Nav id -> screen. Only these destinations have a built screen; the rest
// of NAV_GROUPS stays inert until a real page exists for them. Settings'
// sub-items are handled separately below since each one maps to the same
// screen with a different settingId.
const NAV_SCREEN = {
  orders: 'orders-list',
  clients: 'clients-list',
  leaderboard: 'leaderboard',
  users: 'users-list',
  permissions: 'permissions-list',
};

// order-detail/client-detail/settings-detail aren't nav destinations
// themselves — they're reached via a row action or sub-item — so they map
// back to that section's nav item for highlighting.
const SCREEN_NAV = {
  'orders-list': 'orders',
  'order-detail': 'orders',
  'clients-list': 'clients',
  'client-detail': 'clients',
  leaderboard: 'leaderboard',
  'settings-detail': 'settings',
  'users-list': 'users',
  'permissions-list': 'permissions',
};

export function App() {
  const [screen, setScreen] = useState('orders-list');
  const [focusSection, setFocusSection] = useState(null);
  const [clientMode, setClientMode] = useState('view');
  const [settingId, setSettingId] = useState(null);

  function handleNavigate(navId) {
    if (navId in SETTINGS_CONFIG) {
      setSettingId(navId);
      setScreen('settings-detail');
      return;
    }
    const target = NAV_SCREEN[navId];
    if (target) setScreen(target);
  }

  // The demo only has one full order record, so every row's "View"/"Edit"/
  // "Add Note" opens the same detail page rather than per-row data.
  function openOrder(_orderId, section) {
    setFocusSection(section ?? null);
    setScreen('order-detail');
  }

  // Same idea as openOrder: one demo client record, opened in either mode
  // depending on which row action was clicked.
  function openClient(_clientId, mode = 'view') {
    setClientMode(mode);
    setScreen('client-detail');
  }

  return (
    <AppShell active={SCREEN_NAV[screen]} onNavigate={handleNavigate}>
      {screen === 'orders-list' && <OrdersListPage onOpenOrder={openOrder} />}
      {screen === 'order-detail' && (
        <OrderPage
          onBack={() => setScreen('orders-list')}
          focusSection={focusSection}
          onOpenClient={() => openClient(undefined, 'view')}
        />
      )}
      {screen === 'clients-list' && <ClientsListPage onOpenClient={openClient} />}
      {screen === 'client-detail' && (
        <ClientPage
          onBack={() => setScreen('clients-list')}
          mode={clientMode}
          onOpenOrder={openOrder}
        />
      )}
      {screen === 'leaderboard' && <LeaderboardPage />}
      {screen === 'settings-detail' && <SettingsListPage key={settingId} settingId={settingId} />}
      {screen === 'users-list' && <UsersListPage />}
      {screen === 'permissions-list' && <PermissionsListPage />}
    </AppShell>
  );
}
