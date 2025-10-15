import { Card } from "./ui";

export function KPI({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase text-white/60">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-white/40 mt-1">{hint}</div>}
    </Card>
  );
}
