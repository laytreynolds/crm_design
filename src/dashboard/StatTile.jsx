import { Icon } from '../ds/index.js';
import { formatDelta } from './format.js';

/**
 * KPI tile. `delta` is a pctDelta() fraction (or null for "no baseline").
 * `invertDelta` flips good/bad coloring for metrics where a rise is bad
 * (e.g. return rate) rather than good.
 */
export function StatTile({ icon, label, value, caption, delta, invertDelta = false }) {
  const deltaText = formatDelta(delta);
  let deltaTone = 'neutral';
  let deltaIcon = 'trending_flat';
  if (deltaText && delta !== 0) {
    const isRise = delta > 0;
    deltaTone = isRise !== invertDelta ? 'good' : 'bad';
    deltaIcon = isRise ? 'trending_up' : 'trending_down';
  }

  return (
    <div className="dash-tile">
      <div className="dash-tile-head">
        {icon && <Icon name={icon} size={16} className="dash-tile-icon" />}
        <span className="dash-tile-label">{label}</span>
      </div>
      <div className="dash-tile-value">{value}</div>
      <div className="dash-tile-foot">
        {caption && <span className="dash-tile-caption">{caption}</span>}
        {deltaText && (
          <span className={`dash-tile-delta dash-tile-delta--${deltaTone}`}>
            <Icon name={deltaIcon} size={14} />
            {deltaText}
          </span>
        )}
      </div>
    </div>
  );
}
