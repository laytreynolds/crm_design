import { formatGBP } from '../dashboard/format.js';
import { AGENT_DISPLAY_NAMES, INITIAL_ORDERS } from '../orders/ordersListData.js';

/**
 * Seed order. In a live CRM this comes from the orders API; keeping it in one
 * module means the page only ever reads a plain object and the fetch can be
 * dropped in later without touching the form code. Used as the fallback
 * detail record when an order id can't be matched to a list row.
 */
export const initialOrder = {
  status: { date: '06/08' },
  account: {
    customerType: 'Sole Trader',
    fullName: 'Miss Ellie Stoakley',
    accountRef: 'Ellie Stoakley - 3160268 - Pending: 06/08',
    accountNumber: '3160268',
    dob: '2001-08-14',
    tektonLink: 'https://tekton.example.com/orders/3160268',
  },
  contact: {
    mobile: '07512469758',
    landline: '01493642011',
    email: 'elliestoakley1408@icloud.com',
  },
  billingAddress: { line1: '92 Morton Road', line2: '', city: 'Lowestoft', postcode: 'NR33 0J4' },
  previousAddress: { line1: '', line2: '', city: '', postcode: '' },
  deliveryAddress: { line1: '92 Morton Road', line2: '', city: 'Lowestoft', postcode: 'NR33 0J4' },
  currentPackage: {
    network: 'Plan EE',
    handset: 'iPhone',
    spend: '5G',
    eligibilityDate: '2026-07-29',
  },
  saleDetails: {
    handsetOld: 'Sim Only',
    tariffOld: 'Consumer Plan EE Essential Unlimited @£19.95 including Vat',
    agentName: 'Jamie Dunn',
    eligibilityDate: '2026-07-29',
    saleType: 'EE Consumer',
    leadSource: '',
    boxValue: 245.14,
    simCard: 'Yes',
    quoteId: '',
    spendCap: '',
    contractTerm: '24 Months',
    contractEndTermDate: '',
  },
  additionalSale: {
    cashback: '',
    additionalFunding: '',
    pacCode: '',
    portingMobile: '',
    networkAccountNumber: '',
    businessConsumer: '',
    newNetwork: '',
    connectionDate: '',
    portDate: '',
  },
  handsetSelect: {
    catalogId: '',
    make: '',
    model: '',
    color: '',
    memory: '',
    price: '',
    supplier: '',
  },
  tariffType: {
    catalogId: '',
    code: '',
    price: '',
    minutes: '',
    texts: '',
    data: '9 GB',
    duration: '',
  },
  buyout: '',
  boltOns: '',
  specialRequirement:
    'Consumer Plan Quote ID: 3160268 *** Ellie Stoakley *** Consumer Plan EE New Connection with Porting MPN: 07512469758 *** PAC Code: TXX243029 *** Plan EE SIM: 241349865205 *** Consumer Plan EE Essential Unlimited @£19.95 including Vat *** Handset Required: N/A - SIMO *** Monthly Line Rental: £19.95 inc Vat *** Contract Term: 24 Months *** Buyout: £0.00 *** Spend Cap: Plan Rated Sim @£0.00 *** Box Value: £245.14 *** Bank Details: Miss Ellie Stoakley - Sort Code: 77-68-02 *** Account Number: 300117789 ***',
  bankDetails: {
    accountName: '',
    accountNumber: '',
    sortCode: '',
    directDebitDueDate: '',
    bankName: '',
    bankBranch: '',
    timeWithBank: '',
    recurringCardPayment: false,
    inCreditControl: false,
  },
  fulfilment: {
    newContractEndDate: '',
    connectionDate: '',
    networkAccountNumber: '',
    imeiNumber: '',
    simNumber: '241349865205',
    temporaryNumber: '',
    welcomeEmailSent: false,
    contractDocumentSent: false,
    handsetDispatched: '',
    simDispatched: '',
    handsetReturned: false,
    handsetReturnReceived: false,
    postage: {
      trackingNumber: '',
      labelUrl: '',
      generatedAt: '',
    },
  },
  welcomeCalls: {
    completeOrNotRequired: '',
    customerSpokenTo: false,
    portSet: '',
    spendCapAppliedTekton: false,
    spendCapAppliedV4: false,
    notificationsAppliedVos: false,
    customerPortalSet: false,
    billingExplained: false,
    dailyTraveller: false,
    spendCapDuplicated: false,
    dailyTravellerDuplicated: false,
    thirdPartyGranted: false,
    notificationsSet: false,
    previousBoltOnsApplied: false,
    thirdParty: false,
  },
  creditChecks: [
    {
      id: 1,
      date: '29-07-2026',
      bureau: 'Equifax',
      checkType: 'Standard credit search',
      outcome: 'Pass',
      score: 782,
      reference: 'EQ-88213-A',
    },
    {
      id: 2,
      date: '30-07-2026',
      bureau: 'Experian',
      checkType: 'Affordability check',
      outcome: 'Refer',
      score: 611,
      reference: 'EXP-40217-C',
    },
  ],
  documents: [
    {
      id: 1,
      name: 'Signed_Contract_EllieStoakley.pdf',
      category: 'Contract',
      size: '1.2 MB',
      date: '30-07-2026',
      time: '02:15 PM',
      uploadedBy: 'Alison Box',
      url: '',
    },
    {
      id: 2,
      name: 'ID_Verification_EllieStoakley.jpg',
      category: 'ID Verification',
      size: '840 KB',
      date: '29-07-2026',
      time: '11:03 AM',
      uploadedBy: 'Alison Box',
      url: '',
    },
  ],
  notes: [
    {
      id: 1,
      text: 'CONSUMER PLAN EE CONNECTION PENDING: 06/08/2026',
      date: '30-07-2026',
      time: '01:49 PM',
      author: 'Alison Box',
      status: 'Received',
    },
    {
      id: 2,
      text: 'Plan Welcome Letter & Plan EE Sim Sent Out To Customer: 30/07/2026 - Destination: Ellie Stoakley, 92 Morton Road, Lowestoft, NR33 0J4 - Tracking Reference: DGH42597NG10',
      date: '30-07-2026',
      time: '01:42 PM',
      author: 'Alison Box',
      status: 'Received',
    },
    {
      id: 3,
      text: '06/08',
      date: '29-07-2026',
      time: '07:02 PM',
      author: 'Alison Box',
      status: 'Received',
    },
  ],
};

/** Order owner shown in the action bar. */
export const assignedTo = 'Layton Reynolds';

/**
 * Builds a full order-detail record for a given orders-list row, so every
 * row's "View"/"Edit" opens data that matches that row instead of always
 * showing `initialOrder`. Seeded by the row's id (mulberry32) so the same
 * order always generates the same details across reloads.
 */
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
  const chance = (p) => rand() < p;
  return { pick, randInt, chance };
}

const TITLES = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];
const TITLE_RE = /^(Mr|Mrs|Miss|Ms|Dr|Master)\s/;
const DUPLICATE_SUFFIX_RE = /\s*\(?(\d+ of \d+)\)?\s*$/;

const STREET_NAMES = [
  'Morton Road', 'Kings Avenue', 'Church Lane', 'Victoria Street', 'Mill Road', 'Orchard Close',
  'Station Road', 'High Street', 'Meadow Way', 'Chapel Street', 'Birch Grove', 'Elm Drive',
  'Fenwick Road', 'Harbour View', 'Windsor Close',
];

/** Postcode area -> town, covering the areas used in ordersListData.js. */
const POSTCODE_TOWNS = {
  DN31: 'Grimsby', NR31: 'Great Yarmouth', IP25: 'Watton', GU8: 'Godalming', RM17: 'Grays',
  L35: 'Whiston', SS0: 'Westcliff-on-Sea', PR3: 'Longridge', CM6: 'Great Dunmow',
  BN14: 'Worthing', LE11: 'Loughborough', NG18: 'Mansfield', TS17: 'Ingleby Barwick',
  WF10: 'Castleford', HU9: 'Hull', NR33: 'Lowestoft',
};

const NETWORKS = ['Plan EE', 'Vodafone', 'O2', 'Three', 'Plan Three', 'giffgaff', 'Tesco Mobile'];
const HANDSETS = ['iPhone', 'Samsung Galaxy', 'Sim Only', 'Google Pixel', 'Motorola', 'Nokia'];
const SPENDS = ['3G', '4G', '5G'];
const DATA_ALLOWANCES = ['1 GB', '5 GB', '9 GB', '20 GB', 'Unlimited'];
const EMAIL_DOMAINS = ['icloud.com', 'gmail.com', 'outlook.com', 'yahoo.co.uk', 'hotmail.com'];
const BUREAUS = ['Equifax', 'Experian', 'TransUnion'];
const BUREAU_CODES = { Equifax: 'EQ', Experian: 'EXP', TransUnion: 'TU' };
const CHECK_TYPES = ['Standard credit search', 'Affordability check', 'Identity verification', 'Full credit search'];
const OUTCOME_POOL = [...Array(6).fill('Pass'), ...Array(3).fill('Refer'), ...Array(1).fill('Fail')];
const DOCUMENT_CATEGORIES = ['Contract', 'ID Verification', 'Proof of Address', 'Correspondence'];

function toShortDate(isoDate) {
  const [, m, d] = isoDate.split('-');
  return `${d}/${m}`;
}

function toDDMMYYYY(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
}

function addDaysISO(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function randomTime(rand, { randInt }) {
  const hour24 = randInt(9, 18);
  const minute = randInt(0, 59);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
}

function splitDuplicateSuffix(name) {
  const m = name.match(DUPLICATE_SUFFIX_RE);
  return m ? name.slice(0, m.index).trim() : name;
}

function networkShortName(saleType) {
  return saleType.split(' ')[0];
}

function randomAddress(rand, helpers, postCode) {
  const { pick, randInt } = helpers;
  const area = postCode.split(' ')[0];
  return {
    line1: `${randInt(1, 199)} ${pick(STREET_NAMES)}`,
    line2: '',
    city: POSTCODE_TOWNS[area] ?? 'Unknown',
    postcode: postCode,
  };
}

function buildOrderFromRow(row) {
  const rand = mulberry32(row.id * 2654435761);
  const helpers = makeHelpers(rand);
  const { pick, randInt, chance } = helpers;

  const baseName = splitDuplicateSuffix(row.businessName);
  const hasTitle = TITLE_RE.test(baseName);
  const fullName = hasTitle ? baseName : `${pick(TITLES)} ${baseName}`;
  const nameParts = (hasTitle ? baseName.replace(TITLE_RE, '') : baseName).split(' ');
  const firstName = nameParts[0] ?? 'Customer';
  const lastName = nameParts[nameParts.length - 1] ?? '';

  const accountNumber = String(randInt(1000000, 9999999));
  const dob = `${randInt(1955, 2006)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`;

  const mobile = row.mobileNumber === 'New number' ? `07${randInt(100000000, 999999999)}` : row.mobileNumber;
  const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randInt(1, 99)}@${pick(EMAIL_DOMAINS)}`;

  const billingAddress = randomAddress(rand, helpers, row.postCode);
  const deliveryAddress = chance(0.85) ? { ...billingAddress } : randomAddress(rand, helpers, row.postCode);
  const previousAddress = chance(0.4)
    ? randomAddress(rand, helpers, row.postCode)
    : { line1: '', line2: '', city: '', postcode: '' };

  const network = networkShortName(row.saleType);
  const eligibilityDate = row.eligibilityDate || addDaysISO(row.placedDate, -randInt(1, 14));
  const oldPrice = (randInt(1495, 3995) / 100).toFixed(2);

  const agentName = AGENT_DISPLAY_NAMES[row.agentName] ?? row.agentName;

  const simNumber = Array.from({ length: 19 }, () => randInt(0, 9)).join('');
  const pacCode = chance(0.5) ? `T${randInt(100, 999)}${pick(['A', 'B', 'C', 'X'])}${randInt(100, 999)}` : '';

  const creditCheckCount = randInt(0, 3);
  const creditChecks = Array.from({ length: creditCheckCount }, (_, i) => {
    const bureau = pick(BUREAUS);
    const outcome = pick(OUTCOME_POOL);
    return {
      id: i + 1,
      date: toDDMMYYYY(addDaysISO(row.placedDate, -randInt(1, 10))),
      bureau,
      checkType: pick(CHECK_TYPES),
      outcome,
      score: randInt(300, 999),
      reference: `${BUREAU_CODES[bureau]}-${randInt(10000, 99999)}-${pick(['A', 'B', 'C'])}`,
    };
  });

  const noteAuthor = agentName;
  const noteTemplates = [
    `${row.saleType.toUpperCase()} CONNECTION PENDING: ${toShortDate(row.placedDate)}/2026`,
    `Welcome letter & SIM sent out to customer: ${toDDMMYYYY(row.placedDate)} - Destination: ${fullName}, ${billingAddress.line1}, ${billingAddress.city}, ${billingAddress.postcode} - Tracking Reference: ${pick(['DGH', 'PLM', 'NX', 'RTQ'])}${randInt(10000, 99999)}NG${randInt(1, 99)}`,
    `Customer called to confirm details, status now ${row.status}.`,
    `Left voicemail regarding ${row.saleType} order, awaiting callback.`,
  ];
  const noteCount = randInt(1, 3);
  const notes = Array.from({ length: noteCount }, (_, i) => ({
    id: i + 1,
    text: pick(noteTemplates),
    date: toDDMMYYYY(addDaysISO(row.placedDate, -randInt(0, 5))),
    time: randomTime(rand, helpers),
    author: noteAuthor,
    status: 'Received',
  }));

  const docCount = randInt(1, 3);
  const documents = Array.from({ length: docCount }, (_, i) => {
    const category = pick(DOCUMENT_CATEGORIES);
    const ext = category === 'Contract' ? 'pdf' : pick(['pdf', 'jpg', 'png']);
    return {
      id: i + 1,
      name: `${category.replace(/\s+/g, '_')}_${lastName || 'Customer'}.${ext}`,
      category,
      size: `${randInt(80, 1800)} KB`,
      date: toDDMMYYYY(addDaysISO(row.placedDate, -randInt(0, 7))),
      time: randomTime(rand, helpers),
      uploadedBy: agentName,
      url: '',
    };
  });

  return {
    status: { date: toShortDate(row.placedDate) },
    account: {
      customerType: 'Sole Trader',
      fullName,
      accountRef: `${fullName} - ${accountNumber} - Pending: ${toShortDate(row.placedDate)}`,
      accountNumber,
      dob,
      tektonLink: row.tektonLink,
    },
    contact: {
      mobile,
      landline: `01${randInt(200, 999)}${randInt(100000, 999999)}`,
      email,
    },
    billingAddress,
    previousAddress,
    deliveryAddress,
    currentPackage: {
      network: pick(NETWORKS),
      handset: pick(HANDSETS),
      spend: pick(SPENDS),
      eligibilityDate,
    },
    saleDetails: {
      handsetOld: pick(HANDSETS),
      tariffOld: `Consumer Plan ${network} Essential Unlimited @£${oldPrice} including Vat`,
      agentName,
      eligibilityDate,
      saleType: row.saleType,
      leadSource: chance(0.5) ? '' : pick(['Switcheroo', 'Website']),
      boxValue: row.boxValue,
      simCard: chance(0.85) ? 'Yes' : 'No',
      quoteId: chance(0.3) ? String(randInt(100000, 999999)) : '',
      spendCap: '',
      contractTerm: pick(['12 Months', '24 Months', '36 Months']),
      contractEndTermDate: '',
    },
    additionalSale: {
      cashback: '',
      additionalFunding: '',
      pacCode,
      portingMobile: mobile,
      networkAccountNumber: chance(0.5) ? String(randInt(100000000, 999999999)) : '',
      businessConsumer: 'Consumer',
      newNetwork: network,
      connectionDate: '',
      portDate: '',
    },
    handsetSelect: {
      catalogId: '',
      make: '',
      model: '',
      color: '',
      memory: '',
      price: '',
      supplier: '',
    },
    tariffType: {
      catalogId: '',
      code: '',
      price: '',
      minutes: '',
      texts: '',
      data: pick(DATA_ALLOWANCES),
      duration: '',
    },
    buyout: 0,
    boltOns: '',
    specialRequirement:
      `Consumer Plan Quote ID: ${accountNumber} *** ${fullName} *** Consumer Plan ${network} New Connection with Porting MPN: ${mobile} *** PAC Code: ${pacCode || 'N/A'} *** ${network} SIM: ${simNumber} *** ${network} Essential Unlimited @£${oldPrice} including Vat *** Handset Required: N/A - SIMO *** Monthly Line Rental: £${oldPrice} inc Vat *** Buyout: ${formatGBP(0)} *** Box Value: ${formatGBP(row.boxValue)} ***`,
    bankDetails: {
      accountName: '',
      accountNumber: '',
      sortCode: '',
      directDebitDueDate: '',
      bankName: '',
      bankBranch: '',
      timeWithBank: '',
      recurringCardPayment: chance(0.1),
      inCreditControl: chance(0.1),
    },
    fulfilment: {
      newContractEndDate: '',
      connectionDate: '',
      networkAccountNumber: '',
      imeiNumber: '',
      simNumber,
      temporaryNumber: '',
      welcomeEmailSent: chance(0.5),
      contractDocumentSent: chance(0.4),
      handsetDispatched: '',
      simDispatched: '',
      handsetReturned: false,
      handsetReturnReceived: false,
      postage: {
        trackingNumber: '',
        labelUrl: '',
        generatedAt: '',
      },
    },
    welcomeCalls: {
      completeOrNotRequired: '',
      customerSpokenTo: false,
      portSet: '',
      spendCapAppliedTekton: false,
      spendCapAppliedV4: false,
      notificationsAppliedVos: false,
      customerPortalSet: false,
      billingExplained: false,
      dailyTraveller: false,
      spendCapDuplicated: false,
      dailyTravellerDuplicated: false,
      thirdPartyGranted: false,
      notificationsSet: false,
      previousBoltOnsApplied: false,
      thirdParty: false,
    },
    creditChecks,
    notes,
    documents,
  };
}

/**
 * Looks up an orders-list row by id and generates its full order-detail
 * record. Falls back to `initialOrder` when the id doesn't match a known
 * row (e.g. a stale draft or an id minted client-side that isn't in the
 * seed list).
 */
export function getOrderDetail(id) {
  const row = INITIAL_ORDERS.find((o) => o.id === id);
  return row ? buildOrderFromRow(row) : initialOrder;
}
