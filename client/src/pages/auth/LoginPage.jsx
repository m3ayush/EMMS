import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import api from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const res = await api.get('/auth/me');
      const user = res.data.data;
      await refreshUser();
      navigate(user.role === 'senior' ? '/senior/dashboard' : '/faculty/dashboard');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Account not registered. Please sign up first.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-black">EMMS</h1>
          <p className="mt-2 text-gray-700 font-medium">MoU Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_black] space-y-6">
          <h2 className="text-xl font-black text-black">Sign In</h2>
          {error && <div className="bg-red-400 text-black text-sm font-bold p-3 rounded-md border-2 border-black">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-black">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-black px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-brutal-primary focus:outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brutal-primary text-black py-2.5 px-4 rounded-md text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-sm text-center text-gray-700 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-bold underline decoration-2 hover:bg-brutal-primary">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
