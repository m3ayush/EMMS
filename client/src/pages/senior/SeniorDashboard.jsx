import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../hooks/useApi';
import ProfileCard from '../../components/dashboard/ProfileCard';
import DepartmentBreakdown from '../../components/dashboard/DepartmentBreakdown';
import { daysSince } from '../../utils/dateHelpers';

export default function SeniorDashboard() {
  const [stats, setStats] = useState(null);
  const [inactiveFaculty, setInactiveFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, inactiveRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/inactive-faculty'),
        ]);
        setStats(statsRes.data.data);
        setInactiveFaculty(inactiveRes.data.data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard mouCount={stats?.totalMous} />
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-brutal-blue rounded-lg p-4 border-2 border-black shadow-[3px_3px_0px_0px_black]">
              <p className="text-3xl font-black text-black">{stats?.totalMous ?? 0}</p>
              <p className="text-sm font-bold text-black">Total MoUs</p>
            </div>
            <div className="bg-brutal-green rounded-lg p-4 border-2 border-black shadow-[3px_3px_0px_0px_black]">
              <p className="text-3xl font-black text-black">{stats?.activeMous ?? 0}</p>
              <p className="text-sm font-bold text-black">Active</p>
            </div>
            <div className="bg-red-400 rounded-lg p-4 border-2 border-black shadow-[3px_3px_0px_0px_black]">
              <p className="text-3xl font-black text-black">{stats?.expiredMous ?? 0}</p>
              <p className="text-sm font-bold text-black">Expired</p>
            </div>
          </div>
        </div>
      </div>

      <DepartmentBreakdown departments={stats?.departments} />

      {/* Inactive Faculty */}
      <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
        <h3 className="text-lg font-black text-black mb-4">
          Inactive Faculty (No interaction in 90+ days)
        </h3>
        {inactiveFaculty.length === 0 ? (
          <p className="text-sm text-gray-600 font-medium">All faculty are active. No inactivity detected.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 text-black font-bold">Faculty</th>
                  <th className="text-left py-2 text-black font-bold">Department</th>
                  <th className="text-left py-2 text-black font-bold">Stale MoUs</th>
                  <th className="text-center py-2 text-black font-bold">Max Inactive Days</th>
                  <th className="text-right py-2 text-black font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {inactiveFaculty.map((item) => (
                  <tr key={item.faculty._id} className="border-b-2 border-black/20">
                    <td className="py-3">
                      <Link to={`/senior/faculty/${item.faculty._id}`} className="text-black font-bold underline decoration-2 hover:bg-brutal-primary">
                        {item.faculty.name}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-700 font-medium">{item.faculty.department}</td>
                    <td className="py-3 text-gray-700 font-medium">{item.staleMous.length} MoU(s)</td>
                    <td className="py-3 text-center">
                      <span className="text-red-600 font-bold">{item.maxInactiveDays} days</span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/senior/faculty/${item.faculty._id}`}
                        className="text-xs px-3 py-1.5 rounded-md bg-brutal-primary text-black font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
