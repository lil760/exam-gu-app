import React, { useState } from 'react';
import Topbar from "../components/Topbar.jsx";
import QuestionCard from "../components/Questioncard.jsx";
import { api } from "../services/api";


export default function CreateExamPage({ user, onLogout, onNavigate }) {
  const [examMeta, setExamMeta] = useState({
    title: '',
    date: '',
    start: '',
    duration: ''
  });
  const [questions, setQuestions] = useState([
    { id: 1, number: 1 }
  ]);

  const addQuestion = () => {
    const newId = Date.now();
    setQuestions([...questions, { id: newId, number: questions.length + 1 }]);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      alert('Il faut au moins une question');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    if (!examMeta.title || !examMeta.date || !examMeta.start) {
      alert('Veuillez remplir tous les champs obligatoires de l\'examen');
      return;
    }

    const payload = {
      ...examMeta,
      questions: questions.map(q => q.data || {})
    };

    try {
      await api.createExam(payload);
      alert('Examen enregistré avec succès !');
      onNavigate('home');
    } catch (err) {
      alert('Erreur lors de l\'enregistrement: ' + err.message);
    }
  };

  const updateQuestion = (id, data) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, data } : q
    ));
  };

  return (
    <div className="page-with-topbar page-offset">
      <Topbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="wrap">
        <h1 className="exam-title-main">Informations de l'examen</h1>

        <section className="exam-meta">
          <input
            type="text"
            placeholder="Titre de l'examen"
            value={examMeta.title}
            onChange={(e) => setExamMeta({ ...examMeta, title: e.target.value })}
            required
          />
          <input
            type="date"
            value={examMeta.date}
            onChange={(e) => setExamMeta({ ...examMeta, date: e.target.value })}
            required
          />
          <input
            type="time"
            value={examMeta.start}
            onChange={(e) => setExamMeta({ ...examMeta, start: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Durée (ex: 2h45)"
            value={examMeta.duration}
            onChange={(e) => setExamMeta({ ...examMeta, duration: e.target.value })}
            required
          />
        </section>

        <section id="questions">
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              number={index + 1}
              isAlt={index % 2 === 1}
              onRemove={() => removeQuestion(q.id)}
              onChange={(data) => updateQuestion(q.id, data)}
            />
          ))}
        </section>

        <div className="actions-row ctas">
          <button className="btn-primary big btn-cta" onClick={addQuestion}>
            Ajouter une question +
          </button>
          <button className="btn-primary big btn-cta" onClick={handleSave}>
            Enregistrer l'examen
          </button>
          <button className="btn-primary big btn-cta" onClick={() => onNavigate('home')}>
            Annuler
          </button>
        </div>
      </main>
    </div>
  );
}
