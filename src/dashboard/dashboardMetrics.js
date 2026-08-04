import { AGENT_DISPLAY_NAMES } from '../orders/ordersListData.js';

const MS_PER_DAY = 86400000;

export function parseBoxValue(value) {
  return Number.isFinite(value) ? value : 0;
}

export function isCancelled(order) {
  return order.statusTone === 'cancelled';
}

export function isDeclined(order) {
  return order.statusTone === 'declined';
}

/** A "valid" sale is one that didn't fall out of the pipeline — used for revenue/box-value figures. */
export function isValidSale(order) {
  return !isCancelled(order) && !isDeclined(order);
}

function parseDateUTC(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDateUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysUTC(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function startOfWeekUTC(date) {
  const dow = date.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = dow === 0 ? -6 : 1 - dow; // Monday start
  return addDaysUTC(date, diff);
}

function startOfMonthUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function inRange(dateStr, startInclusive, endExclusive) {
  const t = parseDateUTC(dateStr).getTime();
  return t >= startInclusive.getTime() && t < endExclusive.getTime();
}

function ordersInRange(orders, start, end) {
  return orders.filter((o) => inRange(o.placedDate, start, end));
}

function summarizePeriod(periodOrders) {
  const totalCount = periodOrders.length;
  const cancelledCount = periodOrders.filter(isCancelled).length;
  const validOrders = periodOrders.filter(isValidSale);
  const boxValueTotal = validOrders.reduce((sum, o) => sum + parseBoxValue(o.boxValue), 0);
  return {
    orders: periodOrders,
    totalCount,
    cancelledCount,
    returnRate: totalCount === 0 ? 0 : cancelledCount / totalCount,
    validCount: validOrders.length,
    boxValueTotal,
    avgBoxValue: validOrders.length === 0 ? 0 : boxValueTotal / validOrders.length,
  };
}

/** null means "no prior-period baseline" — renders as a dash rather than a misleading 0%/infinite change. */
export function pctDelta(current, previous) {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

function groupByAgent(periodOrders) {
  const totals = new Map();
  for (const o of periodOrders) {
    const key = o.agentName;
    const entry = totals.get(key) ?? { count: 0, value: 0 };
    entry.count += 1;
    entry.value += parseBoxValue(o.boxValue);
    totals.set(key, entry);
  }
  return [...totals.entries()]
    .map(([agentName, t]) => ({ name: AGENT_DISPLAY_NAMES[agentName] ?? agentName, ...t }))
    .sort((a, b) => b.value - a.value);
}

function groupByCampaign(periodOrders) {
  const totals = new Map();
  for (const o of periodOrders) {
    const entry = totals.get(o.campaign) ?? { count: 0, value: 0 };
    entry.count += 1;
    entry.value += parseBoxValue(o.boxValue);
    totals.set(o.campaign, entry);
  }
  return [...totals.entries()]
    .map(([campaign, t]) => ({ campaign, ...t }))
    .sort((a, b) => b.value - a.value);
}

function groupByStatus(periodOrders) {
  const totals = new Map();
  for (const o of periodOrders) {
    const entry = totals.get(o.status) ?? { status: o.status, statusTone: o.statusTone, count: 0 };
    entry.count += 1;
    totals.set(o.status, entry);
  }
  return [...totals.values()].sort((a, b) => b.count - a.count);
}

/**
 * Everything the dashboard needs, computed once from the flat orders list.
 * referenceDateStr is "today" ('YYYY-MM-DD') — pass explicitly rather than
 * `new Date()` so the demo data (seeded around a fixed date) stays in sync.
 */
export function computeDashboardMetrics(orders, referenceDateStr) {
  const today = parseDateUTC(referenceDateStr);
  const tomorrow = addDaysUTC(today, 1);
  const yesterday = addDaysUTC(today, -1);

  const weekStart = startOfWeekUTC(today);
  const weekEnd = addDaysUTC(weekStart, 7);
  const prevWeekStart = addDaysUTC(weekStart, -7);

  const monthStart = startOfMonthUTC(today);
  const monthEnd = startOfMonthUTC(addDaysUTC(monthStart, 32));
  const prevMonthStart = startOfMonthUTC(addDaysUTC(monthStart, -1));

  const day = summarizePeriod(ordersInRange(orders, today, tomorrow));
  const prevDay = summarizePeriod(ordersInRange(orders, yesterday, today));
  const week = summarizePeriod(ordersInRange(orders, weekStart, weekEnd));
  const prevWeek = summarizePeriod(ordersInRange(orders, prevWeekStart, weekStart));
  const month = summarizePeriod(ordersInRange(orders, monthStart, monthEnd));
  const prevMonth = summarizePeriod(ordersInRange(orders, prevMonthStart, monthStart));

  // 30-day trailing window backs both the daily-order-average KPI and the trend chart.
  const trendStart = addDaysUTC(today, -29);
  const trendOrders = ordersInRange(orders, trendStart, tomorrow);
  const dailyOrderAverage = trendOrders.length / 30;

  const trend = [];
  for (let i = 0; i < 30; i += 1) {
    const d = addDaysUTC(trendStart, i);
    const dStr = formatDateUTC(d);
    const dayOrders = orders.filter((o) => o.placedDate === dStr);
    const validValue = dayOrders.filter(isValidSale).reduce((s, o) => s + parseBoxValue(o.boxValue), 0);
    trend.push({
      date: dStr,
      label: `${d.getUTCDate()}/${d.getUTCMonth() + 1}`,
      orderCount: dayOrders.length,
      boxValue: Math.round(validValue),
    });
  }

  const monthAgentTotals = groupByAgent(month.orders.filter(isValidSale));
  const monthConnections = groupByAgent(
    month.orders.filter((o) => isValidSale(o) && o.saleType.includes('New Connection')),
  );
  const dayAgentTotals = groupByAgent(day.orders.filter(isValidSale));

  const leaderboards = [
    { id: 'daily', title: 'Daily leaderboard', tone: 'success', entries: dayAgentTotals },
    { id: 'monthly', title: 'Monthly leaderboard', tone: 'warning', entries: monthAgentTotals },
    { id: 'connections', title: 'Monthly connections', tone: 'danger', entries: monthConnections },
  ];

  const campaignTotals = groupByCampaign(month.orders.filter(isValidSale));
  const statusBreakdown = groupByStatus(month.orders);

  return {
    referenceDateStr,
    day: { ...day, delta: { count: pctDelta(day.totalCount, prevDay.totalCount), value: pctDelta(day.boxValueTotal, prevDay.boxValueTotal) } },
    week: { ...week, delta: { count: pctDelta(week.totalCount, prevWeek.totalCount), value: pctDelta(week.boxValueTotal, prevWeek.boxValueTotal) } },
    month: { ...month, delta: { count: pctDelta(month.totalCount, prevMonth.totalCount), value: pctDelta(month.boxValueTotal, prevMonth.boxValueTotal), returnRate: pctDelta(month.returnRate, prevMonth.returnRate) } },
    dailyOrderAverage,
    trend,
    leaderboards,
    campaignTotals,
    statusBreakdown,
    topAgent: monthAgentTotals[0] ?? null,
    topCampaign: campaignTotals[0] ?? null,
  };
}
