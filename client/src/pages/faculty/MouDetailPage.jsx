import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import StatusBadge from '../../components/common/StatusBadge';
import MouForm from '../../components/mou/MouForm';
import ActivityLogForm from '../../components/activity/ActivityLogForm';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import FileUpload from '../../components/common/FileUpload';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, daysUntil, toInputDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function MouDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [mou, setMou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingMou, setEditingMou] = useState(null);
  const [renewingMou, setRenewingMou] = useState(null);
  const [renewForm, setRenewForm] = useState({ newExpiryDate: '', signedCopyUrl: '', signedCopyPath: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchMou = async () => {
    try {
      const res = await api.get(`/mous/${id}`);
      setMou(res.data.data);
    } catch {
      toast.error('MoU not found.');
      navigate('/faculty/mous');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMou(); }, [id]);

  const handleEdit = async (formData) => {
    await api.put(`/mous/${mou._id}`, formData);
    toast.success('MoU updated!');
    setEditingMou(null);
    fetchMou();
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!renewForm.signedCopyUrl) { toast.error('Please upload the new signed copy.'); return; }
    try {
      await api.post(`/mous/${mou._id}/renew`, renewForm);
      toast.success('MoU renewed!');
      setRenewingMou(null);
      setRenewForm({ newExpiryDate: '', signedCopyUrl: '', signedCopyPath: '' });
      fetchMou();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renewal failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div>
      </div>
    );
  }

  if (!mou) return null;

  const days = daysUntil(mou.expiryDate);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/faculty/mous')}
        className="text-sm font-bold text-black mb-6 flex items-center space-x-1 hover:underline decoration-2"
      >
        <span>←</span><span>Back to My MoUs</span>
      </button>

      {/* MoU Detail Card */}
      <div className="bg-white rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_black] p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl font-black text-black">{mou.title}</h1>
              <StatusBadge status={mou.status} />
            </div>
            <p className="text-base text-gray-600 font-semibold mt-1">{mou.organisation?.name}</p>
          </div>
          {mou.signedCopyUrl && (
            <a
              href={mou.signedCopyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-black bg-brutal-blue px-3 py-1.5 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              View PDF
            </a>
          )}
        </div>

        {/* Dates row */}
        <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wide mb-0.5">Signed</span>
            <span className="font-semibold text-black">{formatDate(mou.signedDate)}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wide mb-0.5">Expires</span>
            <span className="font-semibold text-black">{formatDate(mou.expiryDate)}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wide mb-0.5">Status</span>
            <span className="font-semibold text-black">
              {mou.status === 'active' && days > 0
                ? `${days} days left`
                : mou.status === 'active' ? 'Overdue' : mou.status}
            </span>
          </div>
        </div>

        {/* Description */}
        {mou.description && (
          <div className="mt-4">
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Description</span>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{mou.description}</p>
          </div>
        )}

        {/* Terms */}
        {mou.terms && (
          <div className="mt-4">
            <span className="block text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Terms</span>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{mou.terms}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex space-x-2 flex-wrap gap-y-2">
          {mou.status === 'active' && (
            <button
              onClick={() => setEditingMou(mou)}
              className="text-sm px-4 py-2 rounded-md bg-white text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Edit
            </button>
          )}
          {(mou.status === 'active' || mou.status === 'expired') && (
            <button
              onClick={() => setRenewingMou(mou)}
              className="text-sm px-4 py-2 rounded-md bg-brutal-blue text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Renew
            </button>
          )}
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_black] p-6">
        <h2 className="text-lg font-black text-black mb-4">Activities</h2>
        <ActivityLogForm mouId={mou._id} onActivityLogged={() => setRefreshKey((k) => k + 1)} />
        <div className="mt-5">
          <ActivityTimeline key={refreshKey} mouId={mou._id} />
        </div>
      </div>

      {/* Edit Modal */}
      {editingMou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-black">Edit MoU</h2>
              <button
                onClick={() => setEditingMou(null)}
                className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all"
              >
                X
              </button>
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
              <button
                onClick={() => setRenewingMou(null)}
                className="text-black font-black text-lg hover:bg-red-400 px-2 rounded-md border-2 border-black transition-all"
              >
                X
              </button>
            </div>
            <form onSubmit={handleRenew} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black">New Expiry Date</label>
                <input
                  type="date"
                  required
                  value={renewForm.newExpiryDate}
                  onChange={(e) => setRenewForm({ ...renewForm, newExpiryDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white"
                />
              </div>
              <FileUpload
                storagePath={`mous/${currentUser?._id}`}
                onUploadComplete={({ downloadUrl, storagePath }) =>
                  setRenewForm({ ...renewForm, signedCopyUrl: downloadUrl, signedCopyPath: storagePath })
                }
              />
              <button
                type="submit"
                className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Renew MoU
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
