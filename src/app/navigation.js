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
    label: 'Customers',
    items: [{ id: 'clients', label: 'Customers', icon: 'group' }],
  },
  {
    label: 'Orders',
    items: [
      {
        id: 'orders',
        label: 'Orders',
        icon: 'receipt_long',
        children: [
          {
            group: 'All Orders',
            items: [
              { id: 'orders-consumer-qc', label: 'Consumer QC' },
              { id: 'orders-awaiting-tekton-upload', label: 'Awaiting TEKTON Upload' },
              { id: 'orders-pending-welcome-call', label: 'Pending Welcome Call' },
              { id: 'orders-declined', label: 'Declined' },
              { id: 'orders-awaiting-contract-10-plus', label: 'Awaiting Contract 10+' },
              { id: 'orders-fully-connected', label: 'Fully Connected' },
              { id: 'orders-connected-c2b-submitted', label: 'Connected - C2B Submitted' },
              { id: 'orders-add-to-master', label: 'Add to Master' },
              { id: 'orders-connected-awaiting-c2b-transfer', label: 'Connected - Awaiting C2B TRANSFER' },
              { id: 'orders-esim-to-process', label: 'E-Sim - To Process' },
              { id: 'orders-signed-awaiting-sales-team', label: 'Signed - Awaiting Sales Team' },
              { id: 'orders-awaiting-stock', label: 'Awaiting Stock' },
              { id: 'orders-signed-awaiting-plan', label: 'Signed - Awaiting Plan' },
              { id: 'orders-future-end-date', label: 'Future End Date' },
              { id: 'orders-to-process', label: 'To Process' },
              { id: 'orders-cancelled', label: 'Cancelled' },
              { id: 'orders-issues', label: 'Issues' },
              { id: 'orders-complete', label: 'Complete' },
              { id: 'orders-awaiting-contract', label: 'Awaiting Contract' },
              { id: 'lost-quotes', label: 'Lost Quotes' },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Users & Permissions',
    items: [
      {
        id: 'users',
        label: 'Users & Permissions',
        icon: 'admin_panel_settings',
        children: [
          {
            group: null,
            items: [
              { id: 'users', label: 'Users' },
              { id: 'permissions', label: 'Permissions' },],
          }]
      }],
  },
  {
    label: 'Settings',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        children: [
          {
            group: null,
            items: [
              { id: 'settings-lead-status', label: 'Lead Status' },
              { id: 'settings-client-status', label: 'Client Status' },
              { id: 'settings-order-status', label: 'Order Status' },
              { id: 'settings-campaigns', label: 'Campaigns' },
              { id: 'settings-business-type', label: 'Business Type' },
              { id: 'settings-current-network', label: 'Current Network' },
              { id: 'settings-sale-type', label: 'Sale Type' },
              { id: 'settings-handset', label: 'Handset' },
              { id: 'settings-tariff', label: 'Tariff' },
              { id: 'settings-lead-source', label: 'Lead Source' },
              { id: 'settings-new-network', label: 'New Network' },
              { id: 'settings-bolt-ons-manager', label: 'Bolt Ons Manager' },
            ],
          },
        ],
      },
    ],
  },
];
