export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Active MoUs', value: stats.active, color: 'text-black bg-brutal-green' },
    { label: 'Expired', value: stats.expired, color: 'text-black bg-red-400' },
    { label: 'Renewed', value: stats.renewed, color: 'text-black bg-brutal-blue' },
    { label: 'Total', value: stats.total, color: 'text-black bg-brutal-primary' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-lg p-4 border-2 border-black shadow-[3px_3px_0px_0px_black] ${item.color}`}>
          <p className="text-3xl font-black">{item.value ?? 0}</p>
          <p className="text-sm font-bold">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
