import React from 'react';
import { api } from '../services/api';

export default function SignupModal({ onClose }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      username: e.target.username.value,
      password: e.target.password.value,
      password2: e.target.password2.value,
      role: e.target.role.value
    };

    if (formData.password !== formData.password2) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await api.register(formData);
      alert('Compte créé avec succès !');
      onClose();
    } catch (err) {
      alert('Erreur lors de la création du compte: ' + err.message);
    }
  };

  return (
    <div className="modal open">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>×</button>
        <h2 style={{ marginTop: 0 }}>Créer un compte</h2>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="grid-2">
            <label>
              Prénom
              <input type="text" name="firstName" required />
            </label>
            <label>
              Nom
              <input type="text" name="lastName" required />
            </label>
          </div>

          <label>
            Courriel
            <input type="email" name="email" required />
          </label>

          <label>
            Identifiant (pseudo)
            <input type="text" name="username" required />
          </label>

          <div className="grid-2">
            <label>
              Mot de passe
              <input type="password" name="password" required minLength="6" />
            </label>
            <label>
              Confirmer le mot de passe
              <input type="password" name="password2" required minLength="6" />
            </label>
          </div>

          

          <div className="modal__actions">
            <button type="submit" className="btn-primary">Créer le compte</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}