import { Link } from 'react-router-dom';

export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Active MoUs', value: stats.active, color: 'text-black bg-brutal-green', to: '/faculty/mous?status=active' },
    { label: 'Expired', value: stats.expired, color: 'text-black bg-red-400', to: '/faculty/mous?status=expired' },
    { label: 'Renewed', value: stats.renewed, color: 'text-black bg-brutal-blue', to: '/faculty/mous?status=renewed' },
    { label: 'Total', value: stats.total, color: 'text-black bg-brutal-primary', to: '/faculty/mous' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Link key={item.label} to={item.to} className={`block rounded-lg p-4 border-2 border-black shadow-[3px_3px_0px_0px_black] cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${item.color}`}>
          <p className="text-3xl font-black">{item.value ?? 0}</p>
          <p className="text-sm font-bold">{item.label}</p>
        </Link>
      ))}
    </div>
  );
}
