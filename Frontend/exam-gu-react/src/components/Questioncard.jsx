import React, { useState } from 'react';

export default function QuestionCard({ number, isAlt, onRemove, onChange }) {
  const [questionType, setQuestionType] = useState(null);
  const [text, setText] = useState('');
  const [points, setPoints] = useState('');
  const [choices, setChoices] = useState([
    { label: 'A', text: '', isCorrect: false },
    { label: 'B', text: '', isCorrect: false },
    { label: 'C', text: '', isCorrect: false },
    { label: 'D', text: '', isCorrect: false }
  ]);
  const [multipleAnswers, setMultipleAnswers] = useState(false);
  const [tfAnswer, setTfAnswer] = useState(null);

  const handleTypeChange = (type) => {
    setQuestionType(type);
    
    const data = {
      text,
      points: Number(points),
      type
    };

    if (type === 'QCM') {
      data.multipleAnswersAllowed = multipleAnswers;
      data.choices = choices;
    } else if (type === 'TRUE_FALSE') {
      data.correct = tfAnswer;
    }

    onChange(data);
  };

  const addChoice = () => {
    const label = String.fromCharCode(65 + choices.length);
    setChoices([...choices, { label, text: '', isCorrect: false }]);
  };

  return (
    <article className={`q-card ${isAlt ? 'is-alt' : ''}`}>
      <header className="q-head">
        <div className="q-line">
          <div className="q-left">
            <div className="q-num">Question <span className="q-number">{number}</span> :</div>
            <label className="q-label">
              Description
              <input
                className="q-text"
                type="text"
                placeholder="Écrivez la question…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="q-right">
            <label className="q-label">
              Barème
              <input
                className="q-points"
                type="number"
                min="0"
                step="0.5"
                placeholder="Valeur"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </label>

            <fieldset className="q-type-pick">
              <legend>Type de question</legend>
              <label className="radio">
                <input
                  type="radio"
                  name={`qtype-${number}`}
                  value="QCM"
                  onChange={() => handleTypeChange('QCM')}
                />
                <span>QCM</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name={`qtype-${number}`}
                  value="TRUE_FALSE"
                  onChange={() => handleTypeChange('TRUE_FALSE')}
                />
                <span>Vrai/Faux</span>
              </label>
            </fieldset>
          </div>
        </div>
      </header>

      <div className={`q-body ${!questionType ? 'is-collapsed' : ''}`}>
        {questionType === 'QCM' && (
          <div className="qcm-block">
            <div className="choices">
              {choices.map((choice, i) => (
                <div key={i} className="choice">
                  <label className="ch-label">{choice.label}</label>
                  <input
                    type="text"
                    className="qcm-text"
                    placeholder={`Réponse ${choice.label}`}
                    value={choice.text}
                    onChange={(e) => {
                      const newChoices = [...choices];
                      newChoices[i].text = e.target.value;
                      setChoices(newChoices);
                    }}
                  />
                  <label className="chk">
                    <input
                      type="checkbox"
                      className="qcm-correct"
                      checked={choice.isCorrect}
                      onChange={(e) => {
                        const newChoices = [...choices];
                        newChoices[i].isCorrect = e.target.checked;
                        setChoices(newChoices);
                      }}
                    />
                    Correcte
                  </label>
                </div>
              ))}
            </div>

            <div className="qcm-toolbar">
              <label className="chk">
                <input
                  type="checkbox"
                  className="qcm-multi"
                  checked={multipleAnswers}
                  onChange={(e) => setMultipleAnswers(e.target.checked)}
                />
                Réponses multiples autorisées
              </label>
              <button type="button" className="btn ghost add-choice" onClick={addChoice}>
                + Ajouter une réponse
              </button>
            </div>
          </div>
        )}

        {questionType === 'TRUE_FALSE' && (
          <div className="tf-block">
            <label className="radio">
              <input
                type="radio"
                name={`tf-${number}`}
                value="true"
                onChange={() => setTfAnswer(true)}
              />
              <span>Vrai</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name={`tf-${number}`}
                value="false"
                onChange={() => setTfAnswer(false)}
              />
              <span>Faux</span>
            </label>
          </div>
        )}
      </div>

      <footer className="q-foot">
        <button type="button" className="btn danger q-remove" onClick={onRemove}>
          Supprimer la question
        </button>
      </footer>
    </article>
  );
}