import { useMemo, useState } from 'react';
import { ComplianceGap, GapSeverity, GapStatus } from '../types';
import { GrcPageProps, nextId } from '../utils/storage';
import { isOverdue } from '../utils/calculations';
import { SeverityBadge, GenericStatusBadge, OverdueBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

const SEVERITIES: GapSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: GapStatus[] = ['Open', 'In Progress', 'Resolved', 'Accepted'];

function emptyForm(controls: { id: string }[]): Omit<ComplianceGap, 'id'> {
  return {
    controlId: controls[0]?.id ?? '',
    finding: '',
    severity: 'Medium',
    owner: '',
    recommendation: '',
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'Open',
  };
}

export default function ComplianceGaps({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm(data.controls));
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const controlName = (id: string) => {
    const c = data.controls.find((c) => c.id === id);
    return c ? `${c.id} - ${c.name}` : id;
  };

  const filtered = useMemo(() => {
    return data.gaps.filter((g) => {
      const matchesSearch =
        !search ||
        g.finding.toLowerCase().includes(search.toLowerCase()) ||
        g.id.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || g.severity === severityFilter;
      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [data.gaps, search, severityFilter, statusFilter]);

  const overdueCount = data.gaps.filter((g) => isOverdue(g.dueDate, g.status)).length;

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm(data.controls));
    setModalOpen(true);
  }

  function openEditModal(gap: ComplianceGap) {
    setEditingId(gap.id);
    const { id, ...rest } = gap;
    setForm(rest);
    setModalOpen(true);
  }

  function saveGap() {
    if (!form.finding.trim() || !form.controlId) return;
    if (editingId) {
      setData((prev) => ({
        ...prev,
        gaps: prev.gaps.map((g) => (g.id === editingId ? { ...g, ...form } : g)),
      }));
      logActivity(`Updated compliance gap ${editingId}`);
    } else {
      const id = nextId('G', data.gaps.map((g) => g.id));
      setData((prev) => ({ ...prev, gaps: [...prev.gaps, { id, ...form }] }));
      logActivity(`Logged new compliance gap ${id}`);
    }
    setModalOpen(false);
  }

  function deleteGap(id: string) {
    setData((prev) => ({ ...prev, gaps: prev.gaps.filter((g) => g.id !== id) }));
    logActivity(`Deleted compliance gap ${id}`);
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Compliance Gaps</h1>
        <p className="page-subtitle">
          Tracks findings against controls. {overdueCount} gap{overdueCount === 1 ? '' : 's'} currently overdue.
        </p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by finding or ID..."
        action={
          <button className="btn-primary" onClick={openAddModal}>
            + Log Gap
          </button>
        }
      >
        <select className="input w-auto" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          <option value="All">All Severity</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
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
              <th>Gap ID</th>
              <th>Control</th>
              <th>Finding</th>
              <th>Severity</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((gap) => {
              const overdue = isOverdue(gap.dueDate, gap.status);
              return (
                <tr key={gap.id}>
                  <td className="font-medium text-slate-700">{gap.id}</td>
                  <td className="max-w-[160px] text-slate-600">{controlName(gap.controlId)}</td>
                  <td className="max-w-xs text-slate-600">{gap.finding}</td>
                  <td><SeverityBadge severity={gap.severity} /></td>
                  <td>{gap.owner}</td>
                  <td className="whitespace-nowrap">
                    {gap.dueDate} {overdue && <OverdueBadge />}
                  </td>
                  <td><GenericStatusBadge status={gap.status} /></td>
                  <td className="whitespace-nowrap">
                    <button className="text-xs text-navy-700 hover:underline mr-3" onClick={() => openEditModal(gap)}>
                      Edit
                    </button>
                    {confirmDeleteId === gap.id ? (
                      <span className="text-xs">
                        <button className="text-red-600 hover:underline mr-2" onClick={() => deleteGap(gap.id)}>
                          Confirm
                        </button>
                        <button className="text-slate-500 hover:underline" onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button className="text-xs text-red-500 hover:underline" onClick={() => setConfirmDeleteId(gap.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-8">No compliance gaps match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? `Edit Gap ${editingId}` : 'Log Compliance Gap'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-3">
            <div>
              <label className="label">Control</label>
              <select className="input" value={form.controlId} onChange={(e) => setForm({ ...form, controlId: e.target.value })}>
                {data.controls.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Finding</label>
              <textarea className="input" rows={2} value={form.finding} onChange={(e) => setForm({ ...form, finding: e.target.value })} />
            </div>
            <div>
              <label className="label">Recommendation</label>
              <textarea className="input" rows={2} value={form.recommendation} onChange={(e) => setForm({ ...form, recommendation: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Severity</label>
                <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as GapSeverity })}>
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GapStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Owner</label>
                <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveGap}>Save Gap</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
