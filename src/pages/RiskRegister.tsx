import { useMemo, useState } from 'react';
import { Risk, RiskStatus, RiskTreatment } from '../types';
import { GrcPageProps, nextId } from '../utils/storage';
import { calcRiskLevel, calcRiskScore, riskWithScore } from '../utils/calculations';
import { RiskLevelBadge, GenericStatusBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

const TREATMENTS: RiskTreatment[] = ['Mitigate', 'Accept', 'Transfer', 'Avoid'];
const STATUSES: RiskStatus[] = ['Open', 'In Progress', 'Accepted', 'Closed'];
const LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const emptyForm: Omit<Risk, 'id'> = {
  title: '',
  description: '',
  assetId: '',
  threat: '',
  vulnerability: '',
  likelihood: 3,
  impact: 3,
  owner: '',
  treatment: 'Mitigate',
  status: 'Open',
};

export default function RiskRegister({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const scoredRisks = useMemo(() => data.risks.map(riskWithScore), [data.risks]);

  const filtered = useMemo(() => {
    return scoredRisks.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter === 'All' || r.level === levelFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [scoredRisks, search, levelFilter, statusFilter]);

  function assetName(assetId: string) {
    return data.assets.find((a) => a.id === assetId)?.name ?? assetId;
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(risk: Risk) {
    setEditingId(risk.id);
    const { id, ...rest } = risk;
    setForm(rest);
    setModalOpen(true);
  }

  function saveRisk() {
    if (!form.title.trim() || !form.assetId) return;
    if (editingId) {
      setData((prev) => ({
        ...prev,
        risks: prev.risks.map((r) => (r.id === editingId ? { ...r, ...form } : r)),
      }));
      logActivity(`Updated risk ${editingId}: ${form.title}`);
    } else {
      const id = nextId('R', data.risks.map((r) => r.id));
      setData((prev) => ({ ...prev, risks: [...prev.risks, { id, ...form }] }));
      logActivity(`Added new risk ${id}: ${form.title}`);
    }
    setModalOpen(false);
  }

  function deleteRisk(id: string) {
    setData((prev) => ({
      ...prev,
      risks: prev.risks.filter((r) => r.id !== id),
      mappings: prev.mappings.filter((m) => m.riskId !== id),
    }));
    logActivity(`Deleted risk ${id}`);
    setConfirmDeleteId(null);
  }

  const previewScore = calcRiskScore(form.likelihood, form.impact);
  const previewLevel = calcRiskLevel(previewScore);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Risk Register</h1>
        <p className="page-subtitle">Risk Score = Likelihood &times; Impact. Risk Level and score calculate automatically.</p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by risk title or ID..."
        action={
          <button className="btn-primary" onClick={openAddModal}>
            + Add Risk
          </button>
        }
      >
        <select className="input w-auto" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="All">All Levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Toolbar>

      <div className="card overflow-x-auto">
        <table className="grc-table">
          <thead>
            <tr>
              <th>Risk ID</th>
              <th>Title</th>
              <th>Asset</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Score</th>
              <th>Level</th>
              <th>Treatment</th>
              <th>Status</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((risk) => (
              <tr key={risk.id}>
                <td className="font-medium text-slate-700">{risk.id}</td>
                <td className="max-w-xs">{risk.title}</td>
                <td>{assetName(risk.assetId)}</td>
                <td>{risk.likelihood}</td>
                <td>{risk.impact}</td>
                <td className="font-semibold">{risk.score}</td>
                <td><RiskLevelBadge level={risk.level} /></td>
                <td>{risk.treatment}</td>
                <td><GenericStatusBadge status={risk.status} /></td>
                <td>{risk.owner}</td>
                <td className="whitespace-nowrap">
                  <button className="text-xs text-navy-700 hover:underline mr-3" onClick={() => openEditModal(risk)}>
                    Edit
                  </button>
                  {confirmDeleteId === risk.id ? (
                    <span className="text-xs">
                      <button className="text-red-600 hover:underline mr-2" onClick={() => deleteRisk(risk.id)}>
                        Confirm
                      </button>
                      <button className="text-slate-500 hover:underline" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button className="text-xs text-red-500 hover:underline" onClick={() => setConfirmDeleteId(risk.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center text-slate-400 py-8">No risks match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? `Edit Risk ${editingId}` : 'Add Risk'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-3">
            <div>
              <label className="label">Risk Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Asset</label>
                <select className="input" value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
                  <option value="">Select asset...</option>
                  {data.assets.map((a) => <option key={a.id} value={a.id}>{a.id} - {a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Owner</label>
                <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
              </div>
              <div>
                <label className="label">Threat</label>
                <input className="input" value={form.threat} onChange={(e) => setForm({ ...form, threat: e.target.value })} />
              </div>
              <div>
                <label className="label">Vulnerability</label>
                <input className="input" value={form.vulnerability} onChange={(e) => setForm({ ...form, vulnerability: e.target.value })} />
              </div>
              <div>
                <label className="label">Likelihood (1-5)</label>
                <input type="number" min={1} max={5} className="input" value={form.likelihood} onChange={(e) => setForm({ ...form, likelihood: Math.min(5, Math.max(1, Number(e.target.value))) })} />
              </div>
              <div>
                <label className="label">Impact (1-5)</label>
                <input type="number" min={1} max={5} className="input" value={form.impact} onChange={(e) => setForm({ ...form, impact: Math.min(5, Math.max(1, Number(e.target.value))) })} />
              </div>
              <div>
                <label className="label">Treatment</label>
                <select className="input" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value as RiskTreatment })}>
                  {TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RiskStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <span className="text-xs text-slate-500">Calculated:</span>
              <span className="text-sm font-semibold">Score {previewScore}</span>
              <RiskLevelBadge level={previewLevel} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveRisk}>Save Risk</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
