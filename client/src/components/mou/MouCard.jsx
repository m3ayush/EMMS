import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatDate, daysUntil } from '../../utils/dateHelpers';

export default function MouCard({ mou, linkTo, showFaculty = false }) {
  const days = daysUntil(mou.expiryDate);

  const inner = (
    <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3 className="font-bold text-black">{mou.title}</h3>
            <StatusBadge status={mou.status} />
          </div>
          <p className="text-sm text-gray-600 font-medium mt-1">{mou.organisation?.name}</p>
          {showFaculty && mou.faculty && (
            <p className="text-xs text-gray-500 font-medium mt-0.5">Faculty: {mou.faculty.name} ({mou.faculty.department})</p>
          )}
        </div>
        {mou.signedCopyUrl && !linkTo && (
          <a href={mou.signedCopyUrl} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
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

      {linkTo && (
        <p className="text-xs font-bold text-gray-400 mt-3">Click to view details →</p>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
        {inner}
      </Link>
    );
  }

  return inner;
}
