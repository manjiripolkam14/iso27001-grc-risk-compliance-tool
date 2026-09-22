interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'default' | 'red' | 'orange' | 'amber' | 'green' | 'blue';
  hint?: string;
}

const accentClasses: Record<string, string> = {
  default: 'text-slate-900',
  red: 'text-red-600',
  orange: 'text-orange-600',
  amber: 'text-amber-600',
  green: 'text-emerald-600',
  blue: 'text-blue-600',
};

export default function StatCard({ label, value, accent = 'default', hint }: StatCardProps) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1.5 ${accentClasses[accent]}`}>{value}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
