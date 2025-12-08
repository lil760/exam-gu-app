import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { api } from "../services/api";

export default function StudentHomePage({ user, onLogout, onNavigate, onStartExam }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState([]);

  // Charger les examens disponibles pour cet étudiant
  useEffect(() => {
    if (!user || !user.id) {
      console.error("❌ Impossible de charger les examens : user.id manquant");
      return;
    }

    console.log("👤 Chargement des examens pour étudiant ID:", user.id);

    api.getStudentAvailableExams(user.id)
      .then((data) => {
        console.log("📘 Exams reçus du backend:", data);
        setExams(data);
      })
      .catch((err) => console.error("Erreur chargement examens:", err));
  }, [user]);

  // Filtrer selon la recherche
  const filteredExams = exams.filter((exam) =>
    exam.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-with-topbar student-page">
      <Topbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="student-home"
        showSearch={false}
      />

      <main className="wrap student-wrap">

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
          <h1 className="student-title">MES EXAMENS</h1>
        </div>

        <section className="student-exam-list">
          {filteredExams.length === 0 && (
            <p className="no-exams">Aucun examen disponible pour le moment.</p>
          )}

          {filteredExams.map((exam) => {
            const now = new Date();
            const start = new Date(exam.startDateTime);
            const end = new Date(exam.endDateTime);

            const isAvailable = now >= start && now <= end;

            return (
              <article key={exam.id} className="student-exam-card">
                <div className="student-exam-content">
                  <div className="student-exam-info">
                    <h2 className="student-exam-title">{exam.title}</h2>

                    <p className="student-exam-details">
                      Début : {new Date(exam.startDateTime).toLocaleString()} <br />
                      Fin : {new Date(exam.endDateTime).toLocaleString()} <br />
                      Durée : {exam.durationMinutes} min
                    </p>
                  </div>
                </div>

                <button
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onStartExam(exam.id)}
                  className={isAvailable ? "btn-primary" : "btn-disabled"}
                >
                  {isAvailable ? "Commencer l'examen" : "Indisponible"}
                </button>
              </article>
            );
          })}
        </section>

        <div className="student-register-section">
          <button
            className="student-btn-register"
            onClick={() => onNavigate("student-register")}
          >
            S'inscrire
          </button>
        </div>
      </main>
    </div>
  );
}
