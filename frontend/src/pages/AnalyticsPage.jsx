import React from 'react';
import { Brain, TrendingUp, Hash, BookOpen, Calendar, Zap } from 'lucide-react';
import { CATEGORIES, getCategoryInfo, formatDate } from '../utils/helpers';

const AnalyticsPage = ({ stats, memories }) => {
  if (!stats) return <div className="p-8 text-slate-500 font-mono">Loading analytics...</div>;

  const totalMemories = stats.total_memories || 0;
  const avgWords = totalMemories > 0 ? Math.round(stats.total_words / totalMemories) : 0;

  // Activity by day (last 14 days)
  const now = new Date();
  const activityDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().split('T')[0];
    const count = (memories || []).filter((m) => m.created_at.startsWith(key)).length;
    return { date: d, count, key };
  });
  const maxActivity = Math.max(...activityDays.map((d) => d.count), 1);

  // Top tags
  const tagCounts = {};
  (memories || []).forEach((m) => m.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="p-8 flex flex-col gap-6 animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-white">📊 Analytics</h2>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Brain, label: 'Total Memories', value: totalMemories, color: '#6366f1' },
          { icon: BookOpen, label: 'Total Words', value: stats.total_words || 0, color: '#10b981' },
          { icon: Zap, label: 'Avg Words/Memory', value: avgWords, color: '#f59e0b' },
          { icon: Hash, label: 'Unique Tags', value: stats.total_tags || 0, color: '#ec4899' },
          { icon: TrendingUp, label: 'Categories Used', value: Object.keys(stats.categories || {}).length, color: '#3b82f6' },
          { icon: Calendar, label: 'Days Active', value: activityDays.filter((d) => d.count > 0).length, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{value.toLocaleString()}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-brain-400" /> 14-Day Activity
        </h3>
        <div className="flex items-end gap-2">
          {activityDays.map(({ date, count, key }) => (
            <div key={key} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-t-sm transition-all duration-500 min-h-1"
                style={{
                  height: `${Math.max((count / maxActivity) * 80, 4)}px`,
                  background: count > 0
                    ? `rgba(99,102,241,${0.3 + (count / maxActivity) * 0.7})`
                    : '#1e1e40',
                }}
                title={`${count} on ${key}`}
              />
              <span className="text-xs text-slate-700 font-mono rotate-45 origin-top-left hidden sm:block">
                {date.getDate()}/{date.getMonth() + 1}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
          <div className="w-3 h-3 rounded-sm bg-neural-muted" /> Less
          <div className="w-3 h-3 rounded-sm bg-brain-700/60" />
          <div className="w-3 h-3 rounded-sm bg-brain-500" />
          <div className="w-3 h-3 rounded-sm bg-brain-300" /> More
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-4">🗂 Category Distribution</h3>
          <div className="flex flex-col gap-4">
            {CATEGORIES.map(({ id, label, emoji, color }) => {
              const count = stats.categories?.[id] || 0;
              const pct = totalMemories > 0 ? Math.round((count / totalMemories) * 100) : 0;
              return (
                <div key={id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span>{emoji}</span>{label}
                    </span>
                    <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-neural-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Tags */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-4">🏷 Top Tags</h3>
          {topTags.length === 0 ? (
            <p className="text-slate-600 text-sm">No tags yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topTags.map(([tag, count], i) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-600 w-4">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">#{tag}</span>
                      <span className="font-mono text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-neural-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brain-500 rounded-full"
                        style={{ width: `${(count / (topTags[0]?.[1] || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
