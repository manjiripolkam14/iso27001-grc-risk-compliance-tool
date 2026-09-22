import { useMemo, useState } from 'react';
import { GrcPageProps, nextId } from '../utils/storage';
import {
  calcResidualRiskScore,
  calcRiskLevel,
  controlEffectiveness,
  riskWithScore,
} from '../utils/calculations';
import { ControlStatusBadge, RiskLevelBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

export default function RiskControlMapping({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [riskId, setRiskId] = useState('');
  const [controlId, setControlId] = useState('');

  const scoredRisks = useMemo(() => {
    const map: Record<string, ReturnType<typeof riskWithScore>> = {};
    data.risks.forEach((r) => { map[r.id] = riskWithScore(r); });
    return map;
  }, [data.risks]);

  const rows = useMemo(() => {
    return data.mappings.map((m) => {
      const risk = scoredRisks[m.riskId];
      const control = data.controls.find((c) => c.id === m.controlId);
      if (!risk || !control) return null;
      const effectiveness = controlEffectiveness(control.status);
      const residualScore = calcResidualRiskScore(risk.score, effectiveness);
      const residualLevel = calcRiskLevel(residualScore);
      return { mapping: m, risk, control, residualScore, residualLevel, effectiveness };
    }).filter((r): r is NonNullable<typeof r> => r !== null);
  }, [data.mappings, data.controls, scoredRisks]);

  const filtered = rows.filter((r) =>
    !search ||
    r.risk.title.toLowerCase().includes(search.toLowerCase()) ||
    r.control.name.toLowerCase().includes(search.toLowerCase()) ||
    r.risk.id.toLowerCase().includes(search.toLowerCase()) ||
    r.control.id.toLowerCase().includes(search.toLowerCase())
  );

  function addMapping() {
    if (!riskId || !controlId) return;
    const exists = data.mappings.some((m) => m.riskId === riskId && m.controlId === controlId);
    if (exists) {
      setModalOpen(false);
      return;
    }
    const id = nextId('M', data.mappings.map((m) => m.id));
    setData((prev) => ({ ...prev, mappings: [...prev.mappings, { id, riskId, controlId }] }));
    logActivity(`Mapped ${riskId} to control ${controlId}`);
    setModalOpen(false);
    setRiskId('');
    setControlId('');
  }

  function removeMapping(id: string) {
    setData((prev) => ({ ...prev, mappings: prev.mappings.filter((m) => m.id !== id) }));
    logActivity(`Removed mapping ${id}`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Risk-Control Mapping</h1>
        <p className="page-subtitle">Associates risks with the controls that mitigate them, and estimates residual risk.</p>
      </div>

      <div className="card p-4 mb-5 text-sm text-slate-600 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">Residual Risk Formula (project-defined, not an official ISO methodology)</p>
        <p>
          Residual Risk Score = Original Risk Score &minus; (Original Risk Score &times; Control Effectiveness).
          Control effectiveness is a simplified assumption: Implemented = 50% reduction,
          Partially Implemented = 25% reduction, Not Implemented / Not Applicable = 0% reduction.
          The score is rounded up, with a minimum of 1.
        </p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by risk or control..."
        action={
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            + Add Mapping
          </button>
        }
      />

      <div className="card overflow-x-auto">
        <table className="grc-table">
          <thead>
            <tr>
              <th>Risk</th>
              <th>Control</th>
              <th>Control Status</th>
              <th>Original Risk</th>
              <th>Residual Risk</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ mapping, risk, control, residualScore, residualLevel }) => (
              <tr key={mapping.id}>
                <td>
                  <span className="font-medium text-slate-700">{risk.id}</span>
                  <span className="text-slate-500"> - {risk.title}</span>
                </td>
                <td>
                  <span className="font-medium text-slate-700">{control.id}</span>
                  <span className="text-slate-500"> - {control.name}</span>
                </td>
                <td><ControlStatusBadge status={control.status} /></td>
                <td>
                  <span className="font-semibold mr-1.5">{risk.score}</span>
                  <RiskLevelBadge level={risk.level} />
                </td>
                <td>
                  <span className="font-semibold mr-1.5">{residualScore}</span>
                  <RiskLevelBadge level={residualLevel} />
                </td>
                <td>
                  <button className="text-xs text-red-500 hover:underline" onClick={() => removeMapping(mapping.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-8">No mappings match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title="Add Risk-Control Mapping" onClose={() => setModalOpen(false)}>
          <div className="space-y-3">
            <div>
              <label className="label">Risk</label>
              <select className="input" value={riskId} onChange={(e) => setRiskId(e.target.value)}>
                <option value="">Select risk...</option>
                {data.risks.map((r) => <option key={r.id} value={r.id}>{r.id} - {r.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Control</label>
              <select className="input" value={controlId} onChange={(e) => setControlId(e.target.value)}>
                <option value="">Select control...</option>
                {data.controls.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={addMapping}>Add Mapping</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
