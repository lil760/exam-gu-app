// PLUS DE API_BASE POUR ÉVITER CORS
// Toutes les requêtes passent maintenant par le proxy Vite (/api)
function normalizeUserResponse(u) {
  const role = u.authorities?.[0]?.authority || "ROLE_ETUDIANT";
  let firstName = "";
  let lastName = "";

  if (u.name && u.name.includes(" ")) {
    const parts = u.name.split(" ");
    firstName = parts[0];
    lastName = parts.slice(1).join(" ");
  }

  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName,
    role,
    createdAt: u.createdAt || null
  };
}

export const api = {

  
 // ==================== AUTH ====================
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

        // ⬇️⬇️⬇️ AJOUTEZ CES LIGNES POUR SAUVEGARDER LE TOKEN ⬇️⬇️⬇️
        const userObject = {
          id: data.id,
          email,
          authorities: Array.isArray(data.authorities) ? data.authorities : [],
          role: data.authorities?.[0]?.authority || data.authorities?.[0] || "ROLE_ETUDIANT"
        };

        // Sauvegarder le token dans localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(userObject));
        
        console.log('✅ Token sauvegardé:', data.token);
        console.log('✅ User sauvegardé:', userObject);
        // ⬆️⬆️⬆️ FIN DE L'AJOUT ⬆️⬆️⬆️

        return {
          token: data.token,
          user: userObject
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

  // ==================== EXAMENS (ENSEIGNANT) ====================
  async getExams() {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('🔵 Récupération des examens pour enseignant:', currentUser?.id);
    
    const res = await fetch(`/api/exams/teacher/${currentUser.id}`, {
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
  },


  // ==================== ÉTUDIANTS ====================

  async getAvailableExams() {
    const token = localStorage.getItem('token');
    console.log('🔵 Récupération examens disponibles');

    const res = await fetch(`/api/student/exams/available`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur chargement examens disponibles:', res.status);
      throw new Error('Erreur chargement examens disponibles');
    }

    return await res.json();
  },

  async registerForExam(examId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Inscription à l\'examen:', examId);

    const res = await fetch(`/api/student/exams/${examId}/register`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur inscription examen:', res.status);
      throw new Error('Erreur inscription à l\'examen');
    }

    return await res.json();
  },

  async startExam(examId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Démarrage de l\'examen:', examId);

    const res = await fetch(`/api/student/exams/${examId}/start`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur démarrage examen:', res.status);
      throw new Error('Erreur démarrage de l\'examen');
    }

    return await res.json();
  },

  async getExamForStudent(examId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Chargement de l\'examen:', examId);

    const res = await fetch(`/api/student/exams/${examId}/take`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('❌ Erreur chargement examen:', res.status);
      throw new Error('Erreur chargement de l\'examen');
    }

    return await res.json();
  },

  async submitExamAnswers(examId, answers) {
    const token = localStorage.getItem('token');
    console.log('🔵 Soumission des réponses pour l\'examen:', examId);

    const res = await fetch(`/api/student/exams/${examId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ answers })
    });

    if (!res.ok) {
      console.error('❌ Erreur soumission:', res.status);
      throw new Error('Erreur lors de la soumission');
    }

    return await res.json();
  },

  // Nouvelle fonction ♦️ CORRECTEMENT INTÉGRÉE ♦️
  async getStudentAvailableExams(studentId) {
    console.log("🔵 Récupération examens disponibles pour étudiant:", studentId);

    const res = await fetch(`/api/exams/student/${studentId}/available`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des examens disponibles");
    }

    return await res.json();
  },


  // ==================== ADMIN ====================
  async getAllUsers() {
    const token = localStorage.getItem('token');
    console.log('🔵 Récupération de tous les utilisateurs');
  
    const res = await fetch(`/api/admin`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur chargement utilisateurs:', res.status);
      throw new Error('Erreur chargement des utilisateurs');
    }
  
    return await res.json();
  },

  async createUser(userData) {
    const token = localStorage.getItem('token');
    console.log('🔵 Création d\'un utilisateur:', userData);
  
    const res = await fetch(`/api/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  
    if (!res.ok) {
      console.error('❌ Erreur création utilisateur:', res.status);
      throw new Error('Erreur lors de la création');
    }
  
    return await res.json();
  },

  async updateUser(userId, userData) {
    const token = localStorage.getItem('token');
    console.log('🔵 Mise à jour utilisateur:', userId, userData);
  
    const res = await fetch(`/api/admin/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  
    if (!res.ok) {
      console.error('❌ Erreur mise à jour utilisateur:', res.status);
      throw new Error('Erreur lors de la mise à jour');
    }
  
    return await res.json();
  },

  async deleteUser(userId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Suppression utilisateur:', userId);
  
    const res = await fetch(`/api/admin/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur suppression utilisateur:', res.status);
      throw new Error('Erreur lors de la suppression');
    }
  
    return true;
  },

  async promoteToTeacher(userId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Promotion en enseignant:', userId);
  
    const res = await fetch(`/api/admin/${userId}/role/teacher`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur promotion enseignant:', res.status);
      throw new Error('Erreur lors de la promotion');
    }
  
    return await res.json();
  },

  async promoteToAdmin(userId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Promotion en admin:', userId);
  
    const res = await fetch(`/api/admin/${userId}/role/admin`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur promotion admin:', res.status);
      throw new Error('Erreur lors de la promotion');
    }
  
    return await res.json();
  },

  async getLoginHistory() {
    const token = localStorage.getItem('token');
    console.log('🔵 Récupération historique des connexions');
  
    const res = await fetch(`/api/admin/login-history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur chargement historique:', res.status);
      throw new Error('Erreur chargement de l\'historique');
    }
  
    return await res.json();
  },

  async getUserLoginHistory(userId) {
    const token = localStorage.getItem('token');
    console.log('🔵 Récupération historique utilisateur:', userId);
  
    const res = await fetch(`/api/admin/login-history/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  
    if (!res.ok) {
      console.error('❌ Erreur chargement historique utilisateur:', res.status);
      throw new Error('Erreur chargement de l\'historique');
    }
  
    return await res.json();
  }

};
