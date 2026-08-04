import { useMemo } from 'react';
import { INITIAL_ORDERS } from '../orders/ordersListData.js';
import { computeDashboardMetrics } from './dashboardMetrics.js';
import { formatGBP } from './format.js';
import { LeaderboardCard } from './LeaderboardCard.jsx';
import { CURRENT_USER_AGENT, CURRENT_USER_NAME, computeMyOrderStatusBreakdown } from './myDashboardData.js';
import './dashboard.css';

// Same fixed demo date as the main Dashboard, so the leaderboard here matches.
const DEMO_TODAY = '2026-08-04';

export function MyDashboardPage() {
  const statusBreakdown = useMemo(
    () => computeMyOrderStatusBreakdown(INITIAL_ORDERS, CURRENT_USER_AGENT),
    [],
  );
  const { leaderboards } = useMemo(
    () => computeDashboardMetrics(INITIAL_ORDERS, DEMO_TODAY),
    [],
  );

  return (
    <div className="dash-page">
      <div className="dash-page-inner">
        <div>
          <h1 className="dash-page-title">My Dashboard</h1>
          <p className="dash-page-subtitle">Your orders by status, {CURRENT_USER_NAME}.</p>
        </div>

        <section>
          <h2 className="dash-section-title">Leaderboard</h2>
          <div className="lb-grid">
            {leaderboards.map((board) => (
              <LeaderboardCard key={board.id} title={board.title} tone={board.tone} entries={board.entries} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="dash-section-title">My orders by status</h2>
          <div className="mydash-status-grid">
            {statusBreakdown.map((s) => (
              <div className="mydash-status-card" key={s.status}>
                <span className={`mydash-status-chip mydash-status-chip--${s.statusTone}`}>{s.status}</span>
                <div className="mydash-status-metrics">
                  <div className="mydash-metric">
                    <div className="mydash-metric-value">{s.count}</div>
                    <div className="mydash-metric-label">{s.count === 1 ? 'Order' : 'Orders'}</div>
                  </div>
                  <div className="mydash-metric">
                    <div className="mydash-metric-value">{formatGBP(s.boxValueTotal)}</div>
                    <div className="mydash-metric-label">Box value</div>
                  </div>
                </div>
              </div>
            ))}
            {statusBreakdown.length === 0 && <p className="dash-tile-caption">No orders yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
