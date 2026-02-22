export default function DepartmentBreakdown({ departments }) {
  if (!departments || Object.keys(departments).length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
        <h3 className="text-lg font-black text-black mb-4">MoUs by Department</h3>
        <p className="text-gray-600 text-sm font-medium">No data available.</p>
      </div>
    );
  }

  const entries = Object.entries(departments).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
      <h3 className="text-lg font-black text-black mb-4">MoUs by Department</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 text-black font-bold">Department</th>
              <th className="text-center py-2 text-black font-bold">Active</th>
              <th className="text-center py-2 text-black font-bold">Expired</th>
              <th className="text-center py-2 text-black font-bold">Renewed</th>
              <th className="text-center py-2 text-black font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([dept, counts]) => (
              <tr key={dept} className="border-b-2 border-black/20">
                <td className="py-2 font-bold text-black">{dept}</td>
                <td className="py-2 text-center font-bold text-green-700">{counts.active}</td>
                <td className="py-2 text-center font-bold text-red-600">{counts.expired}</td>
                <td className="py-2 text-center font-bold text-blue-600">{counts.renewed}</td>
                <td className="py-2 text-center font-black text-black">{counts.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
