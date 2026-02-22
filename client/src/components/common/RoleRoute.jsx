import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleRoute({ role, children }) {
  const { currentUser } = useAuth();

  if (currentUser && currentUser.role !== role) {
    const redirect = currentUser.role === 'senior' ? '/senior/dashboard' : '/faculty/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
