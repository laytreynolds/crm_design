/**
 * Seed data for the settings list pages. Each settings screen (Order Status,
 * Lead Status, Campaigns, …) manages the same shape of record — a named,
 * color-tagged item used to populate a dropdown elsewhere in the CRM — so
 * one config object keyed by nav id drives one generic SettingsListPage.
 */

const PALETTE = [
  '#3fd6a8',
  '#4d9de0',
  '#a8d92e',
  '#e65c5c',
  '#100f0f',
  '#c9738a',
  '#34c98f',
  '#4aa88b',
  '#02cf8b',
  '#eccd32',
  '#8f6fd6',
  '#e08a3c',
];

const USERS = ['Stuart Box', 'Jamie Dunn', 'Alison Box', 'Layton Reynolds'];

const AGES = [
  '3 days ago',
  '2 weeks ago',
  '1 month ago',
  '5 months ago',
  '7 months ago',
  '9 months ago',
  '10 months ago',
  '1 year ago',
];

function makeItems(names) {
  return names.map((name, i) => ({
    id: i + 1,
    name,
    color: PALETTE[i % PALETTE.length],
    addedBy: USERS[i % USERS.length],
    updatedBy: USERS[(i + 1) % USERS.length],
    createdAt: AGES[i % AGES.length],
    updatedAt: AGES[(i + 2) % AGES.length],
  }));
}

export const SETTINGS_CONFIG = {
  'settings-lead-status': {
    title: 'Lead Status',
    items: makeItems([
      'New',
      'Contacted',
      'Qualified',
      'Unqualified',
      'Nurturing',
      'Converted',
      'Lost',
    ]),
  },
  'settings-client-status': {
    title: 'Client Status',
    items: makeItems(['Account Holder', 'User', 'Authorised User']),
  },
  'settings-order-status': {
    title: 'Order Status',
    items: makeItems([
      'Consumer QC',
      'Awaiting TEKTON Upload',
      'Pending Welcome Call',
      'Declined',
      'Awaiting Contract 10+',
      'Fully Connected',
      'Connected - C2B Submitted',
      'Add to Master',
      'Connected - Awaiting C2B TRANSFER',
      'E-Sim - To Process',
    ]),
  },
  'settings-campaigns': {
    title: 'Campaigns',
    items: makeItems([
      'Three Q3 Consumer Switch',
      'EE Essential Push',
      'O2 Upgrade Drive',
      'Summer Retention Offer',
    ]),
  },
  'settings-business-type': {
    title: 'Business Type',
    items: makeItems(['Individual', 'Sole Trader', 'Partnership', 'Limited Company']),
  },
  'settings-current-network': {
    title: 'Current Network',
    items: makeItems(['EE', 'O2', 'Vodafone', 'Three', 'giffgaff', 'Sky Mobile', 'Tesco Mobile', 'Lebara']),
  },
  'settings-sale-type': {
    title: 'Sale Type',
    items: makeItems([
      'EE Consumer',
      'EE Business',
      'Vodafone Consumer',
      'Vodafone Business',
      'O2 Consumer',
      'O2 Business',
      'Three Consumer',
      'Three Business',
    ]),
  },
  'settings-handset': {
    title: 'Handset',
    items: makeItems([
      'iPhone 15',
      'iPhone 15 Pro',
      'Samsung Galaxy S24',
      'Samsung Galaxy S24 Ultra',
      'Google Pixel 8',
      'SIM Only',
    ]),
  },
  'settings-tariff': {
    title: 'Tariff',
    items: makeItems([
      'Essential Unlimited',
      'Advanced 100GB',
      'Max Unlimited',
      'Basic 5GB',
      'Family Share 50GB',
    ]),
  },
  'settings-lead-source': {
    title: 'Lead Source',
    items: makeItems([
      'Website',
      'Referral',
      'Cold Call',
      'Social Media',
      'Email Campaign',
      'Walk-in',
      'Partner Referral',
      'Trade Show',
    ]),
  },
  'settings-new-network': {
    title: 'New Network',
    items: makeItems(['EE', 'O2', 'Vodafone', 'Three', 'giffgaff', 'Sky Mobile', 'Tesco Mobile', 'Lebara']),
  },
  'settings-bolt-ons-manager': {
    title: 'Bolt Ons Manager',
    items: makeItems([
      'Data Boost 5GB',
      'Data Boost 10GB',
      'International Minutes',
      'EU Roaming',
      'Voicemail Plus',
      'Family Data Share',
    ]),
  },
};
