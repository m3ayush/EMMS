import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import ProfileCard from '../../components/dashboard/ProfileCard';
import StatsGrid from '../../components/dashboard/StatsGrid';
import UpcomingExpirations from '../../components/dashboard/UpcomingExpirations';

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ active: 0, expired: 0, renewed: 0, total: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [gracePeriods, setGracePeriods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeRes, expiredRes, renewedRes, upcomingRes, gpRes] = await Promise.all([
          api.get('/mous?status=active&limit=1'),
          api.get('/mous?status=expired&limit=1'),
          api.get('/mous?status=renewed&limit=1'),
          api.get('/mous/upcoming-expirations?days=60'),
          api.get('/admin/grace-periods/my'),
        ]);
        setStats({
          active: activeRes.data.data.total,
          expired: expiredRes.data.data.total,
          renewed: renewedRes.data.data.total,
          total: activeRes.data.data.total + expiredRes.data.data.total + renewedRes.data.data.total,
        });
        setUpcoming(upcomingRes.data.data);
        setGracePeriods(gpRes.data.data.filter((gp) => gp.status === 'active'));
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {gracePeriods.length > 0 && (
        <div className="bg-brutal-primary border-2 border-black rounded-lg p-4 shadow-[3px_3px_0px_0px_black]">
          <h3 className="text-sm font-bold text-black">Active Grace Periods</h3>
          <p className="text-xs text-black mt-1">
            You have {gracePeriods.length} active grace period(s). Please log activities for the related MoUs.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard mouCount={stats.total} />
        <div className="lg:col-span-2 space-y-6">
          <StatsGrid stats={stats} />
          <UpcomingExpirations mous={upcoming} />
        </div>
      </div>
    </div>
  );
}
