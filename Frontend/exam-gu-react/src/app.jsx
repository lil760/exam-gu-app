import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateExamPage from './pages/CreateExamPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import ExamTakingPage from './pages/ExamTakingPage';
import './styles.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);

  // ⬅️ Vérifier si utilisateur déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);

        // Redirection automatique selon le rôle
        if (parsed.role === 'ROLE_STUDENT' || parsed.authorities?.includes('ROLE_STUDENT')) {
          setCurrentPage('student-home');
        } else {
          setCurrentPage('home');
        }

      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // ⬅️ Connexion
  const handleLogin = (userData) => {
    setUser(userData);

    if (userData.role === 'ROLE_STUDENT' || userData.authorities?.includes('ROLE_STUDENT')) {
      setCurrentPage('student-home');
    } else {
      setCurrentPage('home');
    }
  };

  // ⬅️ Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login');
  };

  // ⬅️ Lancer un examen
  const handleStartExam = (examId) => {
    setSelectedExamId(examId);
    setCurrentPage('exam-taking');
  };

  // 🟩 🟦 🟧 🟥 RETOUR UNIQUE → PAS D'AUTRE CODE EN DEHORS !!
  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
      )}

      {currentPage === 'reset' && (
        <ResetPasswordPage onNavigate={setCurrentPage} />
      )}

      {currentPage === 'home' && (
        <HomePage
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
        />
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
    </>
  );
}
