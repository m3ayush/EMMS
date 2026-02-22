import { useState, useEffect } from 'react';
import api from '../../hooks/useApi';
import OrgSearchBar from '../../components/organisation/OrgSearchBar';
import OrgCard from '../../components/organisation/OrgCard';
import MouCard from '../../components/mou/MouCard';
import { Link } from 'react-router-dom';

export default function OrgMouReviewPage() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgMous, setOrgMous] = useState([]);

  useEffect(() => { handleSearch({}); }, []);

  const handleSearch = async ({ search, type }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      const res = await api.get(`/organisations?${params}`);
      setOrgs(res.data.data.orgs);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleOrgClick = async (org) => {
    setSelectedOrg(org);
    try {
      const res = await api.get(`/admin/organisations/${org._id}/mous`);
      setOrgMous(res.data.data);
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-black mb-6">Organisation MoU Review</h1>

      <OrgSearchBar onSearch={handleSearch} />

      {selectedOrg && (
        <div className="mt-6 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-black text-black">{selectedOrg.name}</h2>
              <p className="text-sm text-gray-600 font-bold capitalize">{selectedOrg.type}</p>
            </div>
            <button onClick={() => setSelectedOrg(null)} className="text-sm font-bold text-black bg-white border-2 border-black px-3 py-1 rounded-md hover:bg-red-400 transition-all">Close</button>
          </div>
          <h3 className="text-sm font-black text-black mb-3">All MoUs ({orgMous.length})</h3>
          {orgMous.length === 0 ? (
            <p className="text-sm text-gray-600 font-medium">No MoUs found for this organisation.</p>
          ) : (
            <div className="space-y-3">
              {orgMous.map((mou) => (
                <MouCard key={mou._id} mou={mou} showFaculty />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-600 font-medium col-span-full text-center py-8">Loading...</p>
        ) : orgs.length === 0 ? (
          <p className="text-gray-600 font-medium col-span-full text-center py-8">No organisations found.</p>
        ) : (
          orgs.map((org) => <OrgCard key={org._id} org={org} onClick={() => handleOrgClick(org)} />)
        )}
      </div>
    </div>
  );
}
