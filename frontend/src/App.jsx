import React from 'react';
import LessonCard from './LessonCard';

const sample = {
  learnable: 'ciao',
  definition: 'hello (Italian)',
};

export default function App() {
  return (
    <div>
      <LessonCard card={sample} />
    </div>
  );
}
