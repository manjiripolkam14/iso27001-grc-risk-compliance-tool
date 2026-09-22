import { useMemo, useState } from 'react';
import { Remediation, RemediationPriority, RemediationStatus } from '../types';
import { GrcPageProps, nextId } from '../utils/storage';
import { isOverdue } from '../utils/calculations';
import { PriorityBadge, GenericStatusBadge, OverdueBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

const PRIORITIES: RemediationPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: RemediationStatus[] = ['Open', 'In Progress', 'Completed', 'Overdue'];

function emptyForm(data: GrcPageProps['data']): Omit<Remediation, 'id'> {
  return {
    findingId: data.gaps[0]?.id ?? '',
    riskId: data.risks[0]?.id ?? '',
    controlId: data.controls[0]?.id ?? '',
    owner: '',
    priority: 'Medium',
    dueDate: new Date().toISOString().slice(0, 10),
    status: 'Open',
  };
}

export default function RemediationTracker({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm(data));
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const findingText = (id: string) => data.gaps.find((g) => g.id === id)?.finding ?? id;
  const riskTitle = (id: string) => {
    const r = data.risks.find((r) => r.id === id);
    return r ? `${r.id} - ${r.title}` : id;
  };
  const controlName = (id: string) => {
    const c = data.controls.find((c) => c.id === id);
    return c ? `${c.id} - ${c.name}` : id;
  };

  const filtered = useMemo(() => {
    return data.remediations.filter((r) => {
      const matchesSearch =
        !search ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        findingText(r.findingId).toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [data.remediations, data.gaps, search, priorityFilter, statusFilter]);

  const overdueCount = data.remediations.filter((r) => isOverdue(r.dueDate, r.status)).length;

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm(data));
    setModalOpen(true);
  }

  function openEditModal(remediation: Remediation) {
    setEditingId(remediation.id);
    const { id, ...rest } = remediation;
    setForm(rest);
    setModalOpen(true);
  }

  function saveRemediation() {
    if (!form.owner.trim()) return;
    if (editingId) {
      setData((prev) => ({
        ...prev,
        remediations: prev.remediations.map((r) => (r.id === editingId ? { ...r, ...form } : r)),
      }));
      logActivity(`Updated remediation ${editingId}`);
    } else {
      const id = nextId('RMD', data.remediations.map((r) => r.id));
      setData((prev) => ({ ...prev, remediations: [...prev.remediations, { id, ...form }] }));
      logActivity(`Created remediation ${id}`);
    }
    setModalOpen(false);
  }

  function deleteRemediation(id: string) {
    setData((prev) => ({ ...prev, remediations: prev.remediations.filter((r) => r.id !== id) }));
    logActivity(`Deleted remediation ${id}`);
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Remediation Tracker</h1>
        <p className="page-subtitle">
          Tracks remediation actions tied to findings. {overdueCount} item{overdueCount === 1 ? '' : 's'} currently overdue.
        </p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by ID or finding..."
        action={
          <button className="btn-primary" onClick={openAddModal}>
            + Add Remediation
          </button>
        }
      >
        <select className="input w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priority</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
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
              <th>Remediation ID</th>
              <th>Finding</th>
              <th>Risk</th>
              <th>Control</th>
              <th>Owner</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rmd) => {
              const overdue = isOverdue(rmd.dueDate, rmd.status);
              return (
                <tr key={rmd.id}>
                  <td className="font-medium text-slate-700">{rmd.id}</td>
                  <td className="max-w-[200px] text-slate-600">{findingText(rmd.findingId)}</td>
                  <td className="max-w-[160px] text-slate-600">{riskTitle(rmd.riskId)}</td>
                  <td className="max-w-[160px] text-slate-600">{controlName(rmd.controlId)}</td>
                  <td>{rmd.owner}</td>
                  <td><PriorityBadge priority={rmd.priority} /></td>
                  <td className="whitespace-nowrap">
                    {rmd.dueDate} {overdue && <OverdueBadge />}
                  </td>
                  <td><GenericStatusBadge status={rmd.status} /></td>
                  <td className="whitespace-nowrap">
                    <button className="text-xs text-navy-700 hover:underline mr-3" onClick={() => openEditModal(rmd)}>
                      Edit
                    </button>
                    {confirmDeleteId === rmd.id ? (
                      <span className="text-xs">
                        <button className="text-red-600 hover:underline mr-2" onClick={() => deleteRemediation(rmd.id)}>
                          Confirm
                        </button>
                        <button className="text-slate-500 hover:underline" onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button className="text-xs text-red-500 hover:underline" onClick={() => setConfirmDeleteId(rmd.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-slate-400 py-8">No remediation items match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? `Edit ${editingId}` : 'Add Remediation'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Finding (Compliance Gap)</label>
                <select className="input" value={form.findingId} onChange={(e) => setForm({ ...form, findingId: e.target.value })}>
                  {data.gaps.map((g) => <option key={g.id} value={g.id}>{g.id} - {g.finding.slice(0, 40)}...</option>)}
                </select>
              </div>
              <div>
                <label className="label">Related Risk</label>
                <select className="input" value={form.riskId} onChange={(e) => setForm({ ...form, riskId: e.target.value })}>
                  {data.risks.map((r) => <option key={r.id} value={r.id}>{r.id} - {r.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Related Control</label>
                <select className="input" value={form.controlId} onChange={(e) => setForm({ ...form, controlId: e.target.value })}>
                  {data.controls.map((c) => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Owner</label>
                <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as RemediationPriority })}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RemediationStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveRemediation}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
