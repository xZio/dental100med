const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const getToken = () => localStorage.getItem('admin_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function req(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    return;
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Ошибка ${res.status}`);
  return data;
}

export const adminApi = {
  login: (email, password) =>
    req('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  getServices:    ()        => req('/services'),
  createService:  (data)    => req('/services',    { method: 'POST',   headers: authHeaders(), body: JSON.stringify(data) }),
  updateService:  (id, data)=> req(`/services/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  deleteService:  (id)      => req(`/services/${id}`, { method: 'DELETE', headers: authHeaders() }),

  getDoctors:     ()        => req('/doctors'),
  createDoctor:   (data)    => req('/doctors',     { method: 'POST',   headers: authHeaders(), body: JSON.stringify(data) }),
  updateDoctor:   (id, data)=> req(`/doctors/${id}`,  { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  deleteDoctor:   (id)      => req(`/doctors/${id}`,  { method: 'DELETE', headers: authHeaders() }),

  getPromotions:    ()        => req('/promotions/all', { headers: authHeaders() }),
  createPromotion:  (data)    => req('/promotions',    { method: 'POST',   headers: authHeaders(), body: JSON.stringify(data) }),
  updatePromotion:  (id, data)=> req(`/promotions/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  deletePromotion:  (id)      => req(`/promotions/${id}`, { method: 'DELETE', headers: authHeaders() }),

  getAppointments:        ()           => req('/appointments', { headers: authHeaders() }),
  updateAppointmentStatus:(id, status) => req(`/appointments/${id}/status`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }),
  }),
};
