const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

export const api = {
  getServices:    () => request('/services'),
  getDoctors:     () => request('/doctors'),
  getPromotions:  () => request('/promotions'),
  sendAppointment: (data) =>
    fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
};
