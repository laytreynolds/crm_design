import { Icon } from '../ds/index.js';
import { formatGBP } from './format.js';

function boardTotal(entries) {
  return entries.reduce(
    (acc, e) => ({ count: acc.count + e.count, value: acc.value + e.value }),
    { count: 0, value: 0 },
  );
}

export function LeaderboardCard({ title, tone, entries }) {
  const total = boardTotal(entries);

  return (
    <div className="lb-card">
      <div className={`lb-header lb-header--${tone}`}>{title}</div>

      {entries.length === 0 ? (
        <p className="lb-empty">No activity yet.</p>
      ) : (
        <div className="lb-rows">
          {entries.map((entry, i) => {
            const rank = i + 1;
            return (
              <div className="lb-row" key={`${entry.name}-${rank}`}>
                <div className="lb-rank-name">
                  {rank === 1 && <Icon name="emoji_events" size={18} className="lb-trophy" />}
                  <span className="lb-rank-num">{rank}.</span>
                  <span className="lb-name">{entry.name}</span>
                </div>
                <span className="lb-count">{entry.count}</span>
                <span className="lb-value">{formatGBP(entry.value)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="lb-total">
        <span className="lb-total-label">Total</span>
        <span className="lb-total-count">{total.count}</span>
        <span className="lb-value">{formatGBP(total.value)}</span>
      </div>
    </div>
  );
}
