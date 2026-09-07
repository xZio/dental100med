import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Роль лежит в самом токене — отдельно её не храним, иначе она разъедется
 * с токеном. Подпись проверяет сервер; здесь payload нужен только чтобы
 * показать нужные пункты меню.
 */
function readRole(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role ?? 'admin';
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const login = (t) => {
    localStorage.setItem('admin_token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const role = readRole(token);

  return (
    <AuthContext.Provider
      value={{ token, role, isAdmin: role === 'admin', isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
