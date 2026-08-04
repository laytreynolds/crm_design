/**
 * Seed rows for the orders list. In a live CRM this comes from a paginated
 * orders API; kept as plain data so OrdersListPage only ever reads an array.
 *
 * statusTone keys into the `.ol-status--*` chip colors in orders-list.css.
 *
 * INITIAL_ORDERS = the 10 hand-authored rows below (all placed 2026-08-03,
 * used by the orders list / order detail demo screens) + a deterministically
 * generated multi-week tail (see generateHistoricalOrders) that gives the
 * dashboard's day/week/month rollups, trend chart and return rate something
 * real to aggregate over.
 */
const HAND_AUTHORED_ORDERS = [
  {
    id: 1,
    saleType: 'Three Consumer',
    agentName: 'JamieEvans',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: 'New number',
    businessName: 'Linda Holbrey',
    postCode: 'DN31 2QW',
    status: 'Awaiting Contact',
    statusTone: 'awaiting',
    boxValue: '£ 48',
    placedDate: '2026-08-03',
    placedTime: '02:14 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 2,
    saleType: 'Three New Connection',
    agentName: 'Luca',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: '07938699291',
    businessName: 'Zoe Larkins',
    postCode: 'NR31 7AX',
    status: 'Declined',
    statusTone: 'declined',
    boxValue: '£ 200.8',
    placedDate: '2026-08-03',
    placedTime: '02:07 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 3,
    saleType: 'Three New Connection',
    agentName: 'JamieEvans',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: '07346690335',
    businessName: 'Edward Jacey',
    postCode: 'IP25 6NX',
    status: 'Declined',
    statusTone: 'declined',
    boxValue: '£ 231.35',
    placedDate: '2026-08-03',
    placedTime: '02:02 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 4,
    saleType: 'Three New Connection',
    agentName: 'amiriqbal',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: '07799413223',
    businessName: 'Hayley Acton',
    postCode: 'GU8 5JN',
    status: 'To Process',
    statusTone: 'process',
    boxValue: '£ 128.65',
    placedDate: '2026-08-03',
    placedTime: '01:48 PM',
    eligibilityDate: '',
  },
  {
    id: 5,
    saleType: 'O2 Consumer',
    agentName: 'Luke',
    campaign: 'O2 Upgrade Drive',
    mobileNumber: '07730035147',
    businessName: 'Mr Daniel Rix',
    postCode: 'RM17 5NS',
    status: 'Awaiting Contact',
    statusTone: 'awaiting',
    boxValue: '£ 96.58',
    placedDate: '2026-08-03',
    placedTime: '01:15 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 6,
    saleType: 'EE Consumer',
    agentName: 'Tess',
    campaign: 'EE Essential Push',
    mobileNumber: '07795366485',
    businessName: 'Edith Ashton 1 of 2',
    postCode: 'L35 5BE',
    status: 'Awaiting Contact',
    statusTone: 'awaiting',
    boxValue: '£ 245.16',
    placedDate: '2026-08-03',
    placedTime: '12:51 PM',
    eligibilityDate: '2026-08-01',
  },
  {
    id: 7,
    saleType: 'EE Consumer',
    agentName: 'Tess',
    campaign: 'EE Essential Push',
    mobileNumber: '07795366485',
    businessName: 'Edith Ashton 2 of 2',
    postCode: 'L35 5BE',
    status: 'Awaiting Contact',
    statusTone: 'awaiting',
    boxValue: '£ 245.16',
    placedDate: '2026-08-03',
    placedTime: '12:51 PM',
    eligibilityDate: '2026-08-01',
  },
  {
    id: 8,
    saleType: 'Three New Connection',
    agentName: 'Luca',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: '07519458136',
    businessName: 'Jarmani Owen',
    postCode: 'SS0 7LN',
    status: 'To Process',
    statusTone: 'process',
    boxValue: '£ 210',
    placedDate: '2026-08-03',
    placedTime: '12:33 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 9,
    saleType: 'Three New Connection',
    agentName: 'marcoadaggio',
    campaign: 'Three Q3 Consumer Switch',
    mobileNumber: '07939595513',
    businessName: 'Patricia Bridge',
    postCode: 'PR3 3EL',
    status: 'To Process',
    statusTone: 'process',
    boxValue: '£ 224',
    placedDate: '2026-08-03',
    placedTime: '12:10 PM',
    eligibilityDate: '2026-08-03',
  },
  {
    id: 10,
    saleType: 'O2 Upgrade',
    agentName: 'Mike',
    campaign: 'O2 Upgrade Drive',
    mobileNumber: '07768962325',
    businessName: 'Mr Richard Freeman (2 of 2)',
    postCode: 'CM6 2NX',
    status: 'Awaiting Stock',
    statusTone: 'stock',
    boxValue: '£ 105.1',
    placedDate: '2026-08-03',
    placedTime: '11:52 AM',
    eligibilityDate: '2026-08-03',
  },
];

/** Short agentName (as stored on an order) -> full display name, shared with the dashboard leaderboard. */
export const AGENT_DISPLAY_NAMES = {
  JamieEvans: 'Jamie Evans',
  Luca: 'Luca Nothnagel Di Giovanni',
  amiriqbal: 'Amir Iqbal',
  Luke: 'Luke Jennings',
  Tess: 'Tess Montero',
  marcoadaggio: 'Marco Adaggio',
  Mike: 'Mike Powell',
};

const SALE_LINES = [
  { saleType: 'Three Consumer', campaign: 'Three Q3 Consumer Switch' },
  { saleType: 'Three New Connection', campaign: 'Three Q3 Consumer Switch' },
  { saleType: 'O2 Consumer', campaign: 'O2 Upgrade Drive' },
  { saleType: 'O2 Upgrade', campaign: 'O2 Upgrade Drive' },
  { saleType: 'EE Consumer', campaign: 'EE Essential Push' },
];

