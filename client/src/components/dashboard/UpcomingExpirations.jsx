import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatDate, daysUntil } from '../../utils/dateHelpers';

export default function UpcomingExpirations({ mous }) {
  if (!mous || mous.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
        <h3 className="text-lg font-black text-black mb-4">Upcoming Expirations</h3>
        <p className="text-gray-600 text-sm font-medium">No MoUs expiring soon.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
      <h3 className="text-lg font-black text-black mb-4">Upcoming Expirations</h3>
      <div className="space-y-3">
        {mous.map((mou) => {
          const days = daysUntil(mou.expiryDate);
          return (
            <div key={mou._id} className="flex items-center justify-between p-3 rounded-md bg-brutal-bg border-2 border-black">
              <div>
                <p className="font-bold text-black text-sm">{mou.title}</p>
                <p className="text-xs text-gray-600 font-medium">{mou.organisation?.name} - Expires {formatDate(mou.expiryDate)}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md border-2 border-black ${
                days <= 7 ? 'bg-red-400 text-black' :
                days <= 30 ? 'bg-brutal-primary text-black' :
                'bg-brutal-blue text-black'
              }`}>
                {days} days
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
