import React from 'react';

export default function ResetPasswordPage({ onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Lien envoyé (démo)');
  };

  return (
    <div className="login-container">
      <main className="card">
        <div className="brand">
          <img src="/assets/logo.png" alt="EXAM GU" />
        </div>

        <h1>Réinitialiser le mot de passe</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Adresse courriel</label>
            <input
              className="input"
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              required
            />
          </div>
          <div className="login-actions">
            <div></div>
            <button type="submit" className="btn-primary">Envoyer le lien</button>
            <button type="button" className="link" onClick={() => onNavigate('login')}>
              Retour
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
