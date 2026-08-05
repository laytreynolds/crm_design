/**
 * Declarative description of the client form, mirroring order/schema.js so
 * ClientPage can drive its sections off one data-driven list.
 *
 * Field shape:
 *   path        dot-path into the client object (also the React key)
 *   label       visible label, and the noun used in the "… copied" toast
 *   type        'text' (default) | 'date' | 'email' | 'select'
 *   options     key into SELECT_OPTIONS, required when type is 'select'
 *   copy        renders a copy-to-clipboard button beside the control
 */

export const SELECT_OPTIONS = {
  title: [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mx', label: 'Mx' },
    { value: 'Dr', label: 'Dr' },
  ],
};

export const ADDRESS_BLOCKS = [
  { path: 'billingAddress', label: 'Billing address' },
  { path: 'shippingAddress', label: 'Shipping address' },
];

export const ADDRESS_LINES = [
  { key: 'line1', placeholder: 'Address line 1' },
  { key: 'line2', placeholder: 'Address line 2' },
  { key: 'city', placeholder: 'Town / city' },
  { key: 'postcode', placeholder: 'Postcode' },
];

export const SECTIONS = [
  {
    key: 'personal',
    id: 'personal-details',
    nav: 'Personal',
    title: 'Personal details',
    layout: 'grid3',
    fields: [
      { path: 'personal.title', label: 'Title', type: 'select', options: 'title' },
      { path: 'personal.fullName', label: 'Full name', copy: true },
      { path: 'personal.firstName', label: 'First name' },
      { path: 'personal.lastName', label: 'Last name' },
      { path: 'personal.dob', label: 'Date of birth', type: 'date', copy: true },
    ],
  },
  {
    key: 'contact',
    id: 'contact-details',
    nav: 'Contact',
    title: 'Contact details',
    layout: 'grid2',
    fields: [
      { path: 'contact.mobile', label: 'Mobile', copy: true },
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
    key: 'orders',
    id: 'orders',
    nav: 'Orders',
    title: 'Orders',
    render: 'orders',
  },
  {
    key: 'tickets',
    id: 'tickets',
    nav: 'Tickets',
    title: 'Tickets',
    render: 'tickets',
  },
];
