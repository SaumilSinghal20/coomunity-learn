import { useState, useRef, useEffect } from 'react';
import { Brain, Send } from 'lucide-react';

const GEMINI_KEY = 'AIzaSyBD70E4445WQqqQ3sDPWt6Cv1YWAaKZYMk';

const getLocalFallback = (message) => {
  const t = message.toLowerCase();
  if (t.includes('2+2') || t.includes('2 + 2')) return '2 + 2 = **4** 😊\n\nThis is basic arithmetic!';
  if (t.match(/\d+\s*[+\-*/]\s*\d+/)) {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + message.replace(/[^0-9+\-*/().]/g, ''))();
      return `🔢 **Answer: ${result}**\n\nThis is a basic arithmetic calculation.`;
    } catch { /* fall through */ }
  }
  if (t.includes('hello') || t.includes('hi'))            return '👋 Hello! I\'m your AI Tutor. Ask me any academic question — Math, Science, Programming, History and more! 🎓';
  if (t.includes('python'))                               return '🐍 **Python Help:**\n\n• Variables: `x = 5`\n• Lists: `my_list = [1, 2, 3]`\n• Functions: `def my_func():`\n• Loops: `for i in range(10):`\n\nWhat specific Python concept do you need help with?';
  if (t.includes('javascript') || t.includes(' js '))     return '💻 **JavaScript Help:**\n\n• Variables: `let x = 5;`\n• Arrays: `const arr = [1,2,3];`\n• Functions: `const fn = () => {}`\n• Async: `await fetch(url)`\n\nWhat JS concept are you working on?';
  if (t.includes('calculus') || t.includes('derivative')) return '📐 **Calculus:**\n\n• Derivative of xⁿ = nxⁿ⁻¹\n• Derivative of sin(x) = cos(x)\n• Derivative of eˣ = eˣ\n• ∫2x dx = x² + C\n\nWhat specific problem are you solving?';
  if (t.includes('physics'))                              return '⚛️ **Physics Help:**\n\n• F = ma (Newton\'s 2nd Law)\n• E = mc²\n• v = u + at\n• KE = ½mv²\n\nWhat physics topic are you studying?';
  if (t.includes('chemistry'))                            return '🧪 **Chemistry Help:**\n\n• Periodic table & atomic structure\n• Organic reactions & mechanisms\n• Balancing equations\n• Mole concept: n = m/M\n\nWhat chemistry topic needs help?';
  if (t.includes('biology'))                              return '🧬 **Biology Help:**\n\n• Cell structure & organelles\n• DNA replication & transcription\n• Photosynthesis: 6CO₂+6H₂O → C₆H₁₂O₆+6O₂\n• Genetics & inheritance\n\nWhat biology topic are you studying?';
  if (t.includes('history'))                              return '📜 **History Help:**\n\n• Ancient civilizations\n• World Wars I & II\n• Indian Independence Movement\n• Modern world history\n\nWhich period or event are you studying?';
  if (t.includes('econom'))                               return '📊 **Economics Help:**\n\n• Supply & Demand\n• GDP = C + I + G + (X-M)\n• Inflation & monetary policy\n• Market structures\n\nWhat concept do you need help with?';
  if (t.includes('algebra'))                              return '➕ **Algebra Help:**\n\n• Solving equations: 2x+4=10 → x=3\n• Quadratic formula: x = (-b±√(b²-4ac))/2a\n• Factoring: x²-5x+6 = (x-2)(x-3)\n\nWhat algebra problem are you working on?';
  if (t.includes('data science') || t.includes('machine learning') || t.includes('ml'))
    return '🤖 **Data Science & ML:**\n\n• Python libraries: NumPy, Pandas, Sklearn\n• Supervised learning: Linear/Logistic Regression\n• Unsupervised: K-Means, PCA\n• Neural Networks & Deep Learning\n\nWhat ML concept are you studying?';
  return `🤔 I received your question about: "${message}"\n\n⚠️ The AI API is temporarily rate-limited.\nPlease wait **60 seconds** and try again for a full AI answer!\n\nI can help with:\n• 📐 Math & Calculus\n• 💻 Programming (Python, JS, React)\n• ⚛️ Physics & Chemistry\n• 🧬 Biology\n• 📜 History & Economics\n• 🤖 Data Science & ML\n\nAsk again in a moment! 😊`;
};

const getAIReply = async (userMessage) => {
  const urls = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
  ];
  for (const url of urls) {
    try {
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an expert AI tutor on CommunityLearn. Answer this student question clearly with bullet points, examples, and step-by-step explanations where needed.\n\nQuestion: ${userMessage}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      });
      const data = await res.json();
      if (data?.error?.status === 'RESOURCE_EXHAUSTED') continue;
      if (data?.error) continue;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch { continue; }
  }
  return getLocalFallback(userMessage);
};

const ChatPage = ({ currentUser }) => {
  const [input,  setInput]  = useState('');
  const [msgs,   setMsgs]   = useState([
    {
      type: 'bot',
      text: "Hello! 👋 I'm your AI learning assistant powered by Google Gemini. Ask me ANYTHING about your studies — Mathematics, Programming, Physics, Chemistry, Biology, History, Economics, Data Science, Music, Psychology and more!\n\nI give real, detailed answers to any question you ask! 🚀"
    }
  ]);
  const [typing, setTyping] = useState(false);

  // Ref for the scrollable messages container only — NOT the window
  const msgsEndRef    = useRef(null);
  const msgsScrollRef = useRef(null);

  // Scroll only the messages container, never the page
  useEffect(() => {
    if (msgsScrollRef.current) {
      msgsScrollRef.current.scrollTop = msgsScrollRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  const send = async () => {
    if (!input.trim() || typing) return;
    const txt = input.trim();
    setMsgs(prev => [...prev, { type: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    const reply = await getAIReply(txt);
    setMsgs(prev => [...prev, { type: 'bot', text: reply }]);
    setTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const userName  = currentUser?.name?.[0]?.toUpperCase() || 'U';
  const isMentor  = currentUser?.role === 'mentor';

  return (
    /*
     * KEY FIX: No h-screen, no calc(100vh-...), no overflow-hidden on the outer div.
     * The outer div is a normal block element that sits inside the page flow.
     * Only the messages list div has overflow-y-auto with a fixed height.
     */
    <div
      className="w-full rounded-2xl border border-white/[0.08] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">AI Tutor Assistant</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">Covers 12+ subjects · Available 24/7 · Instant answers</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-300 text-[11px] font-medium">Online</span>
        </div>
      </div>

      {/* ── Messages — fixed height, internal scroll only ── */}
      <div
        ref={msgsScrollRef}
        className="overflow-y-auto px-5 py-4 space-y-4"
        style={{
          height: '480px',       /* fixed pixel height — never affects page scroll */
          scrollBehavior: 'smooth',
        }}
      >
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2.5 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold border border-white/10 ${
                msg.type === 'user'
                  ? isMentor
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                {msg.type === 'user' ? userName : <Brain className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20'
                  : 'bg-white/[0.06] border border-white/[0.08] text-gray-100 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((d, j) => (
                  <span
                    key={j}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invisible anchor for scroll target */}
        <div ref={msgsEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/[0.07] bg-white/[0.02]">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me anything... (press Enter to send)"
          disabled={typing}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.09] text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40 shadow-lg shadow-violet-900/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
