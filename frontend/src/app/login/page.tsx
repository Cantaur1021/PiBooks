"use client";
import { useState } from "react";
import { Button, Card, Input, Label } from "../components/ui";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = new URLSearchParams({ username: email, password });
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      setErr("Invalid credentials");
      return;
    }
    const json = await res.json();
    localStorage.setItem("token", json.access_token);
    window.location.href = "/";
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <Card>
        <form className="space-y-3 p-2" onSubmit={submit}>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <Button className="w-full">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
