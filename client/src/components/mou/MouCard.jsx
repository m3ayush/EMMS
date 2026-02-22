import StatusBadge from '../common/StatusBadge';
import { formatDate, daysUntil } from '../../utils/dateHelpers';

export default function MouCard({ mou, onEdit, onRenew, onViewActivities, showFaculty = false }) {
  const days = daysUntil(mou.expiryDate);

  return (
    <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-black">{mou.title}</h3>
            <StatusBadge status={mou.status} />
          </div>
          <p className="text-sm text-gray-600 font-medium mt-1">{mou.organisation?.name}</p>
          {showFaculty && mou.faculty && (
            <p className="text-xs text-gray-500 font-medium mt-0.5">Faculty: {mou.faculty.name} ({mou.faculty.department})</p>
          )}
        </div>
        {mou.signedCopyUrl && (
          <a href={mou.signedCopyUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-black bg-brutal-blue px-2 py-1 rounded-md border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 transition-all">View PDF</a>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
        <div>
          <span className="block text-gray-500 font-bold">Signed</span>
          {formatDate(mou.signedDate)}
        </div>
        <div>
          <span className="block text-gray-500 font-bold">Expires</span>
          {formatDate(mou.expiryDate)}
        </div>
        <div>
          <span className="block text-gray-500 font-bold">Status</span>
          {mou.status === 'active' && days > 0
            ? `${days} days left`
            : mou.status === 'active' ? 'Overdue' : mou.status}
        </div>
      </div>

      {mou.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{mou.description}</p>
      )}

      <div className="mt-4 flex space-x-2">
        {onEdit && mou.status === 'active' && (
          <button onClick={() => onEdit(mou)} className="text-xs px-3 py-1.5 rounded-md bg-white text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Edit</button>
        )}
        {onRenew && (mou.status === 'active' || mou.status === 'expired') && (
          <button onClick={() => onRenew(mou)} className="text-xs px-3 py-1.5 rounded-md bg-brutal-blue text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Renew</button>
        )}
        {onViewActivities && (
          <button onClick={() => onViewActivities(mou)} className="text-xs px-3 py-1.5 rounded-md bg-brutal-green text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">Activities</button>
        )}
      </div>
    </div>
  );
}
