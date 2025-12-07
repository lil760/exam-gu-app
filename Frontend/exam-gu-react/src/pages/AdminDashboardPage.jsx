import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboardPage({ user, onLogout, onNavigate }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    activeExams: 0,
    recentLogins: 0
  });
  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersData, historyData] = await Promise.all([
        api.getAllUsers(),
        api.getLoginHistory()
      ]);

      setUsers(usersData);
      setLoginHistory(historyData.slice(0, 10)); // 10 dernières connexions

      setStats({
        totalUsers: usersData.length,
        totalExams: 156, // TODO: Récupérer depuis l'API
        activeExams: 23,
        recentLogins: historyData.filter(h => {
          const loginDate = new Date(h.loginTime);
          const today = new Date();
          return loginDate.toDateString() === today.toDateString();
        }).length
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setLoading(false);
    }
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
          <div className="user-info">
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                {user?.email || 'Administrateur'}
              </div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="nav-section">
          <div className="nav-title">Menu Principal</div>
          <div className="nav-item active" onClick={() => onNavigate('admin-dashboard')}>
            <span className="nav-icon">📊</span>
            <span>Tableau de bord</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate('admin-users')}>
            <span className="nav-icon">👥</span>
            <span>Utilisateurs</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate('admin-login-history')}>
            <span className="nav-icon">📋</span>
            <span>Historique Connexions</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="page-header">
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de la plateforme EXAM-GU</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Total Utilisateurs</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
          </div>

          <div className="admin-stat-card green">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-label">Examens Actifs</div>
              <div className="stat-value">{stats.activeExams}</div>
            </div>
          </div>

          <div className="admin-stat-card purple">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-label">Total Examens</div>
              <div className="stat-value">{stats.totalExams}</div>
            </div>
          </div>

          <div className="admin-stat-card orange">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <div className="stat-label">Connexions Aujourd'hui</div>
              <div className="stat-value">{stats.recentLogins}</div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="admin-content-card">
          <div className="card-header">
            <h2 className="card-title">Utilisateurs Récents</h2>
            <button 
              className="card-action"
              onClick={() => onNavigate('admin-users')}
            >
              Voir tout →
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Login History */}
        <div className="admin-content-card">
          <div className="card-header">
            <h2 className="card-title">Connexions Récentes</h2>
            <button 
              className="card-action"
              onClick={() => onNavigate('admin-login-history')}
            >
              Voir tout →
            </button>
          </div>
          <div className="activity-feed">
            {loginHistory.map((history, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon green">✓</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{history.email}</strong> s'est connecté
                  </div>
                  <div className="activity-details">
                    {history.ipAddress} • {history.userAgent?.substring(0, 50)}...
                  </div>
                  <div className="activity-time">
                    {new Date(history.loginTime).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}