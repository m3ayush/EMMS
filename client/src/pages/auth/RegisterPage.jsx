import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import api from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { DEPARTMENTS } from '../../utils/constants';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    role: 'faculty',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await api.post('/auth/register', {
        name: form.name,
        department: form.department,
        designation: form.designation,
        role: form.role,
        phone: form.phone,
      });
      await refreshUser();
      navigate(form.role === 'senior' ? '/senior/dashboard' : '/faculty/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-black">EMMS</h1>
          <p className="mt-2 text-gray-700 font-medium">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_black] space-y-5">
          {error && <div className="bg-red-400 text-black text-sm font-bold p-3 rounded-md border-2 border-black">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-black">Full Name</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Department</label>
            <select name="department" required value={form.department} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Designation</label>
            <input type="text" name="designation" required placeholder="e.g. Assistant Professor" value={form.designation} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white">
              <option value="faculty">Faculty</option>
              <option value="senior">Management</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Phone (optional)</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <p className="text-sm text-center text-gray-700 font-medium">
            Already have an account? <Link to="/login" className="text-black font-bold underline decoration-2 hover:bg-brutal-primary">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
