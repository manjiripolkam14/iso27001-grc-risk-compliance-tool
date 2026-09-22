import React from 'react';

const toneClasses: Record<string, string> = {
  slate: 'bg-slate-100 text-slate-600',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
};

function Badge({ text, tone }: { text: string; tone: keyof typeof toneClasses }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${toneClasses[tone]}`}>
      {text}
    </span>
  );
}

export function RiskLevelBadge({ level }: { level: string }) {
  const toneMap: Record<string, keyof typeof toneClasses> = {
    Low: 'green',
    Medium: 'amber',
    High: 'orange',
    Critical: 'red',
  };
  return <Badge text={level} tone={toneMap[level] ?? 'slate'} />;
}

export function ControlStatusBadge({ status }: { status: string }) {
  const toneMap: Record<string, keyof typeof toneClasses> = {
    Implemented: 'green',
    'Partially Implemented': 'amber',
    'Not Implemented': 'red',
    'Not Applicable': 'slate',
  };
  return <Badge text={status} tone={toneMap[status] ?? 'slate'} />;
}

export function GenericStatusBadge({ status }: { status: string }) {
  const toneMap: Record<string, keyof typeof toneClasses> = {
    Open: 'red',
    'In Progress': 'amber',
    Resolved: 'green',
    Completed: 'green',
    Closed: 'green',
    Accepted: 'blue',
    Overdue: 'red',
    Active: 'green',
    Retired: 'slate',
    'Under Review': 'purple',
  };
  return <Badge text={status} tone={toneMap[status] ?? 'slate'} />;
}

export function CriticalityBadge({ level }: { level: string }) {
  return <RiskLevelBadge level={level} />;
}

export function SeverityBadge({ severity }: { severity: string }) {
  return <RiskLevelBadge level={severity} />;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <RiskLevelBadge level={priority} />;
}

export function OverdueBadge() {
  return <Badge text="Overdue" tone="red" />;
}

export default React.memo(Badge);
