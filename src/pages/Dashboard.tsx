import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GrcPageProps } from '../utils/storage';
import { calcCompliancePercent, riskWithScore } from '../utils/calculations';
import StatCard from '../components/StatCard';

const RISK_COLORS: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

const CONTROL_COLORS: Record<string, string> = {
  Implemented: '#10b981',
  'Partially Implemented': '#f59e0b',
  'Not Implemented': '#ef4444',
  'Not Applicable': '#94a3b8',
};

export default function Dashboard({ data }: GrcPageProps) {
  const scoredRisks = useMemo(() => data.risks.map(riskWithScore), [data.risks]);

  const riskCounts = useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    scoredRisks.forEach((r) => {
      counts[r.level] = (counts[r.level] ?? 0) + 1;
    });
    return counts;
  }, [scoredRisks]);

  const controlCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Implemented: 0,
      'Partially Implemented': 0,
      'Not Implemented': 0,
      'Not Applicable': 0,
    };
    data.controls.forEach((c) => {
      counts[c.status] = (counts[c.status] ?? 0) + 1;
    });
    return counts;
  }, [data.controls]);

  const openGaps = data.gaps.filter((g) => g.status === 'Open' || g.status === 'In Progress').length;
  const compliancePercent = useMemo(() => calcCompliancePercent(data.controls), [data.controls]);

  const riskChartData = Object.entries(riskCounts).map(([level, count]) => ({ level, count }));
  const controlChartData = Object.entries(controlCounts).map(([status, count]) => ({ status, count }));
  const complianceChartData = [
    { name: 'Compliant credit', value: compliancePercent },
    { name: 'Remaining', value: 100 - compliancePercent },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">GRC Dashboard</h1>
        <p className="page-subtitle">
          NovaTech Solutions &middot; fictional demo organization &middot; ISO/IEC 27001-inspired risk & compliance overview
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Assets" value={data.assets.length} />
        <StatCard label="Total Risks" value={data.risks.length} />
        <StatCard label="Critical Risks" value={riskCounts.Critical} accent="red" />
        <StatCard label="High Risks" value={riskCounts.High} accent="orange" />
        <StatCard label="Open Compliance Gaps" value={openGaps} accent="amber" />
        <StatCard
          label="Implemented Controls"
          value={controlCounts.Implemented}
          accent="green"
        />
        <StatCard
          label="Partially Implemented Controls"
          value={controlCounts['Partially Implemented']}
          accent="amber"
        />
        <StatCard
          label="Overall Compliance %"
          value={`${compliancePercent}%`}
          accent="blue"
          hint="Project-level compliance metric"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Risk Severity Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f5" />
              <XAxis dataKey="level" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {riskChartData.map((entry) => (
                  <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Control Implementation Status</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={controlChartData}
                dataKey="count"
                nameKey="status"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {controlChartData.map((entry) => (
                  <Cell key={entry.status} fill={CONTROL_COLORS[entry.status]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Compliance Status</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={complianceChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#2dd4bf" />
                <Cell fill="#e2e8f0" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-semibold text-navy-800 -mt-[130px] pointer-events-none">
            {compliancePercent}%
          </p>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Recent Activity</p>
        <ul className="space-y-2">
          {data.activityLog.length === 0 && (
            <li className="text-sm text-slate-400">No activity recorded yet.</li>
          )}
          {data.activityLog.slice(0, 8).map((entry) => (
            <li key={entry.id} className="text-sm text-slate-600 flex justify-between border-b border-slate-100 last:border-0 pb-2 last:pb-0">
              <span>{entry.message}</span>
              <span className="text-slate-400 text-xs whitespace-nowrap ml-3">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
