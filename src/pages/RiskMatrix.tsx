import { useMemo, useState } from 'react';
import { GrcPageProps } from '../utils/storage';
import { calcRiskLevel, riskWithScore } from '../utils/calculations';
import { RiskLevelBadge, GenericStatusBadge } from '../components/Badges';
import Modal from '../components/Modal';

const LEVEL_BG: Record<string, string> = {
  Low: 'bg-emerald-100 hover:bg-emerald-200',
  Medium: 'bg-amber-100 hover:bg-amber-200',
  High: 'bg-orange-100 hover:bg-orange-200',
  Critical: 'bg-red-100 hover:bg-red-200',
};

export default function RiskMatrix({ data }: GrcPageProps) {
  const scoredRisks = useMemo(() => data.risks.map(riskWithScore), [data.risks]);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const grid = useMemo(() => {
    // rows = impact (5 at top down to 1), cols = likelihood (1 to 5)
    const cells: Record<string, typeof scoredRisks> = {};
    for (let impact = 1; impact <= 5; impact++) {
      for (let likelihood = 1; likelihood <= 5; likelihood++) {
        cells[`${likelihood}-${impact}`] = [];
      }
    }
    scoredRisks.forEach((r) => {
      const key = `${r.likelihood}-${r.impact}`;
      if (cells[key]) cells[key].push(r);
    });
    return cells;
  }, [scoredRisks]);

  const selectedRisk = scoredRisks.find((r) => r.id === selectedRiskId);
  const assetName = (id: string) => data.assets.find((a) => a.id === id)?.name ?? id;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Risk Matrix</h1>
        <p className="page-subtitle">5&times;5 likelihood &times; impact matrix. Click a risk chip to view details.</p>
      </div>

      <div className="card p-5 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex">
            <div className="w-28" />
            <div className="flex-1 text-center text-xs font-medium text-slate-500 mb-2">Likelihood &rarr;</div>
          </div>
          <div className="flex">
            <div className="w-28 flex flex-col-reverse">
              {[1, 2, 3, 4, 5].map((impact) => (
                <div key={impact} className="flex-1 flex items-center justify-end pr-2 text-xs text-slate-500" style={{ minHeight: 88 }}>
                  {impact === 3 && <span className="-rotate-90 origin-center whitespace-nowrap mr-2">Impact &uarr;</span>}
                  Impact {impact}
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-5 gap-1.5">
              {[5, 4, 3, 2, 1].map((impact) =>
                [1, 2, 3, 4, 5].map((likelihood) => {
                  const score = likelihood * impact;
                  const level = calcRiskLevel(score);
                  const cellRisks = grid[`${likelihood}-${impact}`] ?? [];
                  return (
                    <div
                      key={`${likelihood}-${impact}`}
                      className={`rounded-md p-2 border border-white/60 ${LEVEL_BG[level]}`}
                      style={{ minHeight: 88 }}
                    >
                      <div className="text-[10px] font-medium text-slate-500 mb-1">Score {score}</div>
                      <div className="flex flex-wrap gap-1">
                        {cellRisks.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setSelectedRiskId(r.id)}
                            className="text-[10px] font-medium bg-white/80 hover:bg-white rounded px-1.5 py-0.5 border border-slate-300"
                            title={r.title}
                          >
                            {r.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex mt-2">
            <div className="w-28" />
            <div className="flex-1 grid grid-cols-5 gap-1.5 text-center text-xs text-slate-500">
              {[1, 2, 3, 4, 5].map((l) => <div key={l}>Likelihood {l}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 inline-block" /> Low (1-4)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 inline-block" /> Medium (5-9)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 inline-block" /> High (10-16)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 inline-block" /> Critical (17-25)</span>
      </div>

      {selectedRisk && (
        <Modal title={`${selectedRisk.id} - ${selectedRisk.title}`} onClose={() => setSelectedRiskId(null)}>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">{selectedRisk.description}</p>
            <div className="grid grid-cols-2 gap-y-1.5 pt-2">
              <span className="text-slate-500">Asset</span><span>{assetName(selectedRisk.assetId)}</span>
              <span className="text-slate-500">Threat</span><span>{selectedRisk.threat}</span>
              <span className="text-slate-500">Vulnerability</span><span>{selectedRisk.vulnerability}</span>
              <span className="text-slate-500">Likelihood</span><span>{selectedRisk.likelihood}</span>
              <span className="text-slate-500">Impact</span><span>{selectedRisk.impact}</span>
              <span className="text-slate-500">Score</span><span className="font-semibold">{selectedRisk.score}</span>
              <span className="text-slate-500">Level</span><span><RiskLevelBadge level={selectedRisk.level} /></span>
              <span className="text-slate-500">Treatment</span><span>{selectedRisk.treatment}</span>
              <span className="text-slate-500">Status</span><span><GenericStatusBadge status={selectedRisk.status} /></span>
              <span className="text-slate-500">Owner</span><span>{selectedRisk.owner}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
