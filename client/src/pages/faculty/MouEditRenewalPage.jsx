import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import MouCard from '../../components/mou/MouCard';
import MouForm from '../../components/mou/MouForm';
import ActivityLogForm from '../../components/activity/ActivityLogForm';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import FileUpload from '../../components/common/FileUpload';
import { useAuth } from '../../contexts/AuthContext';
import { toInputDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function MouEditRenewalPage() {
  const { currentUser } = useAuth();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMou, setEditingMou] = useState(null);
  const [renewingMou, setRenewingMou] = useState(null);
  const [activitiesMou, setActivitiesMou] = useState(null);
  const [renewForm, setRenewForm] = useState({ newExpiryDate: '', signedCopyUrl: '', signedCopyPath: '' });
  const [filter, setFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchMous = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await api.get(`/mous${params}`);
      setMous(res.data.data.mous);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMous(); }, [filter]);

  const handleEdit = async (formData) => {
    await api.put(`/mous/${editingMou._id}`, formData);
    toast.success('MoU updated!');
    setEditingMou(null);
    fetchMous();
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!renewForm.signedCopyUrl) { toast.error('Please upload the new signed copy.'); return; }
    try {
      await api.post(`/mous/${renewingMou._id}/renew`, renewForm);
      toast.success('MoU renewed!');
      setRenewingMou(null);
      setRenewForm({ newExpiryDate: '', signedCopyUrl: '', signedCopyPath: '' });
      fetchMous();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renewal failed.');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-black">My MoUs</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-2 border-black px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="renewed">Renewed</option>
        </select>
      </div>

      {/* Edit Modal */}
      {editingMou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">Edit MoU</h2>
              <button onClick={() => setEditingMou(null)} className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all">X</button>
            </div>
            <MouForm
              initialData={{
                ...editingMou,
                signedDate: toInputDate(editingMou.signedDate),
                expiryDate: toInputDate(editingMou.expiryDate),
              }}
              onSubmit={handleEdit}
              submitLabel="Update MoU"
            />
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {renewingMou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">Renew: {renewingMou.title}</h2>
              <button onClick={() => setRenewingMou(null)} className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all">X</button>
            </div>
            <form onSubmit={handleRenew} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black">New Expiry Date</label>
                <input type="date" required value={renewForm.newExpiryDate}
                  onChange={(e) => setRenewForm({ ...renewForm, newExpiryDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              </div>
              <FileUpload storagePath={`mous/${currentUser?._id}`}
                onUploadComplete={({ downloadUrl, storagePath }) => setRenewForm({ ...renewForm, signedCopyUrl: downloadUrl, signedCopyPath: storagePath })} />
              <button type="submit" className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Renew MoU</button>
            </form>
          </div>
        </div>
      )}

      {/* Activity Panel */}
      {activitiesMou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">Activities: {activitiesMou.title}</h2>
              <button onClick={() => { setActivitiesMou(null); setRefreshKey((k) => k + 1); }} className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all">X</button>
            </div>
            <ActivityLogForm mouId={activitiesMou._id} onActivityLogged={() => setRefreshKey((k) => k + 1)} />
            <div className="mt-4">
              <ActivityTimeline key={refreshKey} mouId={activitiesMou._id} />
            </div>
          </div>
        </div>
      )}

      {mous.length === 0 ? (
        <p className="text-gray-600 font-medium text-center py-8">No MoUs found.</p>
      ) : (
        <div className="space-y-4">
          {mous.map((mou) => (
            <MouCard key={mou._id} mou={mou}
              onEdit={setEditingMou}
              onRenew={setRenewingMou}
              onViewActivities={setActivitiesMou} />
          ))}
        </div>
      )}
    </div>
  );
}
