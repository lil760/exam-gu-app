import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ExamTakingPage({ user, examId, onNavigate }) {
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(6332); // En secondes
  const [loading, setLoading] = useState(true);

  // Charger l'examen au démarrage
  useEffect(() => {
    loadExam();
  }, [examId]);
  //bloquer si on peut pas 
  useEffect(() => {
    const now = new Date();
    const start = new Date(exam.startDateTime);
    const end = new Date(exam.endDateTime);
  
    if (now < start || now > end) {
      alert("Cet examen n'est pas disponible actuellement.");
      onNavigate("student-home");
    }
  }, [exam]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadExam = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const mockExam = {
        id: 1,
        title: 'EXAMEN 1: Algorithmiques',
        date: '28/11/2025',
        startTime: '8h00',
        endTime: '10h45',
        duration: '2h45',
        questions: [
          {
            id: 1,
            text: 'Quelle est la complexité temporelle de l\'algorithme de tri rapide (QuickSort) dans le cas moyen ?',
            points: 5,
            type: 'QCM',
            choices: [
              { id: 'A', text: 'O(n)', isCorrect: false },
              { id: 'B', text: 'O(n log n)', isCorrect: true },
              { id: 'C', text: 'O(n²)', isCorrect: false },
              { id: 'D', text: 'O(log n)', isCorrect: false }
            ]
          },
          {
            id: 2,
            text: 'Un arbre binaire de recherche (BST) garantit toujours une recherche en O(log n).',
            points: 3,
            type: 'TRUE_FALSE',
            correctAnswer: false
          },
          {
            id: 3,
            text: 'Expliquez la différence entre une pile (stack) et une file (queue). Donnez un exemple d\'utilisation pour chaque structure.',
            points: 10,
            type: 'OPEN',
            correctAnswer: null
          }
        ]
      };

      setExam(mockExam);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement examen:', error);
      alert('Erreur lors du chargement de l\'examen');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    const unanswered = exam.questions.length - Object.keys(answers).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `Vous avez ${unanswered} question(s) non répondue(s). Voulez-vous vraiment soumettre l'examen ?`
      );
      if (!confirm) return;
    }

    try {
      // TODO: Appel API pour soumettre l'examen
      console.log('Soumission des réponses:', answers);
      alert('Examen soumis avec succès !');
      onNavigate('student-home');
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de la soumission');
    }
  };

  if (loading) {
    return (
      <div className="exam-loading">
        <p>Chargement de l'examen...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-error">
        <p>Erreur de chargement de l'examen</p>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = (Object.keys(answers).length / exam.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  return (
    <div className="exam-taking-page">
      {/* Topbar */}
      <header className="exam-topbar">
        <div className="exam-topbar-left">
          <div className="exam-logo">EG</div>
          <div className="exam-title-top">{exam.title}</div>
        </div>
        <div className="exam-topbar-right">
          <div className={`exam-timer ${timeLeft < 600 ? 'warning' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="exam-main-content">
        {/* En-tête examen */}
        <div className="exam-info-header">
          <h1>{exam.title}</h1>
          <p className="exam-meta-info">
            Date : {exam.date} • {exam.startTime}-{exam.endTime} • Durée : {exam.duration} • {exam.questions.length} questions
          </p>
        </div>

        {/* Barre de progression */}
        <div className="exam-progress-bar">
          <div className="progress-label">
            <span>Progression</span>
            <span>
              <strong>{Object.keys(answers).length}</strong> / {exam.questions.length} répondues
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Navigation des questions */}
        <div className="exam-questions-nav">
          <h3>Navigation rapide</h3>
          <div className="questions-grid">
            {exam.questions.map((q, index) => (
              <div
                key={q.id}
                className={`question-bubble ${
                  index === currentQuestionIndex ? 'current' : ''
                } ${answers[q.id] !== undefined ? 'answered' : ''}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Carte de question */}
        <div className="exam-question-card">
          <div className="question-header">
            <div className="question-number">Question {currentQuestionIndex + 1}</div>
            <div className="question-points">{currentQuestion.points} points</div>
          </div>

          <p className="question-text">{currentQuestion.text}</p>

          {/* QCM */}
          {currentQuestion.type === 'QCM' && (
            <div className="exam-options">
              {currentQuestion.choices.map((choice) => (
                <div
                  key={choice.id}
                  className={`exam-option ${
                    answers[currentQuestion.id] === choice.id ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, choice.id)}
                >
                  <div className="option-radio"></div>
                  <div className="option-label">{choice.id}</div>
                  <div className="option-text">{choice.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Vrai/Faux */}
          {currentQuestion.type === 'TRUE_FALSE' && (
            <div className="exam-options">
              <div
                className={`exam-option ${
                  answers[currentQuestion.id] === true ? 'selected' : ''
                }`}
                onClick={() => handleAnswer(currentQuestion.id, true)}
              >
                <div className="option-radio"></div>
                <div className="option-label">Vrai</div>
              </div>
              <div
                className={`exam-option ${
                  answers[currentQuestion.id] === false ? 'selected' : ''
                }`}
                onClick={() => handleAnswer(currentQuestion.id, false)}
              >
                <div className="option-radio"></div>
                <div className="option-label">Faux</div>
              </div>
            </div>
          )}

          {/* Question ouverte */}
          {currentQuestion.type === 'OPEN' && (
            <textarea
              className="exam-answer-textarea"
              placeholder="Écrivez votre réponse ici..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            />
          )}

          {/* Navigation */}
          <div className="exam-navigation">
            <button
              className="exam-btn exam-btn-secondary"
              onClick={goPrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Précédent
            </button>

            {isLastQuestion ? (
              <button
                className="exam-btn exam-btn-submit"
                onClick={handleSubmitExam}
              >
                Soumettre l'examen
              </button>
            ) : (
              <button
                className="exam-btn exam-btn-primary"
                onClick={goNext}
              >
                Suivant →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}