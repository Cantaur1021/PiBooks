"use client";
import { useEffect, useState } from "react";
import { Card, Table, Input, Label, Button } from "../components/ui";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type TB = {
  code: string;
  name: string;
  debit: number;
  credit: number;
  balance: number;
};

export default function Reports() {
  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [tb, setTB] = useState<TB[]>([]);
  const [pl, setPL] = useState<{
    income: number;
    expense: number;
    net: number;
  } | null>(null);

  function headers() {
    return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
  }

  async function load() {
    setTB(
      await (
        await fetch(`${API}/api/reports/trial-balance`, { headers: headers() })
      ).json()
    );
    setPL(
      await (
        await fetch(`${API}/api/reports/pl?start=${start}&end=${end}`, {
          headers: headers(),
        })
      ).json()
    );
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <Label>From</Label>
            <Input value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <Label>To</Label>
            <Input value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={load}>Refresh</Button>
          </div>
          {pl && (
            <div className="col-span-2 text-right self-end text-sm">
              <span className="mr-4">Income: {pl.income.toFixed(2)}</span>
              <span className="mr-4">Expense: {pl.expense.toFixed(2)}</span>
              <span>Net: {pl.net.toFixed(2)}</span>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase text-white/60 mb-2">
          Trial Balance
        </div>
        <Table>
          <thead>
            <tr>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Account</th>
              <th className="p-2 text-right">Debit</th>
              <th className="p-2 text-right">Credit</th>
              <th className="p-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tb.map((r) => (
              <tr key={r.code} className="border-t border-white/10">
                <td className="p-2">{r.code}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2 text-right">{r.debit.toFixed(2)}</td>
                <td className="p-2 text-right">{r.credit.toFixed(2)}</td>
                <td className="p-2 text-right">{r.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
