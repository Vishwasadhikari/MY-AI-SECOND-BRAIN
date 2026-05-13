import React from 'react';
import { Brain, Zap, Hash, BookOpen, Pin, TrendingUp, Clock } from 'lucide-react';
import { getCategoryInfo, formatDate } from '../utils/helpers';
import { CATEGORIES } from '../utils/helpers';

const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <div className="stat-card group hover:border-brain-800 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-xs font-mono text-slate-600">{subtitle}</span>
    </div>
    <div>
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 font-body">{label}</p>
    </div>
  </div>
);

const Dashboard = ({ stats, onNewMemory, onViewMemory, setActiveView }) => {
  if (!stats) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-brain-500 animate-pulse font-mono text-sm">Loading brain data...</div>
    </div>
  );

  const categoryEntries = Object.entries(stats.categories || {}).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...categoryEntries.map(([, v]) => v), 1);

  return (
    <div className="p-8 flex flex-col gap-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
          </h2>
          <p className="text-slate-400 mt-1 font-body">Your second brain has <span className="text-brain-300">{stats.total_memories}</span> memories stored.</p>
        </div>
        <button onClick={onNewMemory} className="brain-btn-primary flex items-center gap-2">
          <Zap size={16} /> Quick Capture
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Brain} label="Total Memories" value={stats.total_memories} color="#6366f1" subtitle="all time" />
        <StatCard icon={BookOpen} label="Total Words" value={stats.total_words} color="#10b981" subtitle="captured" />
        <StatCard icon={Hash} label="Unique Tags" value={stats.total_tags} color="#f59e0b" subtitle="labels" />
        <StatCard icon={Pin} label="Pinned" value={stats.pinned_count} color="#ec4899" subtitle="important" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Memories */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white flex items-center gap-2">
              <Clock size={18} className="text-brain-400" /> Recent Memories
            </h3>
            <button onClick={() => setActiveView('memories')} className="text-xs text-brain-400 hover:text-brain-300 transition-colors font-mono">
              View all →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {(stats.recent_memories || []).length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <Brain size={32} className="mx-auto mb-2 opacity-30" />
                <p className="font-body text-sm">No memories yet. Start capturing!</p>
              </div>
            ) : (
              stats.recent_memories.map((m) => {
                const cat = getCategoryInfo(m.category);
                return (
                  <div
                    key={m.id}
                    onClick={() => onViewMemory(m)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-neural-border transition-colors cursor-pointer group"
                    style={{ borderLeft: `2px solid ${m.color || '#6366f1'}` }}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{m.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{m.content}</p>
                    </div>
                    <span className="text-xs text-slate-600 font-mono flex-shrink-0">{formatDate(m.created_at)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brain-400" /> Category Breakdown
          </h3>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map(({ id, label, emoji, color }) => {
              const count = stats.categories?.[id] || 0;
              const pct = Math.round((count / maxCat) * 100);
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-500 font-mono">{count}</span>
                    </div>
                    <div className="h-1.5 bg-neural-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tags cloud */}
      {stats.tags && stats.tags.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
            <Hash size={18} className="text-brain-400" /> Tag Cloud
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.tags.map((tag) => (
              <span key={tag} className="tag-pill text-sm py-1 px-3 cursor-pointer hover:bg-brain-800 hover:text-brain-200 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