// Weighted so most orders move forward through the pipeline and only a
// minority end up cancelled/declined — enough to make a return rate visible
// without swamping the "valid sale" numbers.
const STATUS_POOL = [
  ...Array(6).fill(['Awaiting Contact', 'awaiting']),
  ...Array(6).fill(['To Process', 'process']),
  ...Array(4).fill(['Awaiting Stock', 'stock']),
  ...Array(4).fill(['Declined', 'declined']),
  ...Array(3).fill(['Cancelled', 'cancelled']),
];

const FIRST_NAMES = [
  'Olivia', 'Harry', 'Amelia', 'George', 'Isla', 'Noah', 'Freya', 'Jack', 'Sophie', 'Leo',
  'Grace', 'Oscar', 'Ruby', 'Charlie', 'Mia', 'Alfie', 'Ella', 'Archie', 'Ivy', 'Theo',
  'Poppy', 'Finn', 'Lucy', 'Max', 'Chloe',
];
const LAST_NAMES = [
  'Baker', 'Marsh', 'Whitfield', 'Ostler', 'Croft', 'Penhale', 'Yardley', 'Nesbitt', 'Colley',
  'Hargrove', 'Studley', 'Rennick', 'Kesteven', 'Attridge', 'Byfield', 'Trenholm', 'Sowerby',
  'Micklewright',
];
const POSTCODE_AREAS = [
  'DN31', 'NR31', 'IP25', 'GU8', 'RM17', 'L35', 'SS0', 'PR3', 'CM6', 'BN14', 'LE11', 'NG18',
  'TS17', 'WF10', 'HU9',
];
const POSTCODE_SUFFIXES = ['AB', 'JN', 'LN', 'QW', 'NX', 'ZY', 'WE', 'RT'];

/** Deterministic PRNG (mulberry32) so the generated seed rows are stable across reloads. */
function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeHelpers(rand) {
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  return { pick, randInt };
}

function formatDateUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysUTC(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

/**
 * Builds `daysBack + 1` days of orders ending on referenceDateStr (inclusive),
 * skipping any date already covered by HAND_AUTHORED_ORDERS. Weekdays get
 * more orders than weekends so the trend chart has a realistic weekly shape.
 */
function generateHistoricalOrders(referenceDateStr, daysBack, skipDates, startId) {
  const rand = mulberry32(20260804);
  const { pick, randInt } = makeHelpers(rand);
  const [ry, rm, rd] = referenceDateStr.split('-').map(Number);
  const reference = new Date(Date.UTC(ry, rm - 1, rd));

  function randomBusinessName() {
    return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  }
  function randomPostCode() {
    return `${pick(POSTCODE_AREAS)} ${randInt(1, 9)}${pick(POSTCODE_SUFFIXES)}`;
  }
  function randomMobile() {
    return rand() < 0.12 ? 'New number' : `07${randInt(100000000, 999999999)}`;
  }
  function randomTime() {
    const hour24 = randInt(9, 18);
    const minute = randInt(0, 59);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
  }
  function randomBoxValue() {
    const rounded = Math.round(randInt(400, 2600) / 10 * 20) / 20; // nearest 0.05, £40-£260
    return Number.isInteger(rounded) ? `£ ${rounded}` : `£ ${rounded.toFixed(2)}`;
  }

  const orders = [];
  let nextId = startId;
  const agents = Object.keys(AGENT_DISPLAY_NAMES);

  for (let offset = daysBack; offset >= 0; offset -= 1) {
    const day = addDaysUTC(reference, -offset);
    const dateStr = formatDateUTC(day);
    if (skipDates.includes(dateStr)) continue;

    const dow = day.getUTCDay(); // 0 Sun .. 6 Sat
    const isWeekend = dow === 0 || dow === 6;
    const orderCount = isWeekend ? randInt(1, 4) : randInt(4, 9);

    for (let i = 0; i < orderCount; i += 1) {
      const agentName = pick(agents);
      const line = pick(SALE_LINES);
      const [status, statusTone] = pick(STATUS_POOL);

      orders.push({
        id: nextId,
        saleType: line.saleType,
        agentName,
        campaign: line.campaign,
        mobileNumber: randomMobile(),
        businessName: randomBusinessName(),
        postCode: randomPostCode(),
        status,
        statusTone,
        boxValue: randomBoxValue(),
        placedDate: dateStr,
        placedTime: randomTime(),
        eligibilityDate: status === 'To Process' && rand() < 0.3 ? '' : dateStr,
      });
      nextId += 1;
    }
  }
  return orders;
}

// 8 weeks of history up to and including "today", skipping the date already
// covered by the hand-authored rows above.
const GENERATED_ORDERS = generateHistoricalOrders('2026-08-04', 56, ['2026-08-03'], 11);

export const INITIAL_ORDERS = [...HAND_AUTHORED_ORDERS, ...GENERATED_ORDERS];

function distinctSorted(field) {
  return [...new Set(INITIAL_ORDERS.map((o) => o[field]))].sort();
}

/** Filter dropdown options, derived from the data so a selection always matches something. */
export const ASSIGNED_USER_OPTIONS = distinctSorted('agentName');
export const SALE_TYPE_FILTER_OPTIONS = distinctSorted('saleType');

/** Authored rather than derived — includes a campaign with no orders yet, same as a real CRM. */
export const CAMPAIGN_OPTIONS = [
  'Three Q3 Consumer Switch',
  'EE Essential Push',
  'O2 Upgrade Drive',
  'Summer Retention Offer',
];
