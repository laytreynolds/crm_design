import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatGBP } from './format.js';

const axisTick = { fontSize: 11, fill: 'var(--text-secondary)' };

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={axisTick}
          axisLine={{ stroke: 'var(--border-default)' }}
          tickLine={false}
          interval={2}
        />
        <YAxis yAxisId="left" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `£${v}`}
        />
        <Tooltip
          formatter={(value, name) => (name === 'Box value' ? [formatGBP(value), name] : [value, name])}
          labelFormatter={(label) => `${label}`}
          contentStyle={{
            borderRadius: 10,
            borderColor: 'var(--border-default)',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-body)' }} />
        <Bar yAxisId="left" dataKey="orderCount" name="Orders" fill="var(--green-300)" radius={[3, 3, 0, 0]} barSize={8} />
        <Line
          yAxisId="right"
          dataKey="boxValue"
          name="Box value"
          stroke="var(--state-warning)"
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
