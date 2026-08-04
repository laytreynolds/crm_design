import { useMemo } from 'react';
import { Icon } from '../ds/index.js';
import { INITIAL_ORDERS } from '../orders/ordersListData.js';
import { computeDashboardMetrics } from './dashboardMetrics.js';
import { formatGBP, formatPercent } from './format.js';
import { StatTile } from './StatTile.jsx';
import { TrendChart } from './TrendChart.jsx';
import { StatusBreakdownChart } from './StatusBreakdownChart.jsx';
import { LeaderboardCard } from './LeaderboardCard.jsx';
import './dashboard.css';

// The seed data is anchored to a fixed demo date rather than the real clock,
// same as the rest of the orders/leaderboard mock data.
const DEMO_TODAY = '2026-08-04';

export function DashboardPage() {
  const metrics = useMemo(() => computeDashboardMetrics(INITIAL_ORDERS, DEMO_TODAY), []);
  const { day, week, month, dailyOrderAverage, trend, leaderboards, statusBreakdown, topAgent, topCampaign } = metrics;

  return (
    <div className="dash-page">
      <div className="dash-page-inner">
        <div>
          <h1 className="dash-page-title">Dashboard</h1>
          <p className="dash-page-subtitle">Sales performance across today, this week and this month.</p>
        </div>

        <section>
          <h2 className="dash-group-title">Orders</h2>
          <div className="dash-tile-grid">
            <StatTile icon="today" label="Orders today" value={day.totalCount} caption={`${day.validCount} valid`} delta={day.delta.count} />
            <StatTile icon="date_range" label="Orders this week" value={week.totalCount} caption={`${week.validCount} valid`} delta={week.delta.count} />
            <StatTile icon="calendar_month" label="Orders this month" value={month.totalCount} caption={`${month.validCount} valid`} delta={month.delta.count} />
            <StatTile icon="show_chart" label="Daily order average" value={dailyOrderAverage.toFixed(1)} caption="orders/day, last 30 days" />
            <StatTile
              icon="undo"
              label="Return rate (this month)"
              value={formatPercent(month.returnRate, 1)}
              caption={`${month.cancelledCount} cancelled`}
              delta={month.delta.returnRate}
              invertDelta
            />
          </div>
        </section>

        <section>
          <h2 className="dash-group-title">Box value</h2>
          <div className="dash-tile-grid">
            <StatTile icon="payments" label="Box value today" value={formatGBP(day.boxValueTotal)} delta={day.delta.value} />
            <StatTile icon="payments" label="Box value this week" value={formatGBP(week.boxValueTotal)} delta={week.delta.value} />
            <StatTile icon="payments" label="Box value this month" value={formatGBP(month.boxValueTotal)} delta={month.delta.value} />
            <StatTile icon="request_quote" label="Average box value" value={formatGBP(month.avgBoxValue)} caption="this month, valid sales" />
          </div>
        </section>

        <section className="dash-highlight-row">
          <div className="cds-card dash-highlight-card">
            <Icon name="workspace_premium" size={22} className="dash-highlight-icon" />
            <div>
              <div className="dash-highlight-label">Top agent this month</div>
              <div className="dash-highlight-value">{topAgent ? topAgent.name : '—'}</div>
              {topAgent && (
                <div className="dash-highlight-sub">
                  {topAgent.count} sales · {formatGBP(topAgent.value)}
                </div>
              )}
            </div>
          </div>
          <div className="cds-card dash-highlight-card">
            <Icon name="campaign" size={22} className="dash-highlight-icon" />
            <div>
              <div className="dash-highlight-label">Top campaign this month</div>
              <div className="dash-highlight-value">{topCampaign ? topCampaign.campaign : '—'}</div>
              {topCampaign && (
                <div className="dash-highlight-sub">
                  {topCampaign.count} sales · {formatGBP(topCampaign.value)}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="dash-chart-row">
          <div className="cds-card dash-chart-card">
            <h2 className="dash-card-title">Orders &amp; box value — last 30 days</h2>
            <TrendChart data={trend} />
          </div>
          <div className="cds-card dash-chart-card">
            <h2 className="dash-card-title">Orders by status — this month</h2>
            <StatusBreakdownChart data={statusBreakdown} />
          </div>
        </section>

        <section>
          <h2 className="dash-section-title">Leaderboard</h2>
          <div className="lb-grid">
            {leaderboards.map((board) => (
              <LeaderboardCard key={board.id} title={board.title} tone={board.tone} entries={board.entries} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
