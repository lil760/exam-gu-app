import React, { useState } from 'react';

export default function Topbar({
  user,
  onLogout,
  onNavigate,
  showSearch = false,
  searchQuery = '',
  onSearchChange = () => {},
  currentPage
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isStudent =
    user?.authorities?.includes("ROLE_STUDENT") ||
    user?.role === "ROLE_STUDENT";

  const goHome = () => {
    if (isStudent) {
      onNavigate("student-home");
    } else {
      onNavigate("home");
    }
  };

  // Masquer *uniquement* le bouton Accueil sur student-home
  const hideHomeButton = isStudent && currentPage === "student-home";

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getUserName = (email) => {
    if (!email) return 'Utilisateur';
    return email.split('@')[0];
  };

  return (
    <header className="topbar">
      <div className="topbar-left">

        {/* Logo → doit TOUJOURS apparaître */}
        <div className="brand-circle" onClick={goHome}>
          <img src="/assets/logo.png" alt="EXAM GU" />
        </div>

        {/* Bouton Accueil → seulement si pas sur student-home */}
        {!hideHomeButton && (
          <div className="home-link" onClick={goHome}>
            <span className="icon-home"></span>
            <span>Accueil</span>
          </div>
        )}

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
          <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
            <span>Bonjour, <strong>{getUserName(user?.email)}</strong></span>
            <span className="avatar">{getInitials(user?.email)}</span>
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
