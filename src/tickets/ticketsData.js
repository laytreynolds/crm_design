/**
 * Seed data for the ticketing system demo. Same approach as the rest of the
 * app (see PRODUCT.md): hardcoded records, no backend, kept in one module so
 * every screen just reads a plain array/object.
 *
 * Ticket shape:
 *   id              string, e.g. 'TCK-1042'
 *   subject         string
 *   status          one of TICKET_STATUSES
 *   source          one of TICKET_SOURCES
 *   priority        one of TICKET_PRIORITIES
 *   client_id       INITIAL_CLIENTS id, or null if unmatched
 *   contact_email   captured for Email-sourced tickets regardless of match outcome
 *   contact_phone   captured for Website Form-sourced tickets regardless of match outcome
 *   assigned_to     staff name, or null if unassigned
 *   created_at      'YYYY-MM-DD HH:MM'
 *   updated_at      'YYYY-MM-DD HH:MM'
 *   notes           append-only activity log: { id, kind: 'message' | 'note' | 'status', text, author, at }
 *
 * `linked_order_id` deliberately isn't stored on the ticket — see
 * resolveLinkedOrder() below, which resolves the client's most recent/active
 * order at display time instead, so it can't go stale against the order.
 */
import { INITIAL_ORDERS } from '../orders/ordersListData.js';
import { INITIAL_CLIENTS } from '../clients/clientsListData.js';
import { getOrderDetail } from '../order/orderData.js';

export const TICKET_STATUSES = ['Open', 'In Progress', 'Awaiting Customer', 'Resolved', 'Closed'];

export const TICKET_SOURCES = ['Email', 'Website Form', 'Internal'];

export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

/** Keys into the `.tk-status--*` chip colors in tickets-list.css / ticket-page.css. */
export const STATUS_TONE = {
  Open: 'open',
  'In Progress': 'progress',
  'Awaiting Customer': 'awaiting',
  Resolved: 'resolved',
  Closed: 'closed',
};

/** Keys into the `.tk-priority--*` chip colors in tickets-list.css / ticket-page.css. */
export const PRIORITY_TONE = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent',
};

export const TICKET_STAFF = [
  'Jamie Evans',
  'Luca Nothnagel Di Giovanni',
  'Amir Iqbal',
  'Luke Jennings',
  'Tess Montero',
  'Marco Adaggio',
  'Mike Powell',
  'Alison Box',
  'Layton Reynolds',
];

/**
 * Which orders (by id, matching orders/ordersListData.js) belong to each
 * client (by id, matching clients/clientsListData.js). Hand-mapped rather
 * than matched by name at runtime — the two seed files already describe the
 * same people (see orderData.js's note on this) — so this just makes the
 * relationship explicit and gives the "Order" section something real to
 * resolve against.
 */
const CLIENT_ORDER_IDS = {
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [6, 7],
  7: [8],
  8: [9],
  9: [10],
};

/** Hand-authored — INITIAL_CLIENTS only carries what the clients list table
 * shows. Postcodes/towns match the linked order's postCode field. */
const CLIENT_ADDRESSES = {
  1: { line1: '14 Church Lane', line2: '', city: 'Grimsby', postcode: 'DN31 2QW' },
  2: { line1: '8 Harbour View', line2: '', city: 'Great Yarmouth', postcode: 'NR31 7AX' },
  3: { line1: '27 Mill Road', line2: '', city: 'Watton', postcode: 'IP25 6NX' },
  4: { line1: '3 Orchard Close', line2: '', city: 'Godalming', postcode: 'GU8 5JN' },
  5: { line1: '61 Victoria Street', line2: '', city: 'Grays', postcode: 'RM17 5NS' },
  6: { line1: '19 Birch Grove', line2: '', city: 'Whiston', postcode: 'L35 5BE' },
  7: { line1: '42 Chapel Street', line2: '', city: 'Westcliff-on-Sea', postcode: 'SS0 7LN' },
  8: { line1: '5 Windsor Close', line2: '', city: 'Longridge', postcode: 'PR3 3EL' },
  9: { line1: '76 Kings Avenue', line2: '', city: 'Great Dunmow', postcode: 'CM6 2NX' },
};

