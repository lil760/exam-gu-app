import React from "react";
 
export default function ChooseRolePage({ user, onChooseRole }) {

  const roles = user?.authorities || [];
 
  return (
<div className="choose-role-container">
<h1>Choisissez votre rôle</h1>
 
      {roles.length === 0 && <p>Aucun rôle trouvé.</p>}
 
      <div className="role-buttons">

        {roles.map((role, index) => (
<button

            key={index}

            className="role-btn"

            onClick={() => onChooseRole(role)}
>

            {role === "ROLE_ADMIN" && "Administrateur"}

            {role === "ROLE_ENSEIGNANT" && "Enseignant"}

            {role === "ROLE_ETUDIANT" && "Étudiant"}

            {role !== "ROLE_ADMIN" &&

              role !== "ROLE_ENSEIGNANT" &&

              role !== "ROLE_ETUDIANT" &&

              role}
</button>

        ))}
</div>
</div>

  );

}

 