import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { api } from '../services/api';

export default function StudentRegisterPage({ user, onLogout, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exams, setExams] = useState([
    {
      id: 3,
      title: 'EXAMEN 3: Mathématiques',
      date: '12/12/2025',
      startTime: '8h00',
      endTime: '10h45',
      duration: '2h45',
      isRegistered: false
    },
    {
      id: 4,
      title: 'EXAMEN Final : Architecture des logiciels',
      date: '20/12/2025',
      startTime: '8h00',
      endTime: '10h45',
      duration: '2h45',
      isRegistered: false
    },
    {
      id: 5,
      title: 'EXAMEN Final : Certificat IEEE',
      date: '18/12/2025',
      startTime: '19h',
      endTime: '21h45',
      duration: '2h45',
      isRegistered: false
    }
  ]);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegister = async (examId) => {
    try {
      await api.registerForExam(examId);
      setExams(exams.map(exam => 
        exam.id === examId 
          ? { ...exam, isRegistered: true }
          : exam
      ));
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur inscription:', error);
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="page-with-topbar student-page">
      <Topbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="student-register"
        showSearch={false}
      />

      <main className="wrap student-wrap">
        {/* Barre de recherche */}
        <div className="student-search-bar">
          <input
            type="search"
            placeholder="Rechercher un examen"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="student-search-input"
          />
        </div>

        {/* Titre section */}
        <div className="student-section-header">
          <h1 className="student-title-register">LISTES DES EXAMENS DISPONIBLES</h1>
        </div>

        {/* Liste des examens disponibles */}
        <section className="student-exam-list">
          {filteredExams.map((exam) => (
            <article key={exam.id} className="student-exam-card">
              <div className="student-exam-content">
                <div className="student-exam-star">
                  {exam.isRegistered ? '★' : '☆'}
                </div>
                <div className="student-exam-info">
                  <h2 className="student-exam-title">{exam.title}</h2>
                  <p className="student-exam-details">
                    Date : {exam.date} - Heure : {exam.startTime}-{exam.endTime} - Durée : {exam.duration}
                  </p>
                </div>
              </div>
              <button 
                className={`student-btn-register-exam ${exam.isRegistered ? 'registered' : ''}`}
                onClick={() => handleRegister(exam.id)}
                disabled={exam.isRegistered}
              >
                {exam.isRegistered ? 'Inscrit ✓' : 'S\'inscrire'}
              </button>
            </article>
          ))}
        </section>

        {/* Message si aucun examen */}
        {filteredExams.length === 0 && (
          <div className="no-exams-message">
            <p>Aucun examen disponible pour le moment</p>
          </div>
        )}
      </main>
    </div>
  );
}