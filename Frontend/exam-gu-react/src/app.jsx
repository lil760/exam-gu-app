import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateExamPage from './pages/CreateExamPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './styles.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('home');
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentPage('login');
  };

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
      {currentPage === 'create-exam' && (
        <CreateExamPage user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      )}
    </>
  );
}