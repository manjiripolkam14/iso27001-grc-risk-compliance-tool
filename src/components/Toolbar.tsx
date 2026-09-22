import { ReactNode } from 'react';

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder?: string;
  children?: ReactNode; // filters
  action?: ReactNode; // primary button
}

export default function Toolbar({ search, onSearchChange, placeholder, children, action }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <input
        className="input max-w-xs"
        placeholder={placeholder ?? 'Search...'}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {children}
      <div className="ml-auto">{action}</div>
    </div>
  );
}
