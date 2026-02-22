import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import FileUpload from '../common/FileUpload';
import { useAuth } from '../../contexts/AuthContext';

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
            <input type="text" placeholder="Search organisations..." value={orgSearch}
              onChange={(e) => setOrgSearch(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
            {orgResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border-2 border-black rounded-md shadow-[4px_4px_0px_0px_black] max-h-48 overflow-y-auto">
                {orgResults.map((org) => (
                  <li key={org._id} onClick={() => handleOrgSelect(org)}
                    className="px-3 py-2 text-sm font-medium hover:bg-brutal-primary cursor-pointer border-b-2 border-black/10 last:border-b-0">
                    {org.name} <span className="text-gray-600 text-xs font-bold capitalize">({org.type})</span>
                  </li>
                ))}
              </ul>
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
