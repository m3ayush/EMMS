import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../hooks/useApi';
import MouCard from '../../components/mou/MouCard';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, daysSince } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function FacultyDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMou, setSelectedMou] = useState(null);
  const [showGraceModal, setShowGraceModal] = useState(null);
  const [graceForm, setGraceForm] = useState({ reason: '', graceDays: 30 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/faculty/${id}`);
        setData(res.data.data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGracePeriod = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/grace-periods', {
        facultyId: id,
        mouId: showGraceModal._id,
        reason: graceForm.reason,
        graceDays: Number(graceForm.graceDays),
      });
      toast.success('Grace period issued!');
      setShowGraceModal(null);
      setGraceForm({ reason: '', graceDays: 30 });
      // Refresh
      const res = await api.get(`/admin/faculty/${id}`);
      setData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div></div>;
  if (!data) return <p className="text-center py-8 text-gray-600 font-medium">Faculty not found.</p>;

  const { faculty, mous, gracePeriods } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Faculty Profile */}
      <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-brutal-primary flex items-center justify-center text-black text-2xl font-black border-2 border-black">
            {faculty.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">{faculty.name}</h2>
            <p className="text-sm text-gray-600 font-medium">{faculty.designation} - {faculty.department}</p>
            <p className="text-sm text-gray-500 font-medium">{faculty.email}</p>
          </div>
        </div>
      </div>

      {/* Grace Periods */}
      {gracePeriods.length > 0 && (
        <div className="bg-brutal-primary border-2 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_black]">
          <h3 className="text-sm font-bold text-black mb-2">Grace Periods</h3>
          {gracePeriods.map((gp) => (
            <div key={gp._id} className="flex items-center justify-between text-sm text-black py-1">
              <span className="font-medium">{gp.mou?.title} - {gp.reason}</span>
              <span className="capitalize text-xs font-bold bg-black text-white px-2 py-0.5 rounded-md">{gp.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* MoUs */}
      <div>
        <h3 className="text-lg font-black text-black mb-4">MoUs ({mous.length})</h3>
        {mous.length === 0 ? (
          <p className="text-sm text-gray-600 font-medium">No MoUs.</p>
        ) : (
          <div className="space-y-4">
            {mous.map((mou) => (
              <div key={mou._id}>
                <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-black">{mou.title}</h4>
                        <StatusBadge status={mou.status} />
                      </div>
                      <p className="text-sm text-gray-600 font-medium mt-1">{mou.organisation?.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setSelectedMou(selectedMou?._id === mou._id ? null : mou)}
                        className="text-xs px-3 py-1.5 rounded-md bg-white text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                        {selectedMou?._id === mou._id ? 'Hide Activities' : 'View Activities'}
                      </button>
                      {mou.status === 'active' && (
                        <button onClick={() => setShowGraceModal(mou)}
                          className="text-xs px-3 py-1.5 rounded-md bg-brutal-primary text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                          Send Grace Period
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div><span className="block text-gray-500 font-bold">Signed</span>{formatDate(mou.signedDate)}</div>
                    <div><span className="block text-gray-500 font-bold">Expires</span>{formatDate(mou.expiryDate)}</div>
                    <div><span className="block text-gray-500 font-bold">Last Interaction</span>
                      <span className={daysSince(mou.lastInteractionDate) > 90 ? 'text-red-600 font-bold' : ''}>
                        {daysSince(mou.lastInteractionDate)} days ago
                      </span>
                    </div>
                  </div>
                </div>
                {selectedMou?._id === mou._id && (
                  <div className="ml-4 mt-2 p-4 border-l-3 border-black">
                    <ActivityTimeline mouId={mou._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grace Period Modal */}
      {showGraceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black shadow-[6px_6px_0px_0px_black]">
            <h2 className="text-lg font-black text-black mb-4">Issue Grace Period</h2>
            <p className="text-sm text-gray-700 font-medium mb-4">For: {showGraceModal.title}</p>
            <form onSubmit={handleGracePeriod} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black">Reason</label>
                <textarea required rows={2} value={graceForm.reason}
                  onChange={(e) => setGraceForm({ ...graceForm, reason: e.target.value })}
                  className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black">Grace Days</label>
                <input type="number" min={1} max={90} required value={graceForm.graceDays}
                  onChange={(e) => setGraceForm({ ...graceForm, graceDays: e.target.value })}
                  className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-brutal-primary text-black py-2.5 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Issue Grace Period</button>
                <button type="button" onClick={() => setShowGraceModal(null)} className="flex-1 bg-white text-black py-2.5 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
