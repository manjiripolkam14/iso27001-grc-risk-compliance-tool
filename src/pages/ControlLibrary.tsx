import { useMemo, useState } from 'react';
import { Control, ControlStatus } from '../types';
import { GrcPageProps, nextId } from '../utils/storage';
import { ControlStatusBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

const STATUSES: ControlStatus[] = ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'];
const CATEGORIES = [
  'Access Control',
  'Asset Management',
  'Vulnerability Management',
  'Security Awareness',
  'Incident Management',
  'Logging & Monitoring',
  'Backup',
  'Cryptography',
  'Supplier Security',
  'Business Continuity',
];

const emptyForm: Omit<Control, 'id'> = {
  name: '',
  category: CATEGORIES[0],
  objective: '',
  description: '',
  status: 'Not Implemented',
  owner: '',
  evidenceRequired: '',
};

export default function ControlLibrary({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.controls.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [data.controls, search, categoryFilter, statusFilter]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(control: Control) {
    setEditingId(control.id);
    const { id, ...rest } = control;
    setForm(rest);
    setModalOpen(true);
  }

  function saveControl() {
    if (!form.name.trim() || !form.owner.trim()) return;
    if (editingId) {
      setData((prev) => ({
        ...prev,
        controls: prev.controls.map((c) => (c.id === editingId ? { ...c, ...form } : c)),
      }));
      logActivity(`Updated control ${editingId}: ${form.name}`);
    } else {
      const id = nextId('C', data.controls.map((c) => c.id));
      setData((prev) => ({ ...prev, controls: [...prev.controls, { id, ...form }] }));
      logActivity(`Added new control ${id}: ${form.name}`);
    }
    setModalOpen(false);
  }

  function deleteControl(id: string) {
    setData((prev) => ({
      ...prev,
      controls: prev.controls.filter((c) => c.id !== id),
      mappings: prev.mappings.filter((m) => m.controlId !== id),
      gaps: prev.gaps.filter((g) => g.controlId !== id),
    }));
    logActivity(`Deleted control ${id}`);
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Control Library</h1>
        <p className="page-subtitle">
          ISO/IEC 27001-inspired sample controls. This is not the complete official ISO control set.
        </p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by control name or ID..."
        action={
          <button className="btn-primary" onClick={openAddModal}>
            + Add Control
          </button>
        }
      >
        <select className="input w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
              <th>Control ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Objective</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Evidence Required</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((control) => (
              <tr key={control.id}>
                <td className="font-medium text-slate-700">{control.id}</td>
                <td className="max-w-[180px]">{control.name}</td>
                <td>{control.category}</td>
                <td className="max-w-xs text-slate-500">{control.objective}</td>
                <td><ControlStatusBadge status={control.status} /></td>
                <td>{control.owner}</td>
                <td className="max-w-[160px] text-slate-500">{control.evidenceRequired}</td>
                <td className="whitespace-nowrap">
                  <button className="text-xs text-navy-700 hover:underline mr-3" onClick={() => openEditModal(control)}>
                    Edit
                  </button>
                  {confirmDeleteId === control.id ? (
                    <span className="text-xs">
                      <button className="text-red-600 hover:underline mr-2" onClick={() => deleteControl(control.id)}>
                        Confirm
                      </button>
                      <button className="text-slate-500 hover:underline" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button className="text-xs text-red-500 hover:underline" onClick={() => setConfirmDeleteId(control.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-8">No controls match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? `Edit Control ${editingId}` : 'Add Control'} onClose={() => setModalOpen(false)} wide>
          <div className="space-y-3">
            <div>
              <label className="label">Control Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Owner</label>
                <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Objective</label>
              <input className="input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Implementation Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ControlStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Evidence Required</label>
                <input className="input" value={form.evidenceRequired} onChange={(e) => setForm({ ...form, evidenceRequired: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveControl}>Save Control</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
