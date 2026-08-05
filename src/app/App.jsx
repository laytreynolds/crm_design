import { useEffect, useState } from 'react';
import { AppShell } from './AppShell.jsx';
import { OrderPage } from '../order/OrderPage.jsx';
import { NewOrderPage } from '../order/NewOrderPage.jsx';
import { OrdersListPage } from '../orders/OrdersListPage.jsx';
import { ClientPage } from '../client/ClientPage.jsx';
import { ClientsListPage } from '../clients/ClientsListPage.jsx';
import { DashboardPage } from '../dashboard/DashboardPage.jsx';
import { MyDashboardPage } from '../dashboard/MyDashboardPage.jsx';
import { SettingsListPage } from '../settings/SettingsListPage.jsx';
import { SETTINGS_CONFIG } from '../settings/settingsData.js';
import { UsersListPage } from '../users/UsersListPage.jsx';
import { PermissionsListPage } from '../permissions/PermissionsListPage.jsx';
import { TicketsListPage } from '../tickets/TicketsListPage.jsx';
import { TicketPage } from '../tickets/TicketPage.jsx';

// Nav id -> screen. Only these destinations have a built screen; the rest
// of NAV_GROUPS stays inert until a real page exists for them. Settings'
// and tickets' sub-items are handled separately below since they need
// extra state (settingId / ticketStatusFilter) beyond just a screen swap.
const NAV_SCREEN = {
  'orders-all': 'orders-list',
  clients: 'clients-list',
  dashboard: 'dashboard',
  'my-dashboard': 'my-dashboard',
  users: 'users-list',
  permissions: 'permissions-list',
};

// Tickets' sidebar sub-items map to a real status (unlike Orders' pipeline
// sub-items, which are shell-only — see navigation.js) since the ticket
// statuses are a small, fixed set that lines up exactly with the list
// page's own status filter.
const TICKET_STATUS_NAV = {
  'tickets-open': 'Open',
  'tickets-in-progress': 'In Progress',
  'tickets-awaiting-customer': 'Awaiting Customer',
  'tickets-resolved': 'Resolved',
  'tickets-closed': 'Closed',
};

// order-detail/client-detail/settings-detail aren't nav destinations
// themselves — they're reached via a row action or sub-item — so they map
// back to that section's nav item for highlighting.
const SCREEN_NAV = {
  'orders-list': 'orders',
  'order-detail': 'orders',
  'new-order': 'orders',
  'clients-list': 'clients',
  'client-detail': 'clients',
  dashboard: 'dashboards',
  'my-dashboard': 'dashboards',
  'settings-detail': 'settings',
  'users-list': 'users',
  'permissions-list': 'permissions',
  'tickets-list': 'tickets',
  'ticket-detail': 'tickets',
};

// Screen/settingId are kept in sessionStorage so a refresh reopens the same
// page. sessionStorage is cleared when the tab/browser closes, so the very
// next visit still lands on the dashboard.
const SESSION_KEY = 'crm:screen';

function readStoredScreen() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function App() {
  const stored = readStoredScreen();
  const [screen, setScreen] = useState(stored?.screen ?? 'dashboard');
  const [focusSection, setFocusSection] = useState(null);
  const [orderId, setOrderId] = useState(stored?.orderId ?? null);
  const [ticketId, setTicketId] = useState(stored?.ticketId ?? null);
  const [ticketStatusFilter, setTicketStatusFilter] = useState(null);
  const [clientMode, setClientMode] = useState('view');
  const [settingId, setSettingId] = useState(stored?.settingId ?? null);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ screen, settingId, orderId, ticketId }));
  }, [screen, settingId, orderId, ticketId]);

  function handleNavigate(navId) {
    if (navId in SETTINGS_CONFIG) {
      setSettingId(navId);
      setScreen('settings-detail');
      return;
    }
    if (navId in TICKET_STATUS_NAV) {
      setTicketStatusFilter(TICKET_STATUS_NAV[navId]);
      setScreen('tickets-list');
      return;
    }
    if (navId === 'tickets-all') {
      setTicketStatusFilter(null);
      setScreen('tickets-list');
      return;
    }
    const target = NAV_SCREEN[navId];
    if (target) setScreen(target);
  }

  function openOrder(id, section) {
    setOrderId(id);
    setFocusSection(section ?? null);
    setScreen('order-detail');
  }

  function openTicket(id, section) {
    setTicketId(id);
    setFocusSection(section ?? null);
    setScreen('ticket-detail');
  }

  // Same idea as openOrder: one demo client record, opened in either mode
  // depending on which row action was clicked.
  function openClient(_clientId, mode = 'view') {
    setClientMode(mode);
    setScreen('client-detail');
  }

  return (
    <AppShell active={SCREEN_NAV[screen]} onNavigate={handleNavigate}>
      {screen === 'orders-list' && (
        <OrdersListPage onOpenOrder={openOrder} onNewOrder={() => setScreen('new-order')} />
      )}
      {screen === 'order-detail' && (
        <OrderPage
          key={orderId}
          onBack={() => setScreen('orders-list')}
          orderId={orderId}
          focusSection={focusSection}
          onOpenClient={() => openClient(undefined, 'view')}
        />
      )}
      {screen === 'new-order' && (
        <NewOrderPage
          onBack={() => setScreen('orders-list')}
          onCreated={() => setScreen('orders-list')}
        />
      )}
      {screen === 'clients-list' && <ClientsListPage onOpenClient={openClient} />}
      {screen === 'client-detail' && (
        <ClientPage
          onBack={() => setScreen('clients-list')}
          mode={clientMode}
          onOpenOrder={openOrder}
          onOpenTicket={openTicket}
        />
      )}
      {screen === 'dashboard' && <DashboardPage />}
      {screen === 'my-dashboard' && <MyDashboardPage />}
      {screen === 'settings-detail' && <SettingsListPage key={settingId} settingId={settingId} />}
      {screen === 'users-list' && <UsersListPage />}
      {screen === 'permissions-list' && <PermissionsListPage />}
      {screen === 'tickets-list' && (
        <TicketsListPage
          key={ticketStatusFilter ?? 'all'}
          onOpenTicket={openTicket}
          initialStatus={ticketStatusFilter}
        />
      )}
      {screen === 'ticket-detail' && (
        <TicketPage
          key={ticketId}
          onBack={() => setScreen('tickets-list')}
          ticketId={ticketId}
          focusSection={focusSection}
          onOpenOrder={openOrder}
          onOpenClient={() => openClient(undefined, 'view')}
        />
      )}
    </AppShell>
  );
}
