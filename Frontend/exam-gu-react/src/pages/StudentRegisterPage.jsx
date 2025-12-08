import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { api } from '../services/api';

export default function StudentRegisterPage({ user, onLogout, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exams, setExams] = useState([]);

  // Charger les examens depuis le backend
  useEffect(() => {
    if (!user || !user.id) {
      console.error("❌ user.id manquant");
      return;
    }

    console.log("🔵 Chargement des examens disponibles pour l'étudiant:", user.id);

    api.getStudentAvailableExams(user.id)
      .then((data) => {
        console.log("📘 Examens disponibles reçus:", data);
        setExams(data);
      })
      .catch((err) => console.error("Erreur chargement exams:", err));
  }, [user]);

  // Filtrer la recherche
  const filteredExams = exams.filter((exam) =>
    exam.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inscription
  const handleRegister = async (examId) => {
    try {
      await api.registerForExam(examId);

      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examId ? { ...exam, isRegistered: true } : exam
        )
      );

      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur inscription :", error);
      alert("Erreur lors de l'inscription");
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

        <div className="student-section-header">
          <h1 className="student-title-register">LISTE DES EXAMENS DISPONIBLES</h1>
        </div>

        {/* Liste des examens */}
        <section className="student-exam-list">
          {filteredExams.map((exam) => {
            const start = new Date(exam.startDateTime);
            const end = new Date(exam.endDateTime);

            return (
              <article key={exam.id} className="student-exam-card">
                <div className="student-exam-content">
                  <div className="student-exam-star">
                    {exam.isRegistered ? "★" : "☆"}
                  </div>

                  <div className="student-exam-info">
                    <h2 className="student-exam-title">{exam.title}</h2>

                    <p className="student-exam-details">
                      Début : {start.toLocaleString()} <br />
                      Fin : {end.toLocaleString()} <br />
                      Durée : {exam.durationMinutes} min
                    </p>
                  </div>
                </div>

                <button
                  className={`student-btn-register-exam ${
                    exam.isRegistered ? "registered" : ""
                  }`}
                  onClick={() => handleRegister(exam.id)}
                  disabled={exam.isRegistered}
                >
                  {exam.isRegistered ? "Inscrit ✓" : "S'inscrire"}
                </button>
              </article>
            );
          })}
        </section>

        {filteredExams.length === 0 && (
          <div className="no-exams-message">
            <p>Aucun examen disponible pour le moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
