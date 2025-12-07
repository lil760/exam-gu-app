import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminUsersPage({ user, onLogout, onNavigate }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, users]);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      alert('Erreur lors du chargement des utilisateurs');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== 'ALL') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await api.deleteUser(userId);
      alert('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handlePromoteToTeacher = async (userId) => {
    try {
      await api.promoteToTeacher(userId);
      alert('Utilisateur promu enseignant avec succès');
      loadUsers();
    } catch (error) {
      console.error('Erreur promotion:', error);
      alert('Erreur lors de la promotion');
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?')) return;

    try {
      await api.promoteToAdmin(userId);
      alert('Utilisateur promu administrateur avec succès');
      loadUsers();
    } catch (error) {
      console.error('Erreur promotion:', error);
      alert('Erreur lors de la promotion');
    }
  };

  const handleUpdate = async (userId, userData) => {
    try {
      await api.updateUser(userId, userData);
      alert('Utilisateur mis à jour avec succès');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
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
          <div className="nav-item active" onClick={() => onNavigate('admin-users')}>
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
          <h1>Gestion des Utilisateurs</h1>
          <p>Total : {users.length} utilisateurs</p>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <input
            type="search"
            placeholder="Rechercher par email ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="admin-filter-select"
          >
            <option value="ALL">Tous les rôles</option>
            <option value="ROLE_ADMIN">Administrateurs</option>
            <option value="ROLE_TEACHER">Enseignants</option>
            <option value="ROLE_STUDENT">Étudiants</option>
          </select>
          <button
            className="admin-btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Créer un utilisateur
          </button>
        </div>

        {/* Users Table */}
        <div className="admin-content-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Rôle</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.lastName}</td>
                  <td>{u.firstName}</td>
                  <td>
                    <span className={`role-badge ${u.role?.toLowerCase().replace('role_', '')}`}>
                      {u.role?.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => setEditingUser(u)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      {u.role === 'ROLE_STUDENT' && (
                        <button
                          className="admin-action-btn promote"
                          onClick={() => handlePromoteToTeacher(u.id)}
                          title="Promouvoir en Enseignant"
                        >
                          🎓
                        </button>
                      )}
                      {u.role === 'ROLE_TEACHER' && (
                        <button
                          className="admin-action-btn promote"
                          onClick={() => handlePromoteToAdmin(u.id)}
                          title="Promouvoir en Admin"
                        >
                          👑
                        </button>
                      )}
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(u.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="no-data">Aucun utilisateur trouvé</div>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadUsers}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={(userData) => handleUpdate(editingUser.id, userData)}
        />
      )}
    </div>
  );
}

// Modal Créer Utilisateur
function CreateUserModal({ onClose, onSuccess }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: e.target.role.value
    };

    try {
      await api.createUser(formData);
      alert('Utilisateur créé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Créer un utilisateur</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input type="text" name="firstName" required />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="lastName" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" required minLength="8" />
          </div>
          <div className="form-group">
            <label>Rôle</label>
            <select name="role" required>
              <option value="">-- Choisir --</option>
              <option value="ROLE_STUDENT">Étudiant</option>
              <option value="ROLE_TEACHER">Enseignant</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="admin-btn-primary">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal Modifier Utilisateur
function EditUserModal({ user, onClose, onUpdate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value
    };
    onUpdate(userData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier l'utilisateur</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input type="text" name="firstName" defaultValue={user.firstName} required />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="lastName" defaultValue={user.lastName} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" defaultValue={user.email} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="admin-btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}