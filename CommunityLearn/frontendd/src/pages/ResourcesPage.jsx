import { useState } from 'react';
import {
  Search, X, Crown, ExternalLink, Video, FileText, Cpu,
  ChevronRight, Star, CheckCircle, ChevronDown, ChevronUp,
  LayoutGrid, Filter
} from 'lucide-react';
import { RESOURCES, VIDEO_MAP } from '../data/resources';

const typeIcon  = t => t === 'PDF' ? <FileText className="w-3.5 h-3.5" /> : t === 'Video' ? <Video className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />;
const typeColor = t => t === 'PDF' ? 'bg-red-500/20 text-red-300 border-red-500/40' : t === 'Video' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

// Accent color per subject (top border stripe on each card)
const subjectAccent = (s) => {
  const map = {
    Mathematics:   'from-blue-500 to-cyan-400',
    Programming:   'from-violet-500 to-purple-400',
    Physics:       'from-orange-500 to-amber-400',
    Chemistry:     'from-pink-500 to-rose-400',
    Biology:       'from-emerald-500 to-green-400',
    English:       'from-sky-500 to-blue-400',
    History:       'from-amber-500 to-yellow-400',
    Economics:     'from-teal-500 to-cyan-400',
    'Data Science':'from-indigo-500 to-blue-400',
    Music:         'from-fuchsia-500 to-pink-400',
    Psychology:    'from-rose-500 to-pink-400',
    Arabic:        'from-teal-400 to-emerald-400',
    'Art & Design':'from-orange-400 to-amber-400',
  };
  return map[s] || 'from-violet-500 to-indigo-400';
};

// Subject icon emoji
const subjectEmoji = (s) => {
  const map = {
    Mathematics:   { emoji:'📐', bg:'bg-blue-600' },
    Programming:   { emoji:'💻', bg:'bg-violet-600' },
    Physics:       { emoji:'⚛️', bg:'bg-orange-600' },
    Chemistry:     { emoji:'🧪', bg:'bg-pink-600' },
    Biology:       { emoji:'🧬', bg:'bg-emerald-600' },
    English:       { emoji:'📖', bg:'bg-sky-600' },
    History:       { emoji:'🏛️', bg:'bg-amber-600' },
    Economics:     { emoji:'📊', bg:'bg-teal-600' },
    'Data Science':{ emoji:'🤖', bg:'bg-indigo-600' },
    Music:         { emoji:'🎵', bg:'bg-fuchsia-600' },
    Psychology:    { emoji:'🧠', bg:'bg-rose-600' },
    Arabic:        { emoji:'🌙', bg:'bg-teal-700' },
    'Art & Design':{ emoji:'🎨', bg:'bg-orange-600' },
  };
  return map[s] || { emoji:'📚', bg:'bg-violet-600' };
};

// ─── Resource Card ─────────────────────────────────────────────────────────────
const ResourceCard = ({ resource, accentClass, onView }) => (
  <div className="rounded-2xl bg-[#12172a] border border-white/[0.07] overflow-hidden hover:border-white/[0.15] transition-all duration-200 flex flex-col">
    {/* Top accent stripe */}
    <div className={`h-1 w-full bg-gradient-to-r ${accentClass}`} />

    <div className="p-4 flex flex-col gap-3 flex-1">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {resource.premium && <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
            <h4 className="text-sm font-bold text-white leading-tight">{resource.title}</h4>
          </div>
          <p className="text-[11px] text-gray-500">{resource.author}</p>
        </div>
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold flex-shrink-0 border flex items-center gap-1 ${typeColor(resource.type)}`}>
          {typeIcon(resource.type)}{resource.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-400 leading-relaxed flex-1">{resource.desc}</p>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-yellow-300 font-semibold">{resource.rating}</span>
        </div>
        <span>·</span>
        <span>{resource.downloads.toLocaleString()} downloads</span>
        <span>·</span>
        <span>{resource.pages ? `${resource.pages}p` : resource.duration ? resource.duration : `${resource.lessons} lessons`}</span>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onView(resource)}
        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
          resource.premium
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:opacity-90'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90'
        }`}
      >
        {resource.premium
          ? <><Crown className="w-3.5 h-3.5" />Unlock Premium</>
          : <><ExternalLink className="w-3.5 h-3.5" />View Free</>
        }
      </button>
    </div>
  </div>
);

