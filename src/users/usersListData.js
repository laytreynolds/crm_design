/**
 * Seed rows for the users list. Mirrors the shape of clientsListData.js —
 * plain data so UsersListPage only ever reads an array.
 */
export const INITIAL_USERS = [
  {
    id: 1,
    fullName: 'Layton Reynolds',
    email: 'layton.reynolds@chadwell.com',
    role: 'Admin',
    status: 'Active',
    campaign: 'Three Q3 Consumer Switch',
  },
  {
    id: 2,
    fullName: 'Stuart Box',
    email: 'stuart.box@chadwell.com',
    role: 'Manager',
    status: 'Active',
    campaign: 'EE Essential Push',
  },
  {
    id: 3,
    fullName: 'Jamie Dunn',
    email: 'jamie.dunn@chadwell.com',
    role: 'Sales Agent',
    status: 'Active',
    campaign: 'Unassigned',
  },
  {
    id: 4,
    fullName: 'Alison Box',
    email: 'alison.box@chadwell.com',
    role: 'Sales Agent',
    status: 'Active',
    campaign: 'O2 Upgrade Drive',
  },
  {
    id: 5,
    fullName: 'Amir Iqbal',
    email: 'amir.iqbal@chadwell.com',
    role: 'Support',
    status: 'Inactive',
    campaign: 'Unassigned',
  },
  {
    id: 6,
    fullName: 'Tess Fowler',
    email: 'tess.fowler@chadwell.com',
    role: 'Sales Agent',
    status: 'Active',
    campaign: 'Summer Retention Offer',
  },
  {
    id: 7,
    fullName: 'Marco Adaggio',
    email: 'marco.adaggio@chadwell.com',
    role: 'Manager',
    status: 'Active',
    campaign: 'Unassigned',
  },
];

export const ROLE_OPTIONS = ['Admin', 'Manager', 'Sales Agent', 'Support'];
export const STATUS_OPTIONS = ['Active', 'Inactive'];

/** Keys into the `.us-status--*` chip colors in users-list.css. */
export const STATUS_TONE = {
  Active: 'active',
  Inactive: 'inactive',
};

export const CAMPAIGN_OPTIONS = [
  'Three Q3 Consumer Switch',
  'EE Essential Push',
  'O2 Upgrade Drive',
  'Summer Retention Offer',
];
