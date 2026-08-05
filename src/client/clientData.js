/**
 * Seed client. In a live CRM this comes from the clients API; keeping it in
 * one module means the page only ever reads a plain object, same as the
 * order page's `initialOrder`.
 *
 * Deliberately the same person as order/orderData.js's `initialOrder` (same
 * name, DOB, contact details, and billing address) so the "View client" link
 * on the order page and the "Orders" list on this page point at data that
 * agrees with each other — both pages are single hardcoded demo records, the
 * same way OrderPage always opens this one order regardless of which orders
 * list row was clicked.
 */
export const initialClient = {
  status: 'Account Holder',
  assigned: 'Jamie Dunn',
  accountNumber: '3160268',
  personal: {
    title: 'Miss',
    fullName: 'Ellie Stoakley',
    firstName: 'Ellie',
    lastName: 'Stoakley',
    dob: '2001-08-14',
  },
  contact: {
    mobile: '07512469758',
    email: 'elliestoakley1408@icloud.com',
  },
  billingAddress: { line1: '92 Morton Road', line2: '', city: 'Lowestoft', postcode: 'NR33 0J4' },
  shippingAddress: { line1: '92 Morton Road', line2: '', city: 'Lowestoft', postcode: 'NR33 0J4' },
  orders: [
    {
      id: 1,
      saleType: 'EE Consumer',
      status: 'Pending',
      statusTone: 'awaiting',
      boxValue: 245.14,
      placedDate: '30-07-2026',
    },
    {
      id: 2,
      saleType: 'Vodafone Consumer',
      status: 'Completed',
      statusTone: 'completed',
      boxValue: 189.0,
      placedDate: '14-02-2026',
    },
  ],
  // Same two tickets as tickets/ticketsData.js's INITIAL_TICKETS (subject,
  // status, source, updatedAt copied across) so "View" opens a ticket whose
  // content actually matches what's shown here.
  tickets: [
    {
      id: 'TCK-1042',
      subject: 'SIM not activating after port',
      status: 'In Progress',
      statusTone: 'progress',
      source: 'Email',
      updatedAt: '05/08/2026, 09:40',
    },
    {
      id: 'TCK-1030',
      subject: 'Internal: credit check review needed',
      status: 'Open',
      statusTone: 'open',
      source: 'Internal',
      updatedAt: '05/08/2026, 06:40',
    },
  ],
};
