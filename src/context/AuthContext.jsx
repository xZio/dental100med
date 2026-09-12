import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Роль и почта лежат в самом токене — отдельно их не храним, иначе они
 * разъедутся с токеном. Подпись проверяет сервер; здесь payload нужен только
 * чтобы показать нужные пункты меню и имя вошедшего.
 */
function readPayload(token) {
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { role: payload.role ?? 'admin', email: payload.email ?? null };
  } catch {
    return {};
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

  const { role = null, email = null } = readPayload(token);

  return (
    <AuthContext.Provider
      value={{ token, role, email, isAdmin: role === 'admin', isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