// ─── Subject Section ──────────────────────────────────────────────────────────
const SubjectSection = ({ subject, resources, isOpen, onToggle, onView }) => {
  const { emoji, bg } = subjectEmoji(subject);
  const accent = subjectAccent(subject);

  return (
    <div className="border border-white/[0.07] rounded-2xl overflow-hidden bg-[#0d1321]">
      {/* Section header — click to toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center text-base flex-shrink-0`}>
            {emoji}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">{subject}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{resources.length} resource{resources.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Arrow */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-violet-600/30 text-violet-300' : 'bg-white/[0.05] text-gray-500 hover:text-white'}`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-1">
          {/* Thin accent line */}
          <div className={`h-px w-full bg-gradient-to-r ${accent} opacity-40 mb-4`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(r => (
              <ResourceCard key={r.id} resource={r} accentClass={accent} onView={onView} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Choice Modal ─────────────────────────────────────────────────────────────
const ChoiceModal = ({ resource, onClose }) => {
  if (!resource) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-3">
            <h2 className="text-sm font-bold text-white leading-tight">{resource.title}</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">{resource.author}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">{resource.desc}</p>
        <p className="text-xs font-semibold text-gray-400 mb-3 text-center">How would you like to access this?</p>
        <div className="space-y-2.5">
          {[
            {
              label:'Watch Video', sub: VIDEO_MAP[resource.title] ? 'Embedded YouTube video' : 'Search on YouTube',
              icon:<Video className="w-5 h-5 text-white" />, bg:'bg-gradient-to-br from-purple-600 to-pink-600', border:'border-purple-500/30',
              onClick: () => { const url = VIDEO_MAP[resource.title]; if (url) window.open(url, '_blank'); else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(resource.title + ' full tutorial')}`, '_blank'); onClose(); }
            },
            {
              label:'Get PDF', sub:'Search for free PDF on Google',
              icon:<FileText className="w-5 h-5 text-white" />, bg:'bg-gradient-to-br from-red-600 to-orange-600', border:'border-red-500/30',
              onClick: () => { window.open(`https://www.google.com/search?q=${encodeURIComponent(resource.title + ' free PDF')}`, '_blank'); onClose(); }
            },
            {
              label:'Find Online', sub:'Search free courses on the internet',
              icon:<ExternalLink className="w-5 h-5 text-white" />, bg:'bg-gradient-to-br from-blue-600 to-cyan-600', border:'border-blue-500/30',
              onClick: () => { window.open(`https://www.google.com/search?q=${encodeURIComponent(resource.title + ' free course')}`, '_blank'); onClose(); }
            },
          ].map((opt, i) => (
            <button key={i} onClick={opt.onClick}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${opt.border} bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left`}>
              <div className={`w-9 h-9 rounded-lg ${opt.bg} flex items-center justify-center flex-shrink-0`}>{opt.icon}</div>
              <div>
                <p className="text-sm font-semibold text-white">{opt.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{opt.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-3 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors">Cancel</button>
      </div>
    </div>
  );
};

// ─── Premium Modal ─────────────────────────────────────────────────────────────
const PremiumModal = ({ resource, onClose }) => {
  if (!resource) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-yellow-500/30 p-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-base font-bold text-white text-center mb-1">Premium Content 👑</h2>
        <p className="text-xs text-gray-400 text-center mb-1">"{resource.title}"</p>
        <p className="text-xs text-gray-500 text-center mb-5">Upgrade to unlock this and 100+ more resources.</p>
        <div className="bg-white/[0.04] rounded-xl p-4 mb-4 border border-white/[0.07]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-white">Premium Plan</span>
            <span className="text-lg font-black text-yellow-300">$9.99<span className="text-xs text-gray-500">/mo</span></span>
          </div>
          {['All premium PDFs & videos', 'Unlimited downloads', 'Ad-free experience', 'Priority support'].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{f}
            </div>
          ))}
        </div>
        <button onClick={() => alert('Connect payment gateway!')}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm hover:opacity-90 transition-all mb-2">
          Upgrade to Premium — ₹799/mo
        </button>
        <button onClick={onClose} className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">Maybe later</button>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ResourcesPage = () => {
  const [search,      setSearch]      = useState('');
  const [filterType,  setFilterType]  = useState('All');
  const [choiceRes,   setChoiceRes]   = useState(null);
  const [premiumRes,  setPremiumRes]  = useState(null);

  // ALL sections collapsed by default — empty Set means nothing open
  const [openSubjects, setOpenSubjects] = useState(new Set());

  const toggleSubject = (subject) => {
    setOpenSubjects(prev => {
      const next = new Set(prev);
      next.has(subject) ? next.delete(subject) : next.add(subject);
      return next;
    });
  };

  const handleView = (r) => {
    if (r.premium) { setPremiumRes(r); return; }
    setChoiceRes(r);
  };

  // Filter resources
  const filtered = RESOURCES.filter(r =>
    (filterType === 'All' || r.type === filterType) &&
    (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Group by subject (preserve order)
  const subjectOrder = [...new Set(RESOURCES.map(r => r.subject))];
  const grouped = subjectOrder.reduce((acc, subj) => {
    const items = filtered.filter(r => r.subject === subj);
    if (items.length > 0) acc[subj] = items;
    return acc;
  }, {});

  const totalSubjects = Object.keys(grouped).length;

  // Expand all / collapse all
  const expandAll  = () => setOpenSubjects(new Set(Object.keys(grouped)));
  const collapseAll = () => setOpenSubjects(new Set());
  const allOpen    = totalSubjects > 0 && Object.keys(grouped).every(s => openSubjects.has(s));

  return (
    <div className="min-h-screen bg-[#0c1118]" style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* Modals */}
      {choiceRes  && <ChoiceModal  resource={choiceRes}  onClose={() => setChoiceRes(null)}  />}
      {premiumRes && <PremiumModal resource={premiumRes} onClose={() => setPremiumRes(null)} />}

      {/* Page header */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Learning Resources</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} resources across {totalSubjects} subjects
            </p>
          </div>

          {/* Search + controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="pl-9 pr-4 py-2 w-56 rounded-xl bg-[#131c2e] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            {/* Grid icon */}
            <button className="w-9 h-9 rounded-xl bg-[#131c2e] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
            {/* Filter icon */}
            <button className="w-9 h-9 rounded-xl bg-[#131c2e] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Type filter pills + expand/collapse */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['All', 'PDF', 'Video', 'Interactive'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterType === t
                    ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Expand all / Collapse all */}
          <button
            onClick={allOpen ? collapseAll : expandAll}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
          >
            {allOpen ? <><ChevronUp className="w-3.5 h-3.5" />Collapse All</> : <><ChevronDown className="w-3.5 h-3.5" />Expand All</>}
          </button>
        </div>
      </div>

      {/* Subject sections */}
      <div className="px-6 pb-10 flex flex-col gap-4">
        {totalSubjects === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-gray-400 font-semibold">No resources found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          Object.entries(grouped).map(([subject, resources]) => (
            <SubjectSection
              key={subject}
              subject={subject}
              resources={resources}
              isOpen={openSubjects.has(subject)}
              onToggle={() => toggleSubject(subject)}
              onView={handleView}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
