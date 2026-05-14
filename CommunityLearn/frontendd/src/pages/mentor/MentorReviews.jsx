import { useState, useEffect } from 'react';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';
import { getMentorReviews, getMentorAvgRating } from '../../utils/sharedStore';

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        className={`w-3.5 h-3.5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`}
      />
    ))}
  </div>
);

const MentorReviews = ({ currentUser }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      setReviews(getMentorReviews(currentUser.id));
    }
    const handler = () => setReviews(getMentorReviews(currentUser?.id));
    window.addEventListener('cl_review_update', handler);
    return () => window.removeEventListener('cl_review_update', handler);
  }, [currentUser]);

  const avg = getMentorAvgRating(currentUser?.id);
  const dist = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
  }));

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-amber-600" />
        </div>
        <p className="text-gray-400 font-semibold text-lg">No reviews yet</p>
        <p className="text-gray-600 text-sm mt-1">Reviews from students will appear here after completed sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average */}
        <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-6 flex flex-col items-center justify-center">
          <p className="text-5xl font-black text-amber-400 mb-1">{avg || '—'}</p>
          <StarRow rating={Math.round(avg || 0)} />
          <p className="text-gray-600 text-xs mt-2">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Distribution */}
        <div className="md:col-span-2 rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5">
          <p className="text-sm font-bold text-white mb-4">Rating Distribution</p>
          <div className="space-y-2">
            {dist.map(({ star, count }) => {
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12 flex-shrink-0">
                    <span className="text-xs text-gray-400">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-3">
        {reviews.slice().reverse().map((r) => (
          <div
            key={r.id}
            className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {r.studentName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'S'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.studentName}</p>
                  <p className="text-xs text-gray-600">{r.subject}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarRow rating={r.rating} />
                <p className="text-[10px] text-gray-700">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorReviews;
