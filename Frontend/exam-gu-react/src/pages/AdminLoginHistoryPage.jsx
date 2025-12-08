import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminLoginHistoryPage({ user, onLogout, onNavigate }) {
  const [loginHistory, setLoginHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoginHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [searchQuery, loginHistory]);

  const loadLoginHistory = async () => {
    try {
      const data = await api.getLoginHistory();
      setLoginHistory(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      alert('Erreur lors du chargement de l\'historique');
      setLoading(false);
    }
  };

  const loadUserHistory = async (userId) => {
    try {
      const data = await api.getUserLoginHistory(userId);
      setSelectedUser({ userId, history: data });
    } catch (error) {
      console.error('Erreur chargement historique utilisateur:', error);
      alert('Erreur lors du chargement');
    }
  };

  const filterHistory = () => {
    if (!searchQuery) {
      setFilteredHistory(loginHistory);
      return;
    }

    const filtered = loginHistory.filter(h =>
      h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ipAddress.includes(searchQuery)
    );
    setFilteredHistory(filtered);
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="admin-page">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="topbar-left">
          <div className="admin-logo">EG</div>
          <div className="admin-badge">
            <span>👑</span>
            <span>ADMINISTRATEUR</span>
          </div>
        </div>
        <div className="topbar-right">
          <button className="logout-btn" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="nav-section">
          <div className="nav-title">Menu Principal</div>
          <div className="nav-item" onClick={() => onNavigate('admin-dashboard')}>
            <span className="nav-icon">📊</span>
            <span>Tableau de bord</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate('admin-users')}>
            <span className="nav-icon">👥</span>
            <span>Utilisateurs</span>
          </div>
          <div className="nav-item active" onClick={() => onNavigate('admin-login-history')}>
            <span className="nav-icon">📋</span>
            <span>Historique Connexions</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="page-header">
          <h1>Historique des Connexions</h1>
          <p>Total : {loginHistory.length} connexions enregistrées</p>
        </div>

        {/* Search */}
        <div className="admin-filters">
          <input
            type="search"
            placeholder="Rechercher par email ou IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search"
          />
        </div>

        {/* Login History Table */}
        <div className="admin-content-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Heure</th>
                <th>Email</th>
                <th>Adresse IP</th>
                <th>Navigateur</th>
                <th>Succès</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((history, index) => (
                <tr key={index}>
                  <td>{new Date(history.loginTime).toLocaleString('fr-FR')}</td>
                  <td><strong>{history.email}</strong></td>
                  <td><code>{history.ipAddress}</code></td>
                  <td className="truncate" title={history.userAgent}>
                    {history.userAgent?.substring(0, 50)}...
                  </td>
                  <td>
                    <span className={`status-badge ${history.success ? 'success' : 'failed'}`}>
                      {history.success ? '✓ Succès' : '✗ Échec'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-action-btn view"
                      onClick={() => loadUserHistory(history.userId)}
                      title="Voir historique complet"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="no-data">Aucun historique trouvé</div>
          )}
        </div>
      </main>

      {/* User History Detail Modal */}
      {selectedUser && (
        <UserHistoryModal
          userId={selectedUser.userId}
          history={selectedUser.history}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

// Modal Détail Historique Utilisateur
function UserHistoryModal({ userId, history, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Historique complet - Utilisateur #{userId}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Heure</th>
                <th>IP</th>
                <th>Navigateur</th>
                <th>Succès</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, index) => (
                <tr key={index}>
                  <td>{new Date(h.loginTime).toLocaleString('fr-FR')}</td>
                  <td><code>{h.ipAddress}</code></td>
                  <td className="truncate">{h.userAgent}</td>
                  <td>
                    <span className={`status-badge ${h.success ? 'success' : 'failed'}`}>
                      {h.success ? '✓' : '✗'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
