const GBP = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const GBP_COMPACT = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatGBP(value) {
  return GBP.format(value);
}

export function formatGBPCompact(value) {
  return GBP_COMPACT.format(value);
}

export function formatPercent(value, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

/** Signed whole-percent string for a pctDelta() result, or null if there's no baseline. */
export function formatDelta(delta) {
  if (delta === null || delta === undefined) return null;
  const pct = Math.round(delta * 100);
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}%`;
}
