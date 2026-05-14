import { useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { App3DBackground, Card3D } from '../components/UI';
import { QUIZZES_DATA, QUIZ_QUESTIONS, DEFAULT_QUESTIONS } from '../data/quizzes';

const QuizzesPage = ({ onQuizComplete }) => {
  const [filterSub,  setFilterSub]  = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex,     setQIndex]     = useState(0);
  const [score,      setScore]      = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [finished,   setFinished]   = useState(false);

  const subjects     = ['All', ...Array.from(new Set(QUIZZES_DATA.map(q => q.subject)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const filtered     = QUIZZES_DATA.filter(q =>
    (filterSub  === 'All' || q.subject    === filterSub) &&
    (filterDiff === 'All' || q.difficulty === filterDiff)
  );
  const questions = activeQuiz ? (QUIZ_QUESTIONS[activeQuiz.title] || DEFAULT_QUESTIONS(activeQuiz.title)) : [];

  const handleAnswer = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      const correct = idx === questions[qIndex].ans;
      if (correct) setScore(s => s + 1);
      if (qIndex + 1 < questions.length) {
        setQIndex(i => i + 1); setSelected(null);
      } else {
        setFinished(true);
        if (onQuizComplete) {
          const pct = Math.round(((score + (correct?1:0)) / questions.length) * 100);
          onQuizComplete(activeQuiz.points, pct === 100);
        }
      }
    }, 800);
  };

  const resetQuiz = () => { setActiveQuiz(null); setQIndex(0); setScore(0); setSelected(null); setFinished(false); };
  const startQuiz = (q) => { setActiveQuiz(q); setQIndex(0); setScore(0); setSelected(null); setFinished(false); };

  const diffColor = d => d==='Easy'?'bg-green-500/20 text-green-300 border-green-500/40':d==='Medium'?'bg-yellow-500/20 text-yellow-300 border-yellow-500/40':'bg-red-500/20 text-red-300 border-red-500/40';

  // ── Quiz in progress ──
  if (activeQuiz && !finished) {
    const cq = questions[qIndex];
    return (
      <App3DBackground className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={resetQuiz} className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 transition-all hover:-translate-y-0.5">
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </button>
          <span className="text-gray-400 text-sm">{qIndex+1} / {questions.length}</span>
        </div>
        <Card3D className="rounded-2xl p-3">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width:`${(qIndex/questions.length)*100}%` }}/>
          </div>
        </Card3D>
        <Card3D className="rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${diffColor(activeQuiz.difficulty)}`}>{activeQuiz.difficulty}</span>
            <span className="text-gray-400 text-sm">{activeQuiz.subject}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-6">{cq.q}</h3>
          <div className="space-y-3">
            {cq.opts.map((opt,i) => (
              <button
                key={i}
                onClick={() => selected===null && handleAnswer(i)}
                disabled={selected!==null}
                className={`w-full text-left px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 ${
                  selected===null ? 'bg-white/5 border-white/15 text-gray-200 hover:bg-white/10'
                  : i===cq.ans    ? 'bg-green-500/20 border-green-400 text-green-300'
                  : i===selected  ? 'bg-red-500/20 border-red-400 text-red-300'
                  :                 'bg-white/5 border-white/10 text-gray-500'
                }`}
              >
                <span className="font-bold mr-3 text-gray-400">{String.fromCharCode(65+i)}.</span>{opt}
              </button>
            ))}
          </div>
        </Card3D>
        <Card3D className="rounded-2xl p-4 flex justify-between">
          <span className="text-gray-400 text-sm">Current Score</span>
          <span className="text-white font-bold">{score} / {qIndex}</span>
        </Card3D>
      </App3DBackground>
    );
  }

  // ── Quiz finished ──
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const resColor = pct>=80?'bg-gradient-to-br from-green-400 to-teal-500':pct>=50?'bg-gradient-to-br from-yellow-400 to-orange-500':'bg-gradient-to-br from-red-400 to-pink-500';
    return (
      <App3DBackground className="max-w-md mx-auto text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-white/10 ${resColor}`}>
          <Trophy className="w-12 h-12 text-white"/>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Complete! 🎉</h2>
          <p className="text-gray-400">{activeQuiz?.title}</p>
        </div>
        <Card3D className="rounded-2xl p-6">
          <p className={`text-5xl font-extrabold mb-2 ${pct>=80?'text-green-300':pct>=50?'text-yellow-300':'text-red-300'}`}>{pct}%</p>
          <p className="text-gray-400 text-sm">{score} correct out of {questions.length}</p>
          <p className="text-white font-semibold mt-3">{pct>=80?'🌟 Excellent work!':pct>=50?'👍 Good effort — keep practicing!':'📚 Keep studying and try again!'}</p>
          {pct===100 && <p className="text-yellow-300 text-sm mt-2">💎 Perfect Score badge unlocked!</p>}
          <p className="text-blue-300 text-sm mt-1">+{activeQuiz?.points} XP earned!</p>
        </Card3D>
        <button onClick={resetQuiz} className="relative isolate overflow-hidden w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:-translate-y-0.5 transition-all">
          <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]"/>
          <span className="relative">Back to Quizzes</span>
        </button>
      </App3DBackground>
    );
  }

  // ── Quiz list ──
  return (
    <App3DBackground className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Practice Quizzes</h2>
        <p className="text-gray-400 text-sm mt-1">{QUIZZES_DATA.length} quizzes across {subjects.length - 1} subjects</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {difficulties.map(d => <button key={d} onClick={() => setFilterDiff(d)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all hover:-translate-y-0.5 ${filterDiff===d?'bg-gradient-to-r from-purple-500 to-pink-500 border-white/10 text-white':'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}`}>{d}</button>)}
        <div className="w-px bg-white/10 mx-1"/>
        {subjects.map(s => <button key={s} onClick={() => setFilterSub(s)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:-translate-y-0.5 ${filterSub===s?'bg-gradient-to-r from-blue-500 to-purple-600 border-white/10 text-white':'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'}`}>{s}</button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(q => (
          <Card3D key={q.id} className="p-6 group hover:[transform:translateY(-6px)_rotateX(3deg)_rotateY(-3deg)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">{q.title}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{q.subject}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Questions</span><span className="font-semibold text-white">{q.questions}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Time</span><span className="font-semibold text-white">{q.time} min</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Points</span><span className="font-semibold text-yellow-300">+{q.points} XP</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Difficulty</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full border ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
              </div>
            </div>
            <button onClick={() => startQuiz(q)} className="relative isolate overflow-hidden w-full py-2.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:-translate-y-0.5 transition-all">
              <span className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]"/>
              <span className="relative">Start Quiz →</span>
            </button>
          </Card3D>
        ))}
      </div>
    </App3DBackground>
  );
};

export default QuizzesPage;
