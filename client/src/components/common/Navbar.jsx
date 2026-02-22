import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const isSenior = currentUser.role === 'senior';

  const navLinks = isSenior
    ? [
        { to: '/senior/dashboard', label: 'Dashboard' },
        { to: '/senior/organisations', label: 'Organisation Review' },
      ]
    : [
        { to: '/faculty/dashboard', label: 'Dashboard' },
        { to: '/faculty/submit-mou', label: 'Submit MoU' },
        { to: '/faculty/mous', label: 'My MoUs' },
        { to: '/faculty/organisations', label: 'Organisations' },
      ];

  return (
    <nav className="bg-brutal-primary border-b-3 border-black shadow-[0_4px_0px_0px_black]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isSenior ? '/senior/dashboard' : '/faculty/dashboard'} className="text-2xl font-black text-black">
              EMMS
            </Link>
            <div className="hidden sm:flex sm:ml-8 sm:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${
                    location.pathname === link.to
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-black/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-black">
              <span className="font-bold">{currentUser.name}</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-md bg-black text-white font-bold capitalize">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-sm font-bold text-black bg-white border-2 border-black px-3 py-1 rounded-md shadow-[3px_3px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden flex space-x-1 pb-2 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                location.pathname === link.to
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
