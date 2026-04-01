import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import { formatDate } from '../../utils/dateHelpers';
import { ACTIVITY_TYPES } from '../../utils/constants';

const isImage = (url) => /\.(jpg|jpeg|png)(\?|$)/i.test(url);

export default function ActivityTimeline({ mouId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/mou/${mouId}`);
      setActivities(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, [mouId]);

  if (loading) return <p className="text-sm font-medium text-gray-500">Loading activities...</p>;
  if (activities.length === 0) return <p className="text-sm font-medium text-gray-500">No activities logged yet.</p>;

  const getLabel = (type) => ACTIVITY_TYPES.find((t) => t.value === type)?.label || type;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-black mb-3">Activity History</h4>
      {activities.map((a) => {
        const isOpen = expanded === a._id;
        return (
          <div key={a._id} className="border-2 border-black rounded-md overflow-hidden">
            {/* Header row — always visible, clickable */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : a._id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-brutal-bg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brutal-primary border-2 border-black shrink-0"></div>
                <div>
                  <span className="text-sm font-bold text-black">{getLabel(a.type)}</span>
                  <span className="text-xs font-medium text-gray-500 ml-2">{formatDate(a.date)}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="px-4 pb-4 pt-2 bg-brutal-bg border-t-2 border-black space-y-3">
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{a.description}</p>
                </div>

                {a.attachmentUrl && (
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Attachment</span>
                    {isImage(a.attachmentUrl) ? (
                      <img
                        src={a.attachmentUrl}
                        alt="Activity attachment"
                        className="max-w-full max-h-64 rounded-md border-2 border-black object-contain"
                      />
                    ) : (
                      <a
                        href={a.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-bold text-black bg-white px-3 py-1.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
