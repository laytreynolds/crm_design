// SHA-256 hash of the site password. Only the hash ships in the bundle —
// this keeps the plaintext out of view-source, but since this is a static
// site with no backend, it's a casual gate, not real access control.
export const PASSWORD_HASH = 'e6f914d01e9e1f6501a71ff32263a802367d15b684e1573a8c532ce8cc13c191';

export const AUTH_STORAGE_KEY = 'crm:auth';
