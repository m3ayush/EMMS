import { useState } from 'react';
import { ORG_TYPES } from '../../utils/constants';

export default function OrgSearchBar({ onSearch }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({ search, type });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Search organisations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white"
      />
      <select value={type} onChange={(e) => setType(e.target.value)}
        className="rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
        <option value="">All types</option>
        {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <button type="submit"
        className="bg-brutal-primary text-black px-4 py-2 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
        Search
      </button>
    </form>
  );
}