const TERMINAL_ORDER_STATUSES = new Set(['Declined', 'Cancelled']);

/** Client record for the "Client Information" section, or null if unlinked. */
export function getClientProfile(clientId) {
  if (clientId == null) return null;
  const row = INITIAL_CLIENTS.find((c) => c.id === clientId);
  if (!row) return null;
  return { ...row, billingAddress: CLIENT_ADDRESSES[clientId] ?? null };
}

/**
 * The client's most recent/active order, resolved from the current orders
 * data rather than stored on the ticket, so it stays correct even if the
 * order's status has moved on since the ticket was raised. Most recent
 * placedDate wins; ties prefer a non-terminal status.
 */
export function resolveLinkedOrder(clientId) {
  const ids = CLIENT_ORDER_IDS[clientId] ?? [];
  const orders = ids.map((id) => INITIAL_ORDERS.find((o) => o.id === id)).filter(Boolean);
  if (orders.length === 0) return null;

  const [best] = [...orders].sort((a, b) => {
    if (a.placedDate !== b.placedDate) return a.placedDate < b.placedDate ? 1 : -1;
    const aTerm = TERMINAL_ORDER_STATUSES.has(a.status) ? 1 : 0;
    const bTerm = TERMINAL_ORDER_STATUSES.has(b.status) ? 1 : 0;
    return aTerm - bTerm;
  });

  const detail = getOrderDetail(best.id);
  return {
    id: best.id,
    saleType: best.saleType,
    status: best.status,
    statusTone: best.statusTone,
    placedDate: best.placedDate,
    boxValue: best.boxValue,
    handset: detail.currentPackage.handset || detail.saleDetails.handsetOld,
  };
}

/** 'YYYY-MM-DD HH:MM' -> 'DD/MM/YYYY, HH:MM'. Kept as plain 24h text so seed
 * data can be hand-authored without a Date/timezone round trip. */
export function formatTicketDateTime(value) {
  if (!value) return '—';
  const [datePart, timePart] = value.split(' ');
  const [y, m, d] = datePart.split('-');
  return `${d}/${m}/${y}, ${timePart}`;
}

/** Timestamp in the same shape as the seed data, for notes/status changes added live. */
export function stampNow() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const MS_PER_DAY = 86400000;

/** Whole days between a 'YYYY-MM-DD HH:MM' timestamp and now. */
export function getTicketAgeDays(createdAt) {
  const [datePart, timePart] = createdAt.split(' ');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const created = new Date(y, m - 1, d, hh, mm);
  return Math.max(0, Math.floor((Date.now() - created.getTime()) / MS_PER_DAY));
}

/** 'Today' / '1 day' / 'N days' — how long the ticket has been open, for display. */
export function formatTicketAge(createdAt) {
  const days = getTicketAgeDays(createdAt);
  if (days === 0) return 'Today';
  return days === 1 ? '1 day' : `${days} days`;
}

let noteSeq = 1;
function note(kind, text, author, at) {
  return { id: noteSeq++, kind, text, author, at };
}

