"use client";
import { useEffect, useState } from "react";
import { Button, Card, Input, Label, Table } from "../components/ui";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Account = { id: number; code: string; name: string; type: string };

export default function Accounts() {
  const [rows, setRows] = useState<Account[]>([]);
  const [form, setForm] = useState({ code: "", name: "", type: "asset" });

  function headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      "Content-Type": "application/json",
    };
  }

  useEffect(() => {
    fetch(`${API}/api/accounts`, { headers: headers() })
      .then((r) => r.json())
      .then(setRows)
      .catch(() => {});
  }, []);

  async function add() {
    const res = await fetch(`${API}/api/accounts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setRows([...rows, await res.json()]);
      setForm({ code: "", name: "", type: "asset" });
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Label>Code</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Type</Label>
            <Input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={add}>Add Account</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <thead>
            <tr>
              <th className="text-left p-2">Code</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">{r.code}</td>
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
