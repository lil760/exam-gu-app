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

  // ---------------------------------------------------------
  // 🔥 Vérifier si utilisateur déjà connecté
  // ---------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (!token || !savedUser) return;

    const parsed = JSON.parse(savedUser);
    setUser(parsed);

    const roles = parsed.authorities || [];

    if (roles.length > 1) {
      setCurrentPage("choose-role");
      return;
    }

    redirectBasedOnRole(roles[0]);
  }, []);

  // ---------------------------------------------------------
  // 🔥 Fonction utilitaire pour rediriger selon un rôle
  // ---------------------------------------------------------
  const redirectBasedOnRole = (role) => {
    if (role === "ROLE_ADMIN") return setCurrentPage("admin-dashboard");
    if (role === "ROLE_ENSEIGNANT") return setCurrentPage("home");
    return setCurrentPage("student-home"); // défaut = étudiant
  };

  // ---------------------------------------------------------
  // 🔥 Connexion
  // ---------------------------------------------------------
  const handleLogin = (userData) => {
    setUser(userData);
    const roles = userData.authorities || [];

    console.log("ROLES REÇUS :", userData.authorities);
    console.log("Données userData reçues :", userData);
    console.log("authorities = ", userData.authorities);
    console.log("type =", typeof userData.authorities[0]);


    // Sauvegarde locale
    localStorage.setItem("currentUser", JSON.stringify(userData));

    // Un seul rôle → redirection directe
    if (roles.length === 1) {
      redirectBasedOnRole(roles[0]);
      return;
    }

    // Plusieurs rôles → redirection vers la page de choix
    setCurrentPage("choose-role");
  };

  // ---------------------------------------------------------
  // 🔥 Quand l'utilisateur choisit un rôle
  // ---------------------------------------------------------
  const handleChooseRole = (role) => {
    setSelectedRole(role);
    redirectBasedOnRole(role);
  };

  // ---------------------------------------------------------
  // 🔥 Déconnexion
  // ---------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login');
  };

  // ---------------------------------------------------------
  // 🔥 Start exam
  // ---------------------------------------------------------
  const handleStartExam = (examId) => {
    setSelectedExamId(examId);
    setCurrentPage('exam-taking');
  };

  // ---------------------------------------------------------
  // 🔥 ROUTEUR MANUEL
  // ---------------------------------------------------------
  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'reset' && (
        <ResetPasswordPage onNavigate={setCurrentPage} />
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
