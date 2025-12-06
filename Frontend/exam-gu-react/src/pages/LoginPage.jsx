import React, { useState } from 'react';
import SignupModal from '../components/SignupModal';
import { api } from '../services/api';

export default function LoginPage({ onLogin, onNavigate }) {
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Validation côté client
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Échec de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <main className="card">
        <div className="brand">
          <img src="/assets/logo.png" alt="EXAM GU" />
        </div>

        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">
              Identifiant ou adresse courriel
            </label>
            <input
              className="input"
              id="email"
              name="email"
              type="email"
              placeholder="enseignant@exemple.com"
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength="8"
              required
            />
          </div>

          {error && (
            <p style={{ color: '#b91c1c', textAlign: 'center', margin: '10px 0' }}>
              {error}
            </p>
          )}

          <div className="login-actions">
            <button 
              type="button" 
              className="link" 
              onClick={() => setShowSignup(true)}
            >
              Créer un compte
            </button>
            <button 
              type="submit" 
              className="btn-primary big" 
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <button 
              type="button" 
              className="link" 
              onClick={() => onNavigate('reset')}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>

        {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      </main>
    </div>
  );
}