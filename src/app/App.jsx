import { useState } from 'react';
import { AppShell } from './AppShell.jsx';
import { OrderPage } from '../order/OrderPage.jsx';
import { OrdersListPage } from '../orders/OrdersListPage.jsx';
import { ClientsListPage } from '../clients/ClientsListPage.jsx';
import { LeaderboardPage } from '../leaderboard/LeaderboardPage.jsx';

// Nav id -> screen. Only these destinations have a built screen; the rest
// of NAV_GROUPS stays inert until a real page exists for them.
const NAV_SCREEN = {
  orders: 'orders-list',
  clients: 'clients-list',
  leaderboard: 'leaderboard',
};

// order-detail isn't a nav destination itself — it's reached via a row action
// on the orders list — so it maps back to the "Orders" item for highlighting.
const SCREEN_NAV = {
  'orders-list': 'orders',
  'order-detail': 'orders',
  'clients-list': 'clients',
  leaderboard: 'leaderboard',
};

export function App() {
  const [screen, setScreen] = useState('orders-list');
  const [focusSection, setFocusSection] = useState(null);

  function handleNavigate(navId) {
    const target = NAV_SCREEN[navId];
    if (target) setScreen(target);
  }

  // The demo only has one full order record, so every row's "View"/"Edit"/
  // "Add Note" opens the same detail page rather than per-row data.
  function openOrder(_orderId, section) {
    setFocusSection(section ?? null);
    setScreen('order-detail');
  }

  return (
    <AppShell active={SCREEN_NAV[screen]} onNavigate={handleNavigate}>
      {screen === 'orders-list' && <OrdersListPage onOpenOrder={openOrder} />}
      {screen === 'order-detail' && (
        <OrderPage onBack={() => setScreen('orders-list')} focusSection={focusSection} />
      )}
      {screen === 'clients-list' && <ClientsListPage />}
      {screen === 'leaderboard' && <LeaderboardPage />}
    </AppShell>
  );
}
