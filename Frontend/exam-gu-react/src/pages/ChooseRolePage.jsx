import React from "react";

export default function ChooseRolePage({ user, onChooseRole }) {

  // Récupération robuste
  const roles = user?.authorities || [];

  // Convertir un ROLE_XX vers texte lisible
  const formatRole = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrateur";
      case "ROLE_ENSEIGNANT":
        return "Enseignant";
      case "ROLE_ETUDIANT":
        return "Étudiant";
      default:
        return role.replace("ROLE_", "").toLowerCase();
    }
  };

  return (
    <div className="choose-role-container">
      <h1 className="choose-role-title">Choisissez votre rôle</h1>

      {roles.length === 0 && (
        <p className="no-role-text">Aucun rôle trouvé pour ce compte.</p>
      )}

      <div className="role-buttons">

        {roles.map((role, index) => (
          <button
            key={index}
            className="role-btn"
            onClick={() => onChooseRole(role)}
          >
            {formatRole(role)}
          </button>
        ))}

      </div>
    </div>
  );
}
