import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import FileUpload from '../common/FileUpload';
import { useAuth } from '../../contexts/AuthContext';
import { ORG_TYPES } from '../../utils/constants';

export default function MouForm({ initialData, onSubmit, submitLabel = 'Submit MoU' }) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    organisation: '',
    signedDate: '',
    expiryDate: '',
    terms: '',
    signedCopyUrl: '',
    signedCopyPath: '',
    ...initialData,
  });
  const [orgSearch, setOrgSearch] = useState('');
  const [orgResults, setOrgResults] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgType, setNewOrgType] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData?.organisation && typeof initialData.organisation === 'object') {
      setSelectedOrg(initialData.organisation);
    }
  }, [initialData]);

  useEffect(() => {
    if (orgSearch.length < 2) { setOrgResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/organisations?search=${orgSearch}`);
        setOrgResults(res.data.data.orgs);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [orgSearch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrgSelect = (org) => {
    setSelectedOrg(org);
    setForm({ ...form, organisation: org._id });
    setOrgSearch('');
    setOrgResults([]);
    setShowCreateOrg(false);
  };

  const handleCreateOrg = async () => {
    if (!orgSearch.trim() || !newOrgType) return;
    setCreatingOrg(true);
    try {
      const res = await api.post('/organisations', { name: orgSearch.trim(), type: newOrgType });
      handleOrgSelect(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organisation.');
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleUploadComplete = ({ downloadUrl, storagePath }) => {
    setForm({ ...form, signedCopyUrl: downloadUrl, signedCopyPath: storagePath });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.signedCopyUrl) { setError('Please upload the signed MoU copy.'); return; }
    if (!form.organisation) { setError('Please select an organisation.'); return; }
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-400 text-black text-sm font-bold p-3 rounded-md border-2 border-black">{error}</div>}

      <div>
        <label className="block text-sm font-bold text-black">MoU Title</label>
        <input type="text" name="title" required value={form.title} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
      </div>

      <div>
        <label className="block text-sm font-bold text-black">Description</label>
        <textarea name="description" required rows={3} value={form.description} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
      </div>

      <div className="relative">
        <label className="block text-sm font-bold text-black">Organisation</label>
        {selectedOrg ? (
          <div className="mt-1 flex items-center justify-between bg-brutal-blue border-2 border-black rounded-md px-3 py-2">
            <span className="text-sm font-bold text-black">{selectedOrg.name}</span>
            <button type="button" onClick={() => { setSelectedOrg(null); setForm({ ...form, organisation: '' }); }}
              className="text-black font-bold hover:bg-black/10 px-2 rounded text-sm">Change</button>
          </div>
        ) : (
          <>
            <input type="text" placeholder="Search or type new organisation name..." value={orgSearch}
              onChange={(e) => { setOrgSearch(e.target.value); setShowCreateOrg(false); }}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
            {orgSearch.length >= 2 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border-2 border-black rounded-md shadow-[4px_4px_0px_0px_black] max-h-48 overflow-y-auto">
                {orgResults.map((org) => (
                  <li key={org._id} onClick={() => handleOrgSelect(org)}
                    className="px-3 py-2 text-sm font-medium hover:bg-brutal-primary cursor-pointer border-b-2 border-black/10">
                    {org.name} <span className="text-gray-600 text-xs font-bold capitalize">({org.type})</span>
                  </li>
                ))}
                <li onClick={() => setShowCreateOrg(true)}
                  className="px-3 py-2 text-sm font-bold text-black hover:bg-brutal-green cursor-pointer bg-green-50">
                  + Create &quot;{orgSearch.trim()}&quot; as new organisation
                </li>
              </ul>
            )}
            {showCreateOrg && (
              <div className="mt-2 p-3 bg-green-50 border-2 border-black rounded-md">
                <p className="text-sm font-bold text-black mb-2">Create: {orgSearch.trim()}</p>
                <select value={newOrgType} onChange={(e) => setNewOrgType(e.target.value)}
                  className="block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
                  <option value="">Select type</option>
                  {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <button type="button" onClick={handleCreateOrg} disabled={!newOrgType || creatingOrg}
                  className="mt-2 w-full bg-brutal-green text-black py-2 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all">
                  {creatingOrg ? 'Creating...' : 'Create Organisation'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black">Signed Date</label>
          <input type="date" name="signedDate" required value={form.signedDate} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
        </div>
        <div>
          <label className="block text-sm font-bold text-black">Expiry Date</label>
          <input type="date" name="expiryDate" required value={form.expiryDate} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-black">Terms / Notes</label>
        <textarea name="terms" rows={2} value={form.terms} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
      </div>

      <FileUpload storagePath={`mous/${currentUser?._id}`} onUploadComplete={handleUploadComplete} />

      <button type="submit" disabled={loading}
        className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all">
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}
