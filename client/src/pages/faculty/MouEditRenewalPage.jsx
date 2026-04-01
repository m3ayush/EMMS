import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../hooks/useApi';
import MouCard from '../../components/mou/MouCard';

export default function MouEditRenewalPage() {
  const [searchParams] = useSearchParams();
  const [mous, setMous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    const fetchMous = async () => {
      try {
        const params = filter ? `?status=${filter}` : '';
        const res = await api.get(`/mous${params}`);
        setMous(res.data.data.mous);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchMous();
  }, [filter]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-3 border-black"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-black">My MoUs</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-2 border-black px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="renewed">Renewed</option>
        </select>
      </div>

      {mous.length === 0 ? (
        <p className="text-gray-600 font-medium text-center py-8">No MoUs found.</p>
      ) : (
        <div className="space-y-4">
          {mous.map((mou) => (
            <MouCard key={mou._id} mou={mou} linkTo={`/faculty/mous/${mou._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
