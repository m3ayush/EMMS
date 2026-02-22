import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import OrgSearchBar from '../../components/organisation/OrgSearchBar';
import OrgCard from '../../components/organisation/OrgCard';
import { ORG_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function OrgSearchPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgMous, setOrgMous] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', type: '', address: '', contactPerson: '', contactEmail: '', contactPhone: '', website: '' });

  useEffect(() => { handleSearch({}); }, []);

  const handleSearch = async ({ search, type }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      const res = await api.get(`/organisations?${params}`);
      setOrgs(res.data.data.orgs);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleOrgClick = async (org) => {
    setSelectedOrg(org);
    try {
      const res = await api.get(`/organisations/${org._id}`);
      setOrgMous(res.data.data.mous);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/organisations', createForm);
      toast.success('Organisation created!');
      setShowCreate(false);
      setCreateForm({ name: '', type: '', address: '', contactPerson: '', contactEmail: '', contactPhone: '', website: '' });
      handleSearch({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-black">Organisations</h1>
        <button onClick={() => setShowCreate(true)} className="bg-brutal-primary text-black px-4 py-2 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          Add Organisation
        </button>
      </div>

      <OrgSearchBar onSearch={handleSearch} />

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">Add Organisation</h2>
              <button onClick={() => setShowCreate(false)} className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all">X</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Organisation name" required value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              <select required value={createForm.type} onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
                <option value="">Select type</option>
                {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input type="text" placeholder="Contact person" value={createForm.contactPerson}
                onChange={(e) => setCreateForm({ ...createForm, contactPerson: e.target.value })}
                className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              <input type="email" placeholder="Contact email" value={createForm.contactEmail}
                onChange={(e) => setCreateForm({ ...createForm, contactEmail: e.target.value })}
                className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              <input type="text" placeholder="Address" value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              <button type="submit" className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Create</button>
            </form>
          </div>
        </div>
      )}

      {/* Org Detail Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">{selectedOrg.name}</h2>
              <button onClick={() => setSelectedOrg(null)} className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all">X</button>
            </div>
            <div className="text-sm space-y-2 text-gray-700">
              <p><span className="font-bold">Type:</span> <span className="capitalize">{selectedOrg.type}</span></p>
              {selectedOrg.contactPerson && <p><span className="font-bold">Contact:</span> {selectedOrg.contactPerson}</p>}
              {selectedOrg.contactEmail && <p><span className="font-bold">Email:</span> {selectedOrg.contactEmail}</p>}
              {selectedOrg.address && <p><span className="font-bold">Address:</span> {selectedOrg.address}</p>}
            </div>
            <h3 className="text-sm font-black text-black mt-4 mb-2">MoUs ({orgMous.length})</h3>
            {orgMous.length === 0 ? (
              <p className="text-xs text-gray-500 font-medium">No MoUs with this organisation.</p>
            ) : (
              <div className="space-y-2">
                {orgMous.map((m) => (
                  <div key={m._id} className="bg-brutal-bg rounded-md p-3 text-sm border-2 border-black">
                    <p className="font-bold text-black">{m.title}</p>
                    <p className="text-xs text-gray-600 font-medium">{m.faculty?.name} - {m.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-600 font-medium col-span-full text-center py-8">Loading...</p>
        ) : orgs.length === 0 ? (
          <p className="text-gray-600 font-medium col-span-full text-center py-8">No organisations found.</p>
        ) : (
          orgs.map((org) => <OrgCard key={org._id} org={org} onClick={() => handleOrgClick(org)} />)
        )}
      </div>
    </div>
  );
}
