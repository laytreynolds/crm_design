import { LEADERBOARDS } from './leaderboardData.js';
import { LeaderboardCard } from './LeaderboardCard.jsx';
import './leaderboard.css';

export function LeaderboardPage() {
  return (
    <div className="lb-page">
      <div className="lb-page-inner">
        <div>
          <h1 className="lb-page-title">Leaderboard</h1>
          <p className="lb-page-subtitle">Ranked by connections sold and box value.</p>
        </div>

        <div className="lb-grid">
          {LEADERBOARDS.map((board) => (
            <LeaderboardCard
              key={board.id}
              title={board.title}
              tone={board.tone}
              entries={board.entries}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
