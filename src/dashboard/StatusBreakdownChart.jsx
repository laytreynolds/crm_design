import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mirrors the `.ol-status--*` chip colors in orders-list.css so a status reads the same everywhere.
const TONE_COLOR = {
  awaiting: 'var(--ink-900)',
  declined: '#d9584f',
  process: '#f0a530',
  stock: '#a3ad2f',
  cancelled: '#8a3a34',
};

export function StatusBreakdownChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--border-subtle)" horizontal={false} />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="status"
          width={150}
          tick={{ fontSize: 12, fill: 'var(--text-primary)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            borderColor: 'var(--border-default)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={TONE_COLOR[entry.statusTone] ?? 'var(--green-500)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
