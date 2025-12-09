import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateExamPage from './pages/CreateExamPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import ExamTakingPage from './pages/ExamTakingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminLoginHistoryPage from './pages/AdminLoginHistoryPage';
import ChooseRolePage from './pages/ChooseRolePage';
import './styles.css';

export default function App() {

  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const handleBackToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login'); // ← Ceci affiche LoginPage.jsx
  };
  // -------------------------------------------------------------------
  // 🔥 Vérifier si utilisateur déjà connecté
  // -------------------------------------------------------------------
  useEffect(() => {
    const token       = localStorage.getItem("token");
    const savedUser   = localStorage.getItem("currentUser");
    const chosenRole  = localStorage.getItem("selectedRole");
    
    // 🔹 Si pas connecté → page login
    if (!token || !savedUser) {handleBackToLogin
      setCurrentPage("login");
      return;
    }

    // 🔹 Restaurer le user
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // ------------------------------------------------------
    // 🔹 Si un rôle avait été choisi précédemment
    // ------------------------------------------------------
    if (chosenRole && parsedUser) {
      if (chosenRole === "ROLE_ADMIN")      setCurrentPage("admin-dashboard");
      else if (chosenRole === "ROLE_ENSEIGNANT") setCurrentPage("home");
      else                                  setCurrentPage("student-home");
      return;
    }

    // ------------------------------------------------------
    // 🔹 Sinon → déterminer par les rôles du backend
    // ------------------------------------------------------
    const roles = parsedUser.authorities || [];

    if (roles.length > 1) {
      setCurrentPage("choose-role");
      return;
    }

    redirectBasedOnRole(roles[0]);

  }, []);

  // -------------------------------------------------------------------
  // 🔥 Redirection selon un rôle
  // -------------------------------------------------------------------
  const redirectBasedOnRole = (role) => {
    if (role === "ROLE_ADMIN")        setCurrentPage("admin-dashboard");
    else if (role === "ROLE_ENSEIGNANT") setCurrentPage("home");
    else                               setCurrentPage("student-home");
  };

  // -------------------------------------------------------------------
  // 🔥 Connexion
  // -------------------------------------------------------------------
  const handleLogin = (userData) => {
    setUser(userData);

    // 📌 Stocker dans localStorage
    localStorage.setItem("currentUser", JSON.stringify(userData));

    const roles = userData.authorities || [];

    // Un seul rôle → redirection directe
    if (roles.length === 1) {
      redirectBasedOnRole(roles[0]);
      return;
    }

    // Plusieurs rôles → choisir
    setCurrentPage("choose-role");
  };

  // -------------------------------------------------------------------
  // 🔥 Quand utilisateur choisit un rôle
  // -------------------------------------------------------------------
  const handleChooseRole = (role) => {
    // 1. Sauvegarder le rôle choisi
    localStorage.setItem("selectedRole", role);
    setSelectedRole(role);
  
    // 2. ⬇️ AJOUTER CECI : Mettre à jour currentUser avec le rôle choisi
    const updatedUser = { ...user, role: role };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  
    // 3. Rediriger
    redirectBasedOnRole(role);
  };

  // -------------------------------------------------------------------
  // 🔥 Déconnexion
  // -------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedRole");
    setUser(null);
    setCurrentPage("login");
  };

  // -------------------------------------------------------------------
  // 🔥 Lancer un examen
  // -------------------------------------------------------------------
  const handleStartExam = (examId) => {
    setSelectedExamId(examId);
    setCurrentPage("exam-taking");
  };

  // -------------------------------------------------------------------
  // 🔥 ROUTEUR MANUEL
  // -------------------------------------------------------------------
  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'reset' && (
        <ResetPasswordPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'choose-role' && (
      <ChooseRolePage 
      user={user} 
      onChooseRole={handleChooseRole}
      onBack={handleBackToLogin} // ← Bouton retour
  />
)}
      {currentPage === 'home' && (
        <HomePage user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'student-home' && (
        <StudentHomePage
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          onStartExam={handleStartExam}
        />
      )}

      {currentPage === 'student-register' && (
        <StudentRegisterPage
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'create-exam' && (
        <CreateExamPage
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'exam-taking' && (
        <ExamTakingPage
          user={user}
          examId={selectedExamId}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'admin-dashboard' && (
        <AdminDashboardPage user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'admin-users' && (
        <AdminUsersPage user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'admin-login-history' && (
        <AdminLoginHistoryPage user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'choose-role' && (
        <ChooseRolePage
          user={user}
          onChooseRole={handleChooseRole}
        />
      )}
    </>
  );
}
