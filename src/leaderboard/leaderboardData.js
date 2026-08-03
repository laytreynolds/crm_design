/**
 * Seed leaderboards. In a live CRM these come from a sales-performance API;
 * kept here as plain data so LeaderboardPage only ever reads a list of boards.
 */
export const LEADERBOARDS = [
  {
    id: 'daily',
    title: 'Daily leaderboard',
    tone: 'success',
    entries: [
      { name: 'Luca Nothnagel Di Giovanni', count: 3, value: 614.3 },
      { name: 'Tess Montero', count: 2, value: 490.32 },
      { name: 'Marco Adaggio', count: 2, value: 405.48 },
      { name: 'Jamie Evans', count: 2, value: 279.35 },
      { name: 'Luke Jennings', count: 2, value: 278.06 },
      { name: 'Mike Powell', count: 2, value: 210.2 },
      { name: 'Amir Iqbal', count: 1, value: 128.65 },
    ],
  },
  {
    id: 'monthly',
    title: 'Monthly leaderboard',
    tone: 'warning',
    entries: [
      { name: 'Luke Jennings', count: 2, value: 362.96 },
      { name: 'Amir Iqbal', count: 2, value: 278.06 },
      { name: 'Mike Powell', count: 2, value: 210.2 },
      { name: 'Luca Nothnagel Di Giovanni', count: 1, value: 203.5 },
      { name: 'Marco Adaggio', count: 1, value: 181.48 },
    ],
  },
  {
    id: 'connections',
    title: 'Monthly connections',
    tone: 'danger',
    entries: [
      { name: 'Neil Evans', count: 16, value: 3778.62 },
      { name: 'Mike Powell', count: 10, value: 1344.72 },
      { name: 'Luke Jennings', count: 3, value: 842.0 },
      { name: 'Amir Iqbal', count: 3, value: 579.96 },
      { name: 'Luca Nothnagel Di Giovanni', count: 2, value: 430.0 },
      { name: 'Marco Adaggio', count: 1, value: 210.0 },
    ],
  },
];

/** Sum of each board's own entries — kept derived so seed edits can't drift from the footer. */
export function boardTotal(entries) {
  return entries.reduce(
    (acc, e) => ({ count: acc.count + e.count, value: acc.value + e.value }),
    { count: 0, value: 0 },
  );
}
