import { useState } from 'react';
import api from '../../hooks/useApi';
import { ACTIVITY_TYPES } from '../../utils/constants';

export default function ActivityLogForm({ mouId, onActivityLogged }) {
  const [form, setForm] = useState({ type: '', description: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/activities', { mouId, ...form });
      setForm({ type: '', description: '', date: '' });
      onActivityLogged?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brutal-bg rounded-md p-4 space-y-3 border-2 border-black">
      <h4 className="text-sm font-bold text-black">Log Activity</h4>
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <select name="type" required value={form.type} onChange={handleChange}
          className="rounded-md border-2 border-black px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
          <option value="">Activity type</option>
          {ACTIVITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input type="date" name="date" required value={form.date} onChange={handleChange}
          className="rounded-md border-2 border-black px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
      </div>
      <textarea name="description" required rows={2} placeholder="Describe the activity..." value={form.description} onChange={handleChange}
        className="w-full rounded-md border-2 border-black px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
      <button type="submit" disabled={loading}
        className="bg-brutal-green text-black px-4 py-1.5 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all">
        {loading ? 'Logging...' : 'Log Activity'}
      </button>
    </form>
  );
}
