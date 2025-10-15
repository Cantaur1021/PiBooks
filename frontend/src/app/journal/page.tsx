"use client";
import { useState } from "react";
import { Button, Card, Input, Label, Table } from "../components/ui";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Line = { account_id: number; debit: number; credit: number };

export default function Journal() {
  const [jdate, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [ref, setRef] = useState("");
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { account_id: 1200, debit: 100, credit: 0 },
    { account_id: 4000, debit: 0, credit: 95 },
    { account_id: 2100, debit: 0, credit: 5 },
  ]);
  const token = localStorage.getItem("token") || "";

  function headers() {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  function addLine() {
    setLines([...lines, { account_id: 1000, debit: 0, credit: 0 }]);
  }
  function update(i: number, k: keyof Line, v: string | number) {
    const c = [...lines];
    c[i][k] = typeof v === "string" ? (Number.isNaN(+v) ? 0 : +v) : v;
    setLines(c);
  }
  async function save() {
    const res = await fetch(`${API}/api/entries`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ jdate, ref, memo, lines }),
    });
    if (res.ok) {
      alert("Posted");
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label>Date</Label>
            <Input value={jdate} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Ref</Label>
            <Input value={ref} onChange={(e) => setRef(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Memo</Label>
            <Input value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
        </div>
      </Card>
      <Card>
        <Table>
          <thead>
            <tr>
              <th className="text-left p-2">Account</th>
              <th className="text-right p-2">Debit</th>
              <th className="text-right p-2">Credit</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="p-2">
                  <Input
                    value={l.account_id}
                    onChange={(e) => update(i, "account_id", e.target.value)}
                  />
                </td>
                <td className="p-2 text-right">
                  <Input
                    value={l.debit}
                    onChange={(e) => update(i, "debit", e.target.value)}
                  />
                </td>
                <td className="p-2 text-right">
                  <Input
                    value={l.credit}
                    onChange={(e) => update(i, "credit", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-3 flex justify-between">
          <Button onClick={addLine}>Add line</Button>
          <Button onClick={save}>Post entry</Button>
        </div>
      </Card>
    </div>
  );
}
