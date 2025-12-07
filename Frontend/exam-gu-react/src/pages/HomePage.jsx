import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar.jsx';
import { api } from '../services/api';

export default function HomePage({ user, onLogout, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Examen Calcul avancé 2',
      date: '27 Nov 2025',
      time: '08:30',
      duration: '2h45',
      students: ['Eva Martin', 'Rayan B.', 'Amina T.']
    },
    {
      id: 2,
      title: 'Examen Élément de programmation',
      date: '30 Nov 2025',
      time: '13:00',
      duration: '2h45',
      students: ['Yasmina L.', 'Samuel K.']
    },
    {
      id: 3,
      title: 'Examen Algèbre matricielle',
      date: '12 Déc 2025',
      time: '09:00',
      duration: '2h45',
      students: ['Jean D.', 'Inès P.', 'Léo R.']
    }
  ]);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet examen ?')) {
      try {
        await api.deleteExam(id);
        setExams(exams.filter(e => e.id !== id));
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (id) => {
    alert(`Modifier examen #${id} (à brancher)`);
  };

  const togglePanel = (id) => {
    setExpandedPanel(expandedPanel === id ? null : id);
  };

  return (
    <div className="page-with-topbar">
      <Topbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="home"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="wrap">
        <h1 className="page-title">Examens créés</h1>

        <section className="exam-list">
          {filteredExams.map(exam => (
            <article key={exam.id} className="exam-row">
              <div className="exam-info">
                <h2 className="exam-title">{exam.title}</h2>
                <div className="exam-meta">
                  {exam.date} • {exam.time} • {exam.duration}
                </div>
              </div>

              <div className="exam-actions">
                <button
                  className="rect-btn rect-list"
                  onClick={() => togglePanel(exam.id)}
                >
                  Liste
                </button>
                <button className="rect-btn rect-edit" onClick={() => handleEdit(exam.id)}>
                  Modifier
                </button>
                <button className="rect-btn rect-del" onClick={() => handleDelete(exam.id)}>
                  Supprimer
                </button>
              </div>

              {expandedPanel === exam.id && (
                <div className="students-panel">
                  <ul>
                    {exam.students.map((student, i) => (
                      <li key={i}>{student}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}

          <div className="cta-row cta-top">
            <button
              className="btn-primary big"
              onClick={() => onNavigate('create-exam')}
            >
              Créer un examen <span className="icon-plus"></span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}