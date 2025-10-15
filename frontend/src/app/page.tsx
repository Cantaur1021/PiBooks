"use client";
import { useEffect, useState } from "react";
import { KPI } from "./components/cards";
import { IncomeExpenseChart, RevenueBar } from "./components/charts";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Dashboard() {
  const [pl, setPL] = useState<{
    income: number;
    expense: number;
    net: number;
  } | null>(null);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1)
      .toISOString()
      .slice(0, 10);
    const end = today.toISOString().slice(0, 10);
    fetch(`${API}/api/reports/pl?start=${start}&end=${end}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((r) => r.json())
      .then(setPL)
      .catch(() => {});
  }, []);

  const income = pl?.income ?? 0,
    expense = pl?.expense ?? 0,
    net = pl?.net ?? 0;

  const lineData = [
    { m: "Jan", income: 0, expense: 0 },
    { m: "Feb", income: income * 0.2, expense: expense * 0.2 },
    { m: "Mar", income: income * 0.35, expense: expense * 0.35 },
    { m: "Apr", income: income * 0.5, expense: expense * 0.5 },
    { m: "May", income: income * 0.65, expense: expense * 0.65 },
    { m: "Jun", income: income * 0.8, expense: expense * 0.8 },
  ];
  const barData = [
    { name: "Q1", value: income * 0.3 },
    { name: "Q2", value: income * 0.7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <KPI title="Income (YTD)" value={income.toFixed(2)} />
        <KPI title="Expense (YTD)" value={expense.toFixed(2)} />
        <KPI
          title="Net (YTD)"
          value={net.toFixed(2)}
          hint={net >= 0 ? "On track" : "Watch spending"}
        />
      </div>
      <IncomeExpenseChart data={lineData} />
      <RevenueBar data={barData} />
    </div>
  );
}
