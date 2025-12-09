import React from 'react';

export default function ChooseRolePage({ user, onChooseRole, onBack }) {
  // Récupération robuste
  const roles = Array.isArray(user?.authorities) 
    ? user.authorities.filter(r => !!r)  // retire null / undefined
    : [];

  // Convertir un ROLE_XX vers texte lisible
  const formatRole = (role) => {
    if (!role || typeof role !== "string") {
      return "Rôle inconnu";  // sécurité contre null
    }

    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_ENSEIGNANT':
      case 'ROLE_TEACHER':
        return 'Enseignant';
      case 'ROLE_ETUDIANT':
      case 'ROLE_STUDENT':
        return 'Étudiant';
      default:
        return role
          .replace('ROLE_', '')
          .toLowerCase()
          .replace(/^\w/, c => c.toUpperCase());
    }
  };

  // Obtenir la classe CSS selon le rôle
  const getRoleClass = (role) => {
    if (!role) return 'student'; // sécurité

    switch (role) {
      case 'ROLE_ADMIN':
        return 'admin';
      case 'ROLE_ENSEIGNANT':
      case 'ROLE_TEACHER':
        return 'teacher';
      case 'ROLE_ETUDIANT':
      case 'ROLE_STUDENT':
        return 'student';
      default:
        return 'student';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="choose-role-container">

        {/* Bouton Retour */}
        <button 
          className="back-button" 
          onClick={onBack}
          title="Retour à la connexion"
        >
          ←
        </button>

        <h1 className="choose-role-title">Choisissez votre rôle</h1>
        <p className="choose-role-subtitle">
          Sélectionnez le rôle avec lequel vous souhaitez vous connecter
        </p>

        {roles.length === 0 && (
          <p className="no-role-text">Aucun rôle trouvé pour ce compte.</p>
        )}

        <div className="role-buttons">
          {roles.map((role, index) => (
            <button
              key={index}
              className={`role-btn ${getRoleClass(role)}`}
              onClick={() => onChooseRole(role)}
            >
              {formatRole(role)}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}