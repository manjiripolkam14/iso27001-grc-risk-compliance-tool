import { useMemo, useState } from 'react';
import { Asset, AssetStatus, Criticality } from '../types';
import { GrcPageProps, nextId } from '../utils/storage';
import { CriticalityBadge, GenericStatusBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Toolbar from '../components/Toolbar';

const CRITICALITIES: Criticality[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: AssetStatus[] = ['Active', 'Retired', 'Under Review'];

const emptyForm: Omit<Asset, 'id'> = {
  name: '',
  type: '',
  owner: '',
  businessFunction: '',
  criticality: 'Medium',
  status: 'Active',
};

export default function AssetRegister({ data, setData, logActivity }: GrcPageProps) {
  const [search, setSearch] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.assets.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.owner.toLowerCase().includes(search.toLowerCase());
      const matchesCriticality = criticalityFilter === 'All' || a.criticality === criticalityFilter;
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesSearch && matchesCriticality && matchesStatus;
    });
  }, [data.assets, search, criticalityFilter, statusFilter]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(asset: Asset) {
    setEditingId(asset.id);
    const { id, ...rest } = asset;
    setForm(rest);
    setModalOpen(true);
  }

  function saveAsset() {
    if (!form.name.trim() || !form.owner.trim()) return;
    if (editingId) {
      setData((prev) => ({
        ...prev,
        assets: prev.assets.map((a) => (a.id === editingId ? { ...a, ...form } : a)),
      }));
      logActivity(`Updated asset ${editingId}: ${form.name}`);
    } else {
      const id = nextId('A', data.assets.map((a) => a.id));
      setData((prev) => ({ ...prev, assets: [...prev.assets, { id, ...form }] }));
      logActivity(`Added new asset ${id}: ${form.name}`);
    }
    setModalOpen(false);
  }

  function deleteAsset(id: string) {
    setData((prev) => ({ ...prev, assets: prev.assets.filter((a) => a.id !== id) }));
    logActivity(`Deleted asset ${id}`);
    setConfirmDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Asset Register</h1>
        <p className="page-subtitle">Fictional information assets for NovaTech Solutions.</p>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by name, ID, or owner..."
        action={
          <button className="btn-primary" onClick={openAddModal}>
            + Add Asset
          </button>
        }
      >
        <select className="input w-auto" value={criticalityFilter} onChange={(e) => setCriticalityFilter(e.target.value)}>
          <option value="All">All Criticality</option>
          {CRITICALITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Toolbar>

      <div className="card overflow-x-auto">
        <table className="grc-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Business Function</th>
              <th>Criticality</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id}>
                <td className="font-medium text-slate-700">{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.type}</td>
                <td>{asset.owner}</td>
                <td>{asset.businessFunction}</td>
                <td><CriticalityBadge level={asset.criticality} /></td>
                <td><GenericStatusBadge status={asset.status} /></td>
                <td className="whitespace-nowrap">
                  <button className="text-xs text-navy-700 hover:underline mr-3" onClick={() => openEditModal(asset)}>
                    Edit
                  </button>
                  {confirmDeleteId === asset.id ? (
                    <span className="text-xs">
                      <button className="text-red-600 hover:underline mr-2" onClick={() => deleteAsset(asset.id)}>
                        Confirm
                      </button>
                      <button className="text-slate-500 hover:underline" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button className="text-xs text-red-500 hover:underline" onClick={() => setConfirmDeleteId(asset.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-8">No assets match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editingId ? `Edit Asset ${editingId}` : 'Add Asset'} onClose={() => setModalOpen(false)}>
          <div className="space-y-3">
            <div>
              <label className="label">Asset Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Asset Type</label>
              <input className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            </div>
            <div>
              <label className="label">Owner</label>
              <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
            </div>
            <div>
              <label className="label">Business Function</label>
              <input className="input" value={form.businessFunction} onChange={(e) => setForm({ ...form, businessFunction: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Criticality</label>
                <select className="input" value={form.criticality} onChange={(e) => setForm({ ...form, criticality: e.target.value as Criticality })}>
                  {CRITICALITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AssetStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveAsset}>Save Asset</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
