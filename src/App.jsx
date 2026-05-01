import { useMemo, useState } from 'react';
import kanjiList from './data/kanjiList.json';

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * given four choices: this card's reading plus three wrong readings from other entries.
 */
function readingsToOptions(cardIndex, list) {
  const correct = list[cardIndex].reading;
  const readingsFromOtherCards = list
    .filter((_, i) => i !== cardIndex)
    .map((c) => c.reading);
  const wrongPool = [
    ...new Set(readingsFromOtherCards.filter((r) => r !== correct)),
  ];
  const wrong = [];
  const pool = shuffle([...wrongPool]);

  while (wrong.length < Math.min(3, pool.length)) {
    wrong.push(pool.pop());
  }

  const distractors = readingsFromOtherCards.filter((r) => r !== correct);
  while (wrong.length < 3) {
    if (distractors.length === 0) break;
    wrong.push(distractors[Math.floor(Math.random() * distractors.length)]);
  }

  return shuffle([correct, ...wrong]);
}

function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const shuffledCards = useMemo(() => shuffle(kanjiList), []);

  const currentCard = shuffledCards[currentIdx];

  const options = useMemo(
    () => readingsToOptions(currentIdx, shuffledCards),
    [currentIdx, shuffledCards]
  );

  const checkAnswer = (selected) => {
    if (selected === currentCard.reading) {
      setCurrentIdx((prev) => (prev + 1) % shuffledCards.length);
    } else {
      console.log('Wrong answer');
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-caviar-bold tracking-tighter text-card-foreground">
          kanji review
        </h1>
        <p className="text-subtitle font-caviar">lesson 8 kanji</p>
      </header>

      {/* flashcard */}
      <div className="relative group">
        <div className="absolute inset-0 bg-card-shadow rounded-2xl translate-x-2 translate-y-2"></div>

        <div className="relative w-64 md:w-90 lg:w-120 h-80 bg-card border-4 border-card-border rounded-2xl flex items-center justify-center transition-transform active:scale-95">
          <span
            className={`font-kanji font-bold text-card-foreground selection:bg-none ${
              currentCard.kanji.length > 1 ? 'text-7xl' : 'text-9xl'
            }`}
          >
            {currentCard.kanji}
          </span>
        </div>
      </div>

      {/* answer grid */}
      <div className="grid grid-cols-2 gap-4 mt-16 w-full max-w-xs">
        {options.map((option, i) => (
          <button
            key={`${currentIdx}-${i}-${option}`}
            type="button"
            onClick={() => checkAnswer(option)}
            className={`font-kanji py-4 bg-btn border-2 border-btn-border rounded-xl font-bold text-foreground hover:bg-btn-hover hover:text-btn-text hover:border-card-border transition-all active:translate-y-1 shadow-lg ${
              option.length > 5 ? 'text-lg' : 'text-xl'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* progress footer */}
      <footer className="mt-12 text-footer font-caviar text-sm">
        CARD {currentIdx + 1} / {shuffledCards.length}
      </footer>
    </main>
  );
}

export default App;
