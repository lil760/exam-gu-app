// PLUS DE API_BASE POUR ÉVITER CORS
// Toutes les requêtes passent maintenant par le proxy Vite (/api)

export const api = {

  async login(email, password) {
    console.log('🔵 Tentative de connexion:', { email });
    
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('🔵 Statut de la réponse:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Erreur backend:', errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorText);
        } catch (e) {
          throw new Error(errorText || `Erreur ${res.status}`);
        }
      }

      const data = await res.json();
      console.log('✅ Réponse du backend:', data);

      if (!data.token) {
        throw new Error('Pas de token dans la réponse');
      }

      return {
        token: data.token,
        user: {
          email,
          authorities: data.authorities || [],
          role: data.authorities?.[0] || "USER"
        }
      };

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      throw error;
    }
  },

  async register(userData) {
    console.log('🔵 Tentative d\'inscription:', userData);

    try {
      const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password
        })
      });

      console.log('🔵 Statut de la réponse:', res.status);

      if (res.status === 201) {
        return { success: true };
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Erreur backend:', errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorText);
        } catch (e) {
          throw new Error(errorText || `Erreur ${res.status}`);
        }
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  async getExams() {
    const token = localStorage.getItem('token');
    console.log('🔵 Récupération des examens avec token:', token ? 'présent' : 'absent');

    const res = await fetch(`/api/exams`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur chargement examens:', res.status);
      throw new Error('Erreur chargement examens');
    }

    return await res.json();
  },

  async createExam(examData) {
    const token = localStorage.getItem('token');
    console.log('🔵 Création d\'examen avec token:', token ? 'présent' : 'absent');

    const res = await fetch(`/api/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(examData)
    });

    if (!res.ok) {
      console.error('❌ Erreur création examen:', res.status);
      throw new Error('Erreur création examen');
    }

    return await res.json();
  },

  async deleteExam(id) {
    const token = localStorage.getItem('token');
    console.log('🔵 Suppression examen avec token:', token ? 'présent' : 'absent');

    const res = await fetch(`/api/exams/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur suppression:', res.status);
      throw new Error('Erreur suppression');
    }

    return true;
  }
};
