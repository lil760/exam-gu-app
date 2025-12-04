const API_BASE = 'http://localhost:8080';

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
    const data = await res.json();
    if (!data.token) throw new Error('Réponse login invalide');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Erreur inscription');
    return await res.json();
  },

  async getExams() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/exams`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur chargement examens');
    return await res.json();
  },

  async createExam(examData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(examData)
    });
    if (!res.ok) throw new Error('Erreur création examen');
    return await res.json();
  },

  async deleteExam(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/api/exams/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur suppression');
    return true;
  }
};
