/**
 * Seed rows for the permissions list. Same idea as settingsData.js — one
 * flat array so PermissionsListPage only ever reads data, no logic.
 */
export const INITIAL_PERMISSIONS = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Edit everything, including users, permissions and settings.',
    category: 'Orders',
  },
  {
    id: 2,
    name: 'Customer Service',
    description: 'Can create, update and change the status of orders.',
    category: 'Orders',
  },
  {
    id: 3,
    name: 'Delete Orders',
    description: 'Can permanently remove orders from the system.',
    category: 'Orders',
  },
  {
    id: 4,
    name: 'View Clients',
    description: 'Can view the clients list and client detail pages.',
    category: 'Clients',
  },
  {
    id: 5,
    name: 'Edit Clients',
    description: 'Can create and update client records.',
    category: 'Clients',
  },
  {
    id: 6,
    name: 'Delete Clients',
    description: 'Can permanently remove clients from the system.',
    category: 'Clients',
  },
  {
    id: 7,
    name: 'Manage Users',
    description: 'Can create, edit, delete users and assign campaigns.',
    category: 'Administration',
  },
  {
    id: 8,
    name: 'Manage Permissions',
    description: 'Can edit what each permission allows.',
    category: 'Administration',
  },
  {
    id: 9,
    name: 'Manage Settings',
    description: 'Can edit lookup lists such as statuses, campaigns and tariffs.',
    category: 'Administration',
  },
  {
    id: 10,
    name: 'View Dashboard',
    description: 'Can view sales dashboard metrics, trends and leaderboard rankings.',
    category: 'Reporting',
  },
];
