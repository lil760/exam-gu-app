import React, { useState } from 'react';

export default function Topbar({ user, onLogout, onNavigate, showSearch = false, searchQuery = '', onSearchChange = () => {} }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Extraire les initiales de l'email
  const getInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    return parts.substring(0, 2).toUpperCase();
  };

  // Extraire le nom d'utilisateur de l'email
  const getUserName = (email) => {
    if (!email) return 'Utilisateur';
    return email.split('@')[0];
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-circle" onClick={() => onNavigate('home')}>
          <img src="/assets/logo.png" alt="EXAM GU" />
        </div>
        <div className="home-link" onClick={() => onNavigate('home')}>
          <span className="icon-home"></span>
          <span>Accueil</span>
        </div>
      </div>

      <div className="topbar-right">
        {showSearch && (
          <div className="search">
            <input
              type="search"
              placeholder="Rechercher un examen"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span>
              Bonjour, <strong>{getUserName(user?.email)}</strong>
            </span>
            <span className="avatar">
              {getInitials(user?.email)}
            </span>
          </button>
          {showUserMenu && (
            <ul className="user-dropdown open">
              <li>
                <button className="dropdown-link" onClick={onLogout}>
                  Se déconnecter
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}