import React, { useState } from 'react';
import './LessonCard.css';

export default function LessonCard({ card }) {
  const [showBack, setShowBack] = useState(false);
  const [input, setInput] = useState('');
  const [hintIndex, setHintIndex] = useState(0);

  const correct = card.learnable;

  const flip = () => setShowBack(!showBack);

  const onSubmit = (e) => {
    e.preventDefault();
    setShowBack(true);
  };

  const hint = () => {
    const next = correct.slice(0, hintIndex + 1);
    setHintIndex(hintIndex + 1);
    setInput(next);
  };

  const reset = () => {
    setShowBack(false);
    setInput('');
    setHintIndex(0);
  };

  return (
    <div className="lesson-wrapper">
      {showBack ? (
        <div className="card-content back" theme="MemRise">
          <button className="flip" onClick={flip}>flip</button>
          <div className="mem-field">
            <label>Learnable</label>
            <h2>{card.learnable}</h2>
          </div>
          <div className="mem-field">
            <label>Definition</label>
            <h3>{card.definition}</h3>
          </div>
          <div className="buttons">
            <button onClick={reset}>Again</button>
            <button onClick={reset}>Good</button>
          </div>
        </div>
      ) : (
        <form className="card-content front" theme="MemRise" onSubmit={onSubmit}>
          <div className="mem-instruction">Type the correct translation</div>
          <div className="mem-question">
            <div>{card.definition}</div>
          </div>
          <div className="mem-typing">
            <label>Learnable</label>
            <input
              id="typeans"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="buttons">
            <button type="button" onClick={hint}>Hint</button>
            <button type="submit">Check</button>
          </div>
        </form>
      )}
    </div>
  );
}
