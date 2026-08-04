/**
 * Seed order. In a live CRM this comes from the orders API; keeping it in one
 * module means the page only ever reads a plain object and the fetch can be
 * dropped in later without touching the form code.
 */
export const initialOrder = {
  status: { date: '06/08' },
  account: {
    customerType: 'Sole Trader',
    fullName: 'Miss Ellie Stoakley',
    accountRef: 'Ellie Stoakley - 3160268 - Pending: 06/08',
    accountNumber: '3160268',
    dob: '2001-08-14',
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
    speed: '5G',
    eligibilityDate: '2026-07-29',
  },
  saleDetails: {
    handsetOld: 'Sim Only',
    tariffOld: 'Consumer Plan EE Essential Unlimited @£19.95 including Vat',
    agentName: 'Jamie Dunn',
    eligibilityDate: '2026-07-29',
    saleType: 'EE Consumer',
    boxValue: '£245.14',
    simCard: 'Yes',
    quoteId: '',
    speedCap: '',
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
    bankName: '',
    bankBranch: '',
    timeWithBank: '',
  },
  fulfilment: {
    newContractEndDate: '',
    connectionDate: '',
    networkAccountNumber: '',
    imeiNumber: '',
    simNumber: '241349865205',
    temporaryNumber: '',
  },
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
