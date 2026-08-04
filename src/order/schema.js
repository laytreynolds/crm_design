/**
 * Declarative description of the order form. Every section in `SECTIONS` is
 * rendered by the same code path in OrderPage, so adding a field is a one-line
 * change here rather than more JSX.
 *
 * Field shape:
 *   path        dot-path into the order object (also the React key)
 *   label       visible label, and the noun used in the "… copied" toast
 *   type        'text' (default) | 'date' | 'email' | 'number' | 'select' | 'checkbox'
 *   options     key into SELECT_OPTIONS, required when type is 'select'
 *   step        HTML input step, e.g. '0.01' for money fields typed 'number'
 *   hint        helper text under the control
 *   placeholder placeholder text
 *   copy        renders a copy-to-clipboard button beside the control
 */

const SELECT_PLACEHOLDER = { value: '', label: 'Select…' };

export const SELECT_OPTIONS = {
  customerType: [
    SELECT_PLACEHOLDER,
    { value: 'Individual', label: 'Individual' },
    { value: 'Sole Trader', label: 'Sole Trader' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Limited Company', label: 'Limited Company' },
    { value: 'Consumer', label: 'Consumer' },
  ],
  simCard: [
    SELECT_PLACEHOLDER,
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ],
  contractTerm: [
    SELECT_PLACEHOLDER,
    { value: 'No Contract', label: 'No Contract' },
    { value: '1 Month', label: '1 Month' },
    { value: '12 Months', label: '12 Months' },
    { value: '24 Months', label: '24 Months' },
    { value: '36 Months', label: '36 Months' },
  ],
  // Placeholder-led: these start empty on a new order, so the select needs an
  // option matching '' or the control renders with no selection at all.
  businessConsumer: [
    SELECT_PLACEHOLDER,
    { value: 'Business', label: 'Business' },
    { value: 'Consumer', label: 'Consumer' },
  ],
  timeWithBank: [
    SELECT_PLACEHOLDER,
    { value: 'Less than 1 year', label: 'Less than 1 year' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5+ years', label: '5+ years' },
  ],
  timeAtAddress: [
    SELECT_PLACEHOLDER,
    { value: 'Less than 1 year', label: 'Less than 1 year' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5+ years', label: '5+ years' },
  ],
  saleType: [
    SELECT_PLACEHOLDER,
    { value: 'EE Consumer', label: 'EE Consumer' },
    { value: 'O2 Consumer', label: 'O2 Consumer' },
    { value: 'Vodafone New Connection', label: 'Vodafone New Connection' },
    { value: 'Three Consumer', label: 'Three Consumer' },
    { value: 'Device Only', label: 'Device Only' },
    { value: 'Exchange - EE to EE Early Upgrade', label: 'Exchange - EE to EE Early Upgrade' },
    {
      value: 'Exchange - Orange/T-Mobile to EE Early Migration',
      label: 'Exchange - Orange/T-Mobile to EE Early Migration',
    },
    { value: 'Vodafone Upgrade', label: 'Vodafone Upgrade' },
    { value: 'Exchange - EE to EE Upgrade', label: 'Exchange - EE to EE Upgrade' },
    {
      value: 'Exchange - Orange/T-Mobile to EE Migration',
      label: 'Exchange - Orange/T-Mobile to EE Migration',
    },
    { value: 'O2 to Plan', label: 'O2 to Plan' },
    { value: 'Orange/T-Mobile to EE Early Migration', label: 'Orange/T-Mobile to EE Early Migration' },
    { value: 'Orange/T-Mobile to EE Migration', label: 'Orange/T-Mobile to EE Migration' },
    { value: 'Hosted', label: 'Hosted' },
    { value: 'Three New Connection', label: 'Three New Connection' },
    { value: 'Plan Upgrade', label: 'Plan Upgrade' },
    { value: 'Plan New Connection', label: 'Plan New Connection' },
    { value: 'O2 Upgrade', label: 'O2 Upgrade' },
    { value: 'O2 New Connection (SIM Only)', label: 'O2 New Connection (SIM Only)' },
    { value: 'O2 New Connection', label: 'O2 New Connection' },
    { value: 'EE to EE Upgrade', label: 'EE to EE Upgrade' },
    { value: 'EE to EE Early Upgrade', label: 'EE to EE Early Upgrade' },
    { value: 'EE New Connection', label: 'EE New Connection' },
    { value: 'EE Consumer to Business Migration', label: 'EE Consumer to Business Migration' },
  ],
  yesNa: [
    SELECT_PLACEHOLDER,
    { value: 'Yes', label: 'Yes' },
    { value: 'N/A', label: 'N/A' },
  ],
  leadSource: [
    SELECT_PLACEHOLDER,
    { value: 'Switcheroo', label: 'Switcheroo' },
    { value: 'Website', label: 'Website' },
  ],
};

/** Previous address is only relevant when the applicant hasn't been at their
 * current address long enough to establish an address history. */
export function isLessThanThreeYears(timeAtAddress) {
  return timeAtAddress === 'Less than 1 year' || timeAtAddress === '1-3 years';
}

export const ADDRESS_BLOCKS = [
  { path: 'billingAddress', label: 'Billing address' },
  { path: 'previousAddress', label: 'Previous address' },
  { path: 'deliveryAddress', label: 'Delivery address' },
];

export const ADDRESS_LINES = [
  { key: 'line1', placeholder: 'Address line 1' },
  { key: 'line2', placeholder: 'Address line 2' },
  { key: 'city', placeholder: 'Town / city' },
  { key: 'postcode', placeholder: 'Postcode' },
];

// Fields shown under the handset/tariff catalog dropdowns. Picking a
// dropdown entry fills these in; they stay editable for one-off tweaks.
export const HANDSET_FIELDS = [
  { path: 'handsetSelect.make', label: 'Make' },
  { path: 'handsetSelect.model', label: 'Model' },
  { path: 'handsetSelect.color', label: 'Color' },
  { path: 'handsetSelect.memory', label: 'Memory' },
  { path: 'handsetSelect.price', label: 'Price', type: 'number', step: '0.01' },
  { path: 'handsetSelect.supplier', label: 'Supplier' },
];

export const TARIFF_FIELDS = [
  { path: 'tariffType.code', label: 'Code' },
  { path: 'tariffType.price', label: 'Price', type: 'number', step: '0.01' },
  { path: 'tariffType.minutes', label: 'Minutes' },
  { path: 'tariffType.texts', label: 'Texts' },
  { path: 'tariffType.data', label: 'Data' },
  { path: 'tariffType.duration', label: 'Duration' },
];

export const OTHER_SALE_FIELDS = [
  { path: 'buyout', label: 'Buyout', type: 'number', step: '0.01' },
  { path: 'boltOns', label: 'Bolt ons', type: 'number', step: '0.01' },
];

// Reused as both the field data for the "Finance" section and, via the
// bank-details fields, the standalone "Bank details" section above — kept
// in one place so the two don't drift.
export const FINANCE_GROUPS = [
  {
    subhead: 'Bank details',
    layout: 'grid2',
    fields: [
      { path: 'bankDetails.accountName', label: 'Account name', placeholder: 'e.g. J Smith' },
      {
        path: 'bankDetails.accountNumber',
        label: 'Account number',
        placeholder: 'e.g. 12345678',
      },
      { path: 'bankDetails.sortCode', label: 'Sort code', placeholder: 'e.g. 12-34-56' },
      {
        path: 'bankDetails.directDebitDueDate',
        label: 'Direct debit due date',
        type: 'date',
      },
    ],
  },
  {
    subhead: 'Payment status',
    layout: 'grid2',
    fields: [
      {
        path: 'bankDetails.recurringCardPayment',
        label: 'Recurring card payment',
        type: 'checkbox',
      },
      {
        path: 'bankDetails.inCreditControl',
        label: 'In credit control',
        type: 'checkbox',
      },
    ],
  },
];

// Welcome call fields, grouped by the sale type they apply to. Each order
// only ever matches one group (see getWelcomeCallGroupKey), so field paths
// can safely be reused across groups that ask the same underlying question.
export const WELCOME_CALL_GROUPS = {
  threeC2b: {
    title: 'Three New Connection C2B',
    fields: [
      {
        path: 'welcomeCalls.completeOrNotRequired',
        label: 'Complete / not required',
        type: 'select',
        options: 'yesNa',
      },
      { path: 'welcomeCalls.customerSpokenTo', label: 'Customer spoken to', type: 'checkbox' },
      { path: 'welcomeCalls.portSet', label: 'Port set', type: 'select', options: 'yesNa' },
    ],
  },
  o2EeConsumer: {
    title: 'O2 and EE Consumer',
    fields: [
      {
        path: 'welcomeCalls.spendCapAppliedTekton',
        label: 'Spend cap applied Tekton',
        type: 'checkbox',
      },
      { path: 'welcomeCalls.spendCapAppliedV4', label: 'Spend cap applied V4', type: 'checkbox' },
      {
        path: 'welcomeCalls.notificationsAppliedVos',
        label: 'Notifications applied VOS',
        type: 'checkbox',
      },
      { path: 'welcomeCalls.customerPortalSet', label: 'Customer portal set', type: 'checkbox' },
      { path: 'welcomeCalls.billingExplained', label: 'Billing explained', type: 'checkbox' },
      { path: 'welcomeCalls.dailyTraveller', label: 'Daily traveller', type: 'checkbox' },
    ],
  },
  planUpgrade: {
    title: 'Plan Upgrade',
    fields: [
      { path: 'welcomeCalls.spendCapDuplicated', label: 'Spend cap duplicated', type: 'checkbox' },
      { path: 'welcomeCalls.dailyTravellerDuplicated', label: 'Daily Traveller Duplicated', type: 'checkbox' },
      { path: 'welcomeCalls.thirdPartyGranted', label: 'Third party granted', type: 'checkbox' },
      { path: 'welcomeCalls.notificationsSet', label: 'Notifications set', type: 'checkbox' },
      {
        path: 'welcomeCalls.previousBoltOnsApplied',
        label: 'Previous bolt-ons applied',
        type: 'checkbox',
      },
    ],
  },
  planNewConnection: {
    title: 'Plan New Connection',
    fields: [
      { path: 'welcomeCalls.thirdParty', label: 'Third party', type: 'checkbox' },
      {
        path: 'welcomeCalls.spendCapAppliedTekton',
        label: 'Spend cap applied Tekton',
        type: 'checkbox',
      },
      { path: 'welcomeCalls.spendCapAppliedV4', label: 'Spend cap applied V4', type: 'checkbox' },
      {
        path: 'welcomeCalls.notificationsAppliedVos',
        label: 'Notifications applied VOS',
        type: 'checkbox',
      },
      { path: 'welcomeCalls.customerPortalSet', label: 'Customer portal set', type: 'checkbox' },
      { path: 'welcomeCalls.billingExplained', label: 'Billing explained', type: 'checkbox' },
      { path: 'welcomeCalls.dailyTraveller', label: 'Daily traveller', type: 'checkbox' },
    ],
  },
};

// Sale types not listed here don't require a welcome call, so the tab is
// hidden entirely for them.
const WELCOME_CALL_SALE_TYPES = {
  'Three New Connection': 'threeC2b',
  'O2 Consumer': 'o2EeConsumer',
  'EE Consumer': 'o2EeConsumer',
  'Plan Upgrade': 'planUpgrade',
  'Plan New Connection': 'planNewConnection',
};

export function getWelcomeCallGroupKey(saleType) {
  return WELCOME_CALL_SALE_TYPES[saleType] ?? null;
}

// Outcome -> Badge tone for the credit check history table.
export const CREDIT_CHECK_OUTCOME_TONE = {
  Pass: 'success',
  Refer: 'warning',
  Fail: 'danger',
};

export const SECTIONS = [
  {
    key: 'accountInfo',
    id: 'account-info',
    nav: 'Account',
    title: 'Account information',
    layout: 'grid3',
    fields: [
      {
        path: 'account.customerType',
        label: 'Customer type',
        type: 'select',
        options: 'customerType',
        copy: true,
      },
      { path: 'account.fullName', label: 'Full name', copy: true },
      { path: 'account.dob', label: 'Date of birth', type: 'date', copy: true },
      {
        path: 'account.accountRef',
        label: 'Business name / account reference',
        copy: true,
      },
      { path: 'account.accountNumber', label: 'Account number', copy: true },
    ],
  },
  {
    key: 'contactInfo',
    id: 'contact-info',
    nav: 'Contact',
    title: 'Contact information',
    layout: 'grid3',
    fields: [
      { path: 'contact.mobile', label: 'Mobile number', copy: true },
      { path: 'contact.landline', label: 'Landline number', copy: true },
      { path: 'contact.email', label: 'Email address', type: 'email', copy: true },
    ],
  },
  {
    key: 'addresses',
    id: 'addresses',
    nav: 'Addresses',
    title: 'Addresses',
    render: 'addresses',
  },
  {
    key: 'currentPackage',
    id: 'current-package',
    nav: 'Current package',
    title: 'Current phone package',
    layout: 'grid3',
    fields: [
      { path: 'currentPackage.network', label: 'Current network' },
      { path: 'currentPackage.handset', label: 'Current handset' },
      { path: 'currentPackage.spend', label: 'Current spend' },
      { path: 'currentPackage.eligibilityDate', label: 'Eligibility date', type: 'date' },
    ],
  },
  {
    key: 'saleDetails',
    id: 'sale-details',
    nav: 'Sale details',
    title: 'Sale details',
    layout: 'grid3',
    fields: [
      { path: 'saleDetails.agentName', label: 'Agent name' },
      { path: 'saleDetails.eligibilityDate', label: 'Eligibility date', type: 'date' },
      { path: 'saleDetails.saleType', label: 'Sale type', type: 'select', options: 'saleType' },
      {
        path: 'saleDetails.leadSource',
        label: 'Lead source',
        type: 'select',
        options: 'leadSource',
      },
      { path: 'saleDetails.boxValue', label: 'Box value', type: 'number', step: '0.01' },
      { path: 'saleDetails.simCard', label: 'Sim card', type: 'select', options: 'simCard' },
      { path: 'saleDetails.quoteId', label: 'Quote ID' },
      { path: 'saleDetails.spendCap', label: 'Spend cap', type: 'number', step: '0.01' },
      {
        path: 'saleDetails.contractTerm',
        label: 'Contract term',
        type: 'select',
        options: 'contractTerm',
      },
      { path: 'saleDetails.contractEndTermDate', label: 'Contract end term date', type: 'date' },
    ],
  },
  {
    key: 'additionalSale',
    id: 'additional-sale',
    nav: 'Additional sale',
    title: 'Additional sale details',
    layout: 'grid3',
    fields: [
      { path: 'additionalSale.cashback', label: 'Cashback', type: 'number', step: '0.01' },
      {
        path: 'additionalSale.additionalFunding',
        label: 'Additional funding',
        type: 'number',
        step: '0.01',
      },
      { path: 'additionalSale.pacCode', label: 'PAC code' },
      { path: 'additionalSale.portingMobile', label: 'Porting mobile' },
      { path: 'additionalSale.networkAccountNumber', label: 'Network account number' },
      {
        path: 'additionalSale.businessConsumer',
        label: 'Business / consumer',
        type: 'select',
        options: 'businessConsumer',
      },
      { path: 'additionalSale.newNetwork', label: 'New network' },
      { path: 'additionalSale.connectionDate', label: 'Connection date', type: 'date' },
      { path: 'additionalSale.portDate', label: 'Port date', type: 'date' },
    ],
  },
  {
    key: 'handsetTariff',
    id: 'handset-tariff',
    nav: 'Handset & tariff',
    title: 'Handset & tariff selection',
    render: 'handsetTariff',
  },
  {
    key: 'specialRequirement',
    id: 'special-requirement',
    nav: 'Special requirement',
    title: 'Special requirement',
    render: 'specialRequirement',
  },
  {
    key: 'bankDetails',
    id: 'bank-details',
    nav: 'Bank details',
    title: 'Bank details',
    layout: 'grid2',
    fields: [
      { path: 'bankDetails.accountName', label: 'Account name', placeholder: 'e.g. J Smith' },
      { path: 'bankDetails.accountNumber', label: 'Account number', placeholder: 'e.g. 12345678' },
      { path: 'bankDetails.sortCode', label: 'Sort code', placeholder: 'e.g. 12-34-56' },
      {
        path: 'bankDetails.directDebitDueDate',
        label: 'Direct debit due date',
        type: 'date',
      },
      { path: 'bankDetails.bankName', label: 'Bank name', placeholder: 'e.g. HSBC Bank' },
      { path: 'bankDetails.bankBranch', label: 'Bank branch' },
      {
        path: 'bankDetails.timeWithBank',
        label: 'Time with bank',
        type: 'select',
        options: 'timeWithBank',
      },
    ],
  },
  {
    key: 'finance',
    id: 'finance',
    nav: 'Finance',
    title: 'Finance',
    render: 'finance',
    groups: FINANCE_GROUPS,
  },
  {
    key: 'fulfilment',
    id: 'fulfilment',
    nav: 'Fulfilment',
    title: 'Fulfilment',
    layout: 'grid2',
    fields: [
      { path: 'fulfilment.newContractEndDate', label: 'New contract end date', type: 'date' },
      { path: 'fulfilment.connectionDate', label: 'Connection date', type: 'date' },
      { path: 'fulfilment.networkAccountNumber', label: 'Network account number' },
      { path: 'fulfilment.imeiNumber', label: 'IMEI number' },
      { path: 'fulfilment.simNumber', label: 'SIM number' },
      { path: 'fulfilment.temporaryNumber', label: 'Temporary number' },
      {
        path: 'fulfilment.handsetDispatched',
        label: 'Handset dispatched',
        type: 'select',
        options: 'yesNa',
      },
      {
        path: 'fulfilment.simDispatched',
        label: 'SIM dispatched',
        type: 'select',
        options: 'yesNa',
      },
      { path: 'fulfilment.welcomeEmailSent', label: 'Welcome email sent', type: 'checkbox' },
      {
        path: 'fulfilment.contractDocumentSent',
        label: 'Contract document sent',
        type: 'checkbox',
      },
      { path: 'fulfilment.handsetReturned', label: 'Handset returned', type: 'checkbox' },
      {
        path: 'fulfilment.handsetReturnReceived',
        label: 'Handset return received',
        type: 'checkbox',
      },
    ],
  },
  {
    key: 'welcomeCalls',
    id: 'welcome-calls',
    nav: 'Welcome calls',
    title: 'Welcome calls',
    render: 'welcomeCalls',
  },
  {
    key: 'notes',
    id: 'notes',
    nav: 'Notes',
    title: 'Notes',
    render: 'notes',
  },
];
