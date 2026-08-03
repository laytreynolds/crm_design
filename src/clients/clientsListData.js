/**
 * Seed rows for the clients list. In a live CRM this comes from a paginated
 * clients API; kept as plain data so ClientsListPage only ever reads an array.
 *
 * `orders` mirrors how many rows this client has in the Orders list seed data
 * (e.g. Edith Ashton has two there — "1 of 2" / "2 of 2").
 */
export const INITIAL_CLIENTS = [
  {
    id: 1,
    fullName: 'Linda Holbrey',
    email: 'linda.holbrey@gmail.com',
    mobile: '07911 223344',
    orders: 1,
    assigned: 'JamieEvans',
    status: 'Account Holder',
  },
  {
    id: 2,
    fullName: 'Zoe Larkins',
    email: 'zoe.larkins@outlook.com',
    mobile: '07938 699291',
    orders: 1,
    assigned: 'Luca',
    status: 'Account Holder',
  },
  {
    id: 3,
    fullName: 'Edward Jacey',
    email: 'edward.jacey@icloud.com',
    mobile: '07346 690335',
    orders: 1,
    assigned: 'JamieEvans',
    status: 'User',
  },
  {
    id: 4,
    fullName: 'Hayley Acton',
    email: 'hayley.acton@gmail.com',
    mobile: '07799 413223',
    orders: 1,
    assigned: 'amiriqbal',
    status: 'Account Holder',
  },
  {
    id: 5,
    fullName: 'Mr Daniel Rix',
    email: 'daniel.rix@outlook.com',
    mobile: '07730 035147',
    orders: 1,
    assigned: 'Luke',
    status: 'Authorised User',
  },
  {
    id: 6,
    fullName: 'Edith Ashton',
    email: 'edith.ashton@icloud.com',
    mobile: '07795 366485',
    orders: 2,
    assigned: 'Tess',
    status: 'Account Holder',
  },
  {
    id: 7,
    fullName: 'Jarmani Owen',
    email: 'jarmani.owen@gmail.com',
    mobile: '07519 458136',
    orders: 1,
    assigned: 'Luca',
    status: 'User',
  },
  {
    id: 8,
    fullName: 'Patricia Bridge',
    email: 'patricia.bridge@outlook.com',
    mobile: '07939 595513',
    orders: 1,
    assigned: 'marcoadaggio',
    status: 'Account Holder',
  },
  {
    id: 9,
    fullName: 'Mr Richard Freeman',
    email: 'richard.freeman@gmail.com',
    mobile: '07768 962325',
    orders: 2,
    assigned: 'Mike',
    status: 'Authorised User',
  },
];

export const STATUS_OPTIONS = ['Account Holder', 'User', 'Authorised User'];

/** Keys into the `.cl-status--*` chip colors in clients-list.css. */
export const STATUS_TONE = {
  'Account Holder': 'holder',
  User: 'user',
  'Authorised User': 'authorised',
};

function distinctSorted(field) {
  return [...new Set(INITIAL_CLIENTS.map((c) => c[field]))].sort();
}

/** Filter dropdown options, derived from the data so a selection always matches something. */
export const ASSIGNED_USER_OPTIONS = distinctSorted('assigned');
