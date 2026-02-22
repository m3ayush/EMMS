import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import { formatDate } from '../../utils/dateHelpers';
import { ACTIVITY_TYPES } from '../../utils/constants';

export default function ActivityTimeline({ mouId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-3">
      {activities.map((a) => (
        <div key={a._id} className="flex items-start space-x-3 text-sm">
          <div className="w-3 h-3 mt-1.5 rounded-full bg-brutal-primary border-2 border-black shrink-0"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-black">{getLabel(a.type)}</span>
              <span className="text-xs font-medium text-gray-500">{formatDate(a.date)}</span>
            </div>
            <p className="text-gray-600 text-xs mt-0.5">{a.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
