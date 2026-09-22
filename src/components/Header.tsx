import { useState } from 'react';

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-sm text-slate-500">
        Fictional demo data &middot; NovaTech Solutions &middot; ISO/IEC 27001-inspired assessment
      </div>
      <div className="flex items-center gap-3">
        {confirming ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Reset all demo data?</span>
            <button
              className="btn-danger"
              onClick={() => {
                onReset();
                setConfirming(false);
              }}
            >
              Confirm reset
            </button>
            <button className="btn-secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={() => setConfirming(true)}>
            Reset Demo Data
          </button>
        )}
      </div>
    </header>
  );
}
