import React, { useState } from 'react';
import { api } from '../services/api';

export default function SignupModal({ onClose }) {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const password2 = e.target.password2.value;

    // Validations côté client
    if (firstName.length < 3) {
      setError('Le prénom doit contenir au moins 3 caractères');
      return;
    }

    if (lastName.length < 3) {
      setError('Le nom doit contenir au moins 3 caractères');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };

    try {
      await api.register(formData);
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      onClose();
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError(err.message || 'Erreur lors de la création du compte');
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
              Prénom (min. 3 caractères)
              <input 
                type="text" 
                name="firstName" 
                required 
                minLength="3"
                maxLength="30"
              />
            </label>
            <label>
              Nom (min. 3 caractères)
              <input 
                type="text" 
                name="lastName" 
                required 
                minLength="3"
                maxLength="30"
              />
            </label>
          </div>

          <label>
            Courriel
            <input type="email" name="email" required />
          </label>

          <div className="grid-2">
            <label>
              Mot de passe (min. 8 caractères)
              <input 
                type="password" 
                name="password" 
                required 
                minLength="8" 
                maxLength="30"
              />
            </label>
            <label>
              Confirmer le mot de passe
              <input 
                type="password" 
                name="password2" 
                required 
                minLength="8" 
                maxLength="30"
              />
            </label>
          </div>

          {error && (
            <p className="form-hint" style={{ display: 'block' }}>
              {error}
            </p>
          )}

          <div className="modal__actions">
            <button type="submit" className="btn-primary">Créer le compte</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}