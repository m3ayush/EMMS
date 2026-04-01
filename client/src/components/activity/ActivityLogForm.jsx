import { useState } from 'react';
import api from '../../hooks/useApi';
import { ACTIVITY_TYPES } from '../../utils/constants';

export default function ActivityLogForm({ mouId, onActivityLogged }) {
  const [form, setForm] = useState({ type: '', description: '', date: '' });
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadError('');
    setUploadFileName(file.name);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/uploads/activity-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachmentUrl(data.data.url);
    } catch {
      setUploadError('Upload failed. Please try again.');
      setUploadFileName('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/activities', { mouId, ...form, attachmentUrl: attachmentUrl || undefined });
      setForm({ type: '', description: '', date: '' });
      setAttachmentUrl('');
      setUploadFileName('');
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

      {/* Optional attachment */}
      <div>
        <label className="block text-xs font-bold text-black mb-1">Attachment (optional — photo or document)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-black file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-2 file:border-black file:text-xs file:font-bold file:bg-white file:text-black file:cursor-pointer hover:file:bg-gray-100 disabled:opacity-50"
        />
        {uploading && <p className="text-xs font-bold text-gray-500 mt-1">Uploading {uploadFileName}...</p>}
        {!uploading && uploadFileName && !uploadError && (
          <p className="text-xs font-bold text-black mt-1">Attached: {uploadFileName}</p>
        )}
        {uploadError && <p className="text-xs font-bold text-red-600 mt-1">{uploadError}</p>}
      </div>

      <button type="submit" disabled={loading || uploading}
        className="bg-brutal-green text-black px-4 py-1.5 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all">
        {loading ? 'Logging...' : 'Log Activity'}
      </button>
    </form>
  );
}
