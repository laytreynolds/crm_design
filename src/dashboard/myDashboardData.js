import { AGENT_DISPLAY_NAMES } from '../orders/ordersListData.js';
import { parseBoxValue } from './dashboardMetrics.js';

/**
 * Auth is a single shared site password (see auth/authConfig.js) with no
 * per-user accounts yet, so there's no real "logged in user" to key off.
 * Stand in with a fixed agent until real user accounts exist.
 */
export const CURRENT_USER_AGENT = 'JamieEvans';
export const CURRENT_USER_NAME = AGENT_DISPLAY_NAMES[CURRENT_USER_AGENT];

/** Per-status order count + box value total, for one agent's orders. */
export function computeMyOrderStatusBreakdown(orders, agentName) {
  const totals = new Map();
  for (const o of orders) {
    if (o.agentName !== agentName) continue;
    const entry = totals.get(o.status) ?? { status: o.status, statusTone: o.statusTone, count: 0, boxValueTotal: 0 };
    entry.count += 1;
    entry.boxValueTotal += parseBoxValue(o.boxValue);
    totals.set(o.status, entry);
  }
  return [...totals.values()].sort((a, b) => b.count - a.count);
}
