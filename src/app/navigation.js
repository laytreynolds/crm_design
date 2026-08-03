/**
 * Sidebar destinations. Only `orders` is built in this demo — the rest are
 * present so the shell reads as the real CRM.
 */
export const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'emoji_events' },
    ],
  },
  {
    label: 'Clients',
    items: [{ id: 'clients', label: 'Clients', icon: 'group' }],
  },
  {
    label: 'Orders',
    items: [{ id: 'orders', label: 'Orders', icon: 'receipt_long' }],
  },
  {
    label: 'Users & roles',
    items: [{ id: 'users', label: 'Users & Roles', icon: 'admin_panel_settings' }],
  },
  {
    label: 'Settings',
    items: [{ id: 'settings', label: 'Settings', icon: 'settings' }],
  },
];
