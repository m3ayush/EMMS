const colors = {
  active: 'bg-brutal-green text-black',
  expired: 'bg-red-400 text-black',
  renewed: 'bg-brutal-blue text-black',
  terminated: 'bg-gray-300 text-black',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold capitalize border-2 border-black ${colors[status] || 'bg-gray-300 text-black'}`}>
      {status}
    </span>
  );
}