export const INITIAL_TICKETS = [
  {
    id: 'TCK-1042',
    subject: 'SIM not activating after port',
    status: 'In Progress',
    source: 'Email',
    priority: 'Medium',
    client_id: 1,
    contact_email: 'linda.holbrey@gmail.com',
    contact_phone: null,
    assigned_to: 'Jamie Evans',
    created_at: '2026-08-05 08:12',
    updated_at: '2026-08-05 09:40',
    notes: [
      note(
        'message',
        "Hi, I ported my number to Chadwell yesterday and my SIM still shows no service. I've restarted the phone twice. Can someone check the port status? — Linda",
        'Linda Holbrey',
        '2026-08-05 08:12',
      ),
      note('status', 'Status changed from Open to In Progress', 'Jamie Evans', '2026-08-05 09:10'),
      note(
        'note',
        'Checked with network — port is showing complete on our side. Asked customer to try the SIM in another handset to rule out a device issue.',
        'Jamie Evans',
        '2026-08-05 09:40',
      ),
    ],
  },
  {
    id: 'TCK-1041',
    subject: 'Wrong handset colour delivered',
    status: 'Open',
    source: 'Email',
    priority: 'Medium',
    client_id: 4,
    contact_email: 'hayley.acton@gmail.com',
    contact_phone: null,
    assigned_to: null,
    created_at: '2026-08-05 07:55',
    updated_at: '2026-08-05 07:55',
    notes: [
      note(
        'message',
        'The iPhone that arrived is Midnight, I ordered Starlight. Order reference attached. Please advise on exchange.',
        'Hayley Acton',
        '2026-08-05 07:55',
      ),
    ],
  },
  {
    id: 'TCK-1040',
    subject: 'Website enquiry: upgrade eligibility',
    status: 'Open',
    source: 'Website Form',
    priority: 'Low',
    client_id: null,
    contact_email: null,
    contact_phone: '07421 558903',
    assigned_to: null,
    created_at: '2026-08-05 07:20',
    updated_at: '2026-08-05 07:20',
    notes: [
      note(
        'message',
        'Submitted via website contact form: "When can I upgrade my EE plan? My number is 07421 558903, no account number to hand."',
        'Website form',
        '2026-08-05 07:20',
      ),
    ],
  },
  {
    id: 'TCK-1039',
    subject: 'Billing query - duplicate charge',
    status: 'Awaiting Customer',
    source: 'Email',
    priority: 'High',
    client_id: 6,
    contact_email: 'edith.ashton@icloud.com',
    contact_phone: null,
    assigned_to: 'Tess Montero',
    created_at: '2026-08-04 16:05',
    updated_at: '2026-08-05 09:02',
    notes: [
      note(
        'message',
        "I've been charged twice for July, can you look into this please.",
        'Edith Ashton',
        '2026-08-04 16:05',
      ),
      note('status', 'Status changed from Open to In Progress', 'Tess Montero', '2026-08-04 16:30'),
      note(
        'note',
        'Pulled up billing history — looks like a duplicate direct debit collection. Raising with finance for a refund.',
        'Tess Montero',
        '2026-08-04 17:20',
      ),
      note('status', 'Status changed from In Progress to Awaiting Customer', 'Tess Montero', '2026-08-05 09:02'),
    ],
  },
  {
    id: 'TCK-1038',
    subject: 'Order stuck on Awaiting Stock',
    status: 'In Progress',
    source: 'Internal',
    priority: 'Medium',
    client_id: 9,
    contact_email: null,
    contact_phone: null,
    assigned_to: 'Mike Powell',
    created_at: '2026-08-04 14:30',
    updated_at: '2026-08-05 08:50',
    notes: [
      note(
        'message',
        "Handset for this order has been on 'Awaiting Stock' for 4 days — customer chasing. Can ops confirm ETA?",
        'Mike Powell',
        '2026-08-04 14:30',
      ),
      note('status', 'Status changed from Open to In Progress', 'Mike Powell', '2026-08-04 15:00'),
      note(
        'note',
        'Checked with supplier — stock expected Thursday, will update the customer once dispatched.',
        'Mike Powell',
        '2026-08-05 08:50',
      ),
    ],
  },
  {
    id: 'TCK-1037',
    subject: 'Direct debit failed - urgent',
    status: 'Open',
    source: 'Email',
    priority: 'Urgent',
    client_id: 2,
    contact_email: 'zoe.larkins@outlook.com',
    contact_phone: null,
    assigned_to: null,
    created_at: '2026-08-04 13:10',
    updated_at: '2026-08-04 13:10',
    notes: [
      note(
        'message',
        'My direct debit failed this month and I got a text about it — can you confirm my account is okay and take payment manually if needed?',
        'Zoe Larkins',
        '2026-08-04 13:10',
      ),
    ],
  },
  {
    id: 'TCK-1036',
    subject: 'Request to cancel pending order',
    status: 'Awaiting Customer',
    source: 'Website Form',
    priority: 'Medium',
    client_id: 3,
    contact_email: null,
    contact_phone: '07346 690335',
    assigned_to: 'Jamie Evans',
    created_at: '2026-08-04 11:45',
    updated_at: '2026-08-05 08:16',
    notes: [
      note(
        'message',
        "Submitted via website contact form: \"I'd like to cancel my recent order, changed my mind. Please call me on 07346 690335.\"",
        'Website form',
        '2026-08-04 11:45',
      ),
      note('status', 'Status changed from Open to In Progress', 'Jamie Evans', '2026-08-04 12:30'),
      note(
        'note',
        'Called customer, confirmed they still want to cancel. Passed to processing team, awaiting confirmation email back from the customer to close out.',
        'Jamie Evans',
        '2026-08-05 08:15',
      ),
      note('status', 'Status changed from In Progress to Awaiting Customer', 'Jamie Evans', '2026-08-05 08:16'),
    ],
  },
  {
    id: 'TCK-1035',
    subject: 'Coverage query for new connection',
    status: 'Resolved',
    source: 'Website Form',
    priority: 'Low',
    client_id: null,
    contact_email: null,
    contact_phone: '07555 210934',
    assigned_to: 'Luca Nothnagel Di Giovanni',
    created_at: '2026-08-03 15:20',
    updated_at: '2026-08-04 09:30',
    notes: [
      note(
        'message',
        'Submitted via website contact form: "Does EE have good coverage at TN14? Thinking of switching." Contact: 07555 210934',
        'Website form',
        '2026-08-03 15:20',
      ),
      note(
        'note',
        'Checked the EE coverage checker for TN14 — good 4G/5G coverage confirmed, replied to the customer by phone.',
        'Luca Nothnagel Di Giovanni',
        '2026-08-03 16:05',
      ),
      note('status', 'Status changed from Open to Resolved', 'Luca Nothnagel Di Giovanni', '2026-08-04 09:30'),
    ],
  },
  {
    id: 'TCK-1034',
    subject: 'Complaint - call not returned',
    status: 'Closed',
    source: 'Email',
    priority: 'High',
    client_id: 5,
    contact_email: 'daniel.rix@outlook.com',
    contact_phone: null,
    assigned_to: 'Luke Jennings',
    created_at: '2026-08-02 10:05',
    updated_at: '2026-08-03 12:40',
    notes: [
      note(
        'message',
        'I was promised a callback yesterday about my contract renewal and nobody called. Not happy.',
        'Mr Daniel Rix',
        '2026-08-02 10:05',
      ),
      note('status', 'Status changed from Open to In Progress', 'Luke Jennings', '2026-08-02 11:00'),
      note(
        'note',
        'Called customer, apologised for the delay, talked through renewal options — resolved over the phone.',
        'Luke Jennings',
        '2026-08-03 09:15',
      ),
      note('status', 'Status changed from In Progress to Closed', 'Luke Jennings', '2026-08-03 12:40'),
    ],
  },
  {
    id: 'TCK-1033',
    subject: 'Internal: escalate delayed handset dispatch',
    status: 'In Progress',
    source: 'Internal',
    priority: 'High',
    client_id: 7,
    contact_email: null,
    contact_phone: null,
    assigned_to: 'Amir Iqbal',
    created_at: '2026-08-02 09:15',
    updated_at: '2026-08-04 10:00',
    notes: [
      note(
        'message',
        "Flagging that this order's handset dispatch is 3 days overdue against SLA — please prioritise.",
        'Amir Iqbal',
        '2026-08-02 09:15',
      ),
      note('status', 'Status changed from Open to In Progress', 'Amir Iqbal', '2026-08-02 09:20'),
      note('note', 'Warehouse confirms dispatch going out today, tracking to follow.', 'Amir Iqbal', '2026-08-04 10:00'),
    ],
  },
  {
    id: 'TCK-1032',
    subject: 'Unable to log into customer portal',
    status: 'Resolved',
    source: 'Email',
    priority: 'Medium',
    client_id: 8,
    contact_email: 'patricia.bridge@outlook.com',
    contact_phone: null,
    assigned_to: 'Marco Adaggio',
    created_at: '2026-08-01 14:50',
    updated_at: '2026-08-02 09:10',
    notes: [
      note(
        'message',
        'Portal keeps saying my password is incorrect even after reset. Please help.',
        'Patricia Bridge',
        '2026-08-01 14:50',
      ),
      note('status', 'Status changed from Open to In Progress', 'Marco Adaggio', '2026-08-01 15:05'),
      note(
        'note',
        'Reset the account lockout on our end and sent a fresh password reset link.',
        'Marco Adaggio',
        '2026-08-01 16:10',
      ),
      note('status', 'Status changed from In Progress to Resolved', 'Marco Adaggio', '2026-08-02 09:10'),
    ],
  },
  {
    id: 'TCK-1031',
    subject: 'Website enquiry: new SIM only plan',
    status: 'Closed',
    source: 'Website Form',
    priority: 'Low',
    client_id: null,
    contact_email: null,
    contact_phone: '07882 340117',
    assigned_to: null,
    created_at: '2026-07-31 12:00',
    updated_at: '2026-08-01 09:00',
    notes: [
      note(
        'message',
        'Submitted via website contact form: "Looking for a cheap SIM only plan, unlimited data if possible. Call me on 07882 340117."',
        'Website form',
        '2026-07-31 12:00',
      ),
      note(
        'note',
        "Called customer, talked through SIM only options — they've decided to go with another provider for now.",
        'Jamie Evans',
        '2026-07-31 15:40',
      ),
      note('status', 'Status changed from Open to Closed', 'Jamie Evans', '2026-08-01 09:00'),
    ],
  },
  {
    id: 'TCK-1030',
    subject: 'Internal: credit check review needed',
    status: 'Open',
    source: 'Internal',
    priority: 'Medium',
    client_id: 1,
    contact_email: null,
    contact_phone: null,
    assigned_to: null,
    created_at: '2026-08-05 06:40',
    updated_at: '2026-08-05 06:40',
    notes: [
      note(
        'message',
        "Credit check came back as 'Refer' for this customer's new connection — needs manual review before we proceed.",
        'Layton Reynolds',
        '2026-08-05 06:40',
      ),
    ],
  },
  {
    id: 'TCK-1029',
    subject: 'Query about porting old number',
    status: 'Awaiting Customer',
    source: 'Email',
    priority: 'Low',
    client_id: 9,
    contact_email: 'richard.freeman@gmail.com',
    contact_phone: null,
    assigned_to: 'Mike Powell',
    created_at: '2026-07-30 09:30',
    updated_at: '2026-08-01 11:21',
    notes: [
      note(
        'message',
        "Can you confirm if my old O2 number can still be ported now it's been more than 30 days since I left them?",
        'Mr Richard Freeman',
        '2026-07-30 09:30',
      ),
      note('status', 'Status changed from Open to In Progress', 'Mike Powell', '2026-07-30 10:00'),
      note(
        'note',
        "Checked with the network — porting window has expired, customer needs their PAC re-issued. Emailed instructions, awaiting their response.",
        'Mike Powell',
        '2026-08-01 11:20',
      ),
      note('status', 'Status changed from In Progress to Awaiting Customer', 'Mike Powell', '2026-08-01 11:21'),
    ],
  },
];

function distinctSorted(field) {
  return [...new Set(INITIAL_TICKETS.map((t) => t[field]).filter(Boolean))].sort();
}

/** Filter dropdown option, derived from the data so a selection always matches something. */
export const ASSIGNED_STAFF_OPTIONS = distinctSorted('assigned_to');
