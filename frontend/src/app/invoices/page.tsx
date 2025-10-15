"use client";
import { useState } from "react";
import { Button, Card, Input, Label, Table } from "../components/ui";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type InvLine = {
  account_id: number;
  description: string;
  qty: number;
  unit_price: number;
  tax_id: number | null;
};
export default function Invoices() {
  const [number, setNumber] = useState("INV-1001");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [due, setDue] = useState(() =>
    new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)
  );
  const [contact, setContact] = useState(1);
  const [lines, setLines] = useState<InvLine[]>([
    {
      account_id: 4000,
      description: "Service",
      qty: 1,
      unit_price: 100,
      tax_id: 1,
    },
  ]);

  function headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      "Content-Type": "application/json",
    };
  }
  function addLine() {
    setLines([
      ...lines,
      { account_id: 4000, description: "", qty: 1, unit_price: 0, tax_id: 1 },
    ]);
  }
  function update(i: number, k: keyof InvLine, v: string | number | null) {
    const c = [...lines];
    c[i] = {
      ...c[i],
      [k]:
        k === "tax_id"
          ? v === ""
            ? null
            : Number(v)
          : k === "qty" || k === "unit_price" || k === "account_id"
          ? Number(v)
          : v,
    };
    setLines(c);
  }
  async function save() {
    const body = {
      contact_id: contact,
      number,
      date,
      due_date: due,
      currency: "AED",
      lines,
    };
    const res = await fetch(`${API}/api/invoices`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (res.ok) alert("Invoice saved and posted");
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <Label>No.</Label>
            <Input value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Due</Label>
            <Input value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div>
            <Label>Contact ID</Label>
            <Input
              value={contact}
              onChange={(e) => setContact(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={save}>Approve & Post</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <thead>
            <tr>
              <th className="p-2 text-left">Account</th>
              <th className="p-2 text-left">Desc</th>
              <th className="p-2 text-right">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Tax</th>
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
                <td className="p-2">
                  <Input
                    value={l.description}
                    onChange={(e) => update(i, "description", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={l.qty}
                    onChange={(e) => update(i, "qty", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={l.unit_price}
                    onChange={(e) => update(i, "unit_price", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={l.tax_id ?? ""}
                    onChange={(e) => update(i, "tax_id", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-3">
          <Button onClick={addLine}>Add line</Button>
        </div>
      </Card>
    </div>
  );
}
