"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export function IncomeExpenseChart({
  data,
}: {
  data: { m: string; income: number; expense: number }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <div className="text-xs uppercase text-white/60 mb-2">
        Income vs Expense
      </div>
      <LineChart width={920} height={280} data={data}>
        <CartesianGrid strokeOpacity={0.2} />
        <XAxis dataKey="m" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#fff"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#bbb"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export function RevenueBar({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <div className="text-xs uppercase text-white/60 mb-2">Revenue</div>
      <BarChart width={920} height={240} data={data}>
        <CartesianGrid strokeOpacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#fff" />
      </BarChart>
    </div>
  );
}
