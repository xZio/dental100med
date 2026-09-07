import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * adminOnly — раздел не для администратора клиники (менеджера): он ведёт только
 * заявки. Не показываем «нет доступа», а просто уводим на его рабочий экран.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/admin/appointments" replace />;

  return children;
}
