import React from 'react';
import { Brain, LayoutDashboard, Search, Tag, BarChart3, Settings, Plus, Pin } from 'lucide-react';
import { CATEGORIES } from '../utils/helpers';

const Sidebar = ({ activeView, setActiveView, onNewMemory, stats }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'memories', label: 'All Memories', icon: Brain },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'pinned', label: 'Pinned', icon: Pin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tags', label: 'Tags', icon: Tag },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col glass-card rounded-none border-r border-neural-border min-h-screen p-5 gap-6 relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 pt-2">
        <div className="w-9 h-9 rounded-xl bg-brain-600 flex items-center justify-center glow-animate flex-shrink-0">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-sm text-white leading-tight">MY-AI-SECOND</h1>
          <h1 className="font-display font-bold text-sm text-gradient leading-tight">BRAIN 🧠</h1>
        </div>
      </div>

      {/* New Memory Button */}
      <button
        onClick={onNewMemory}
        className="brain-btn-primary flex items-center gap-2 justify-center w-full"
      >
        <Plus size={16} />
        New Memory
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <p className="text-xs font-mono text-slate-600 uppercase tracking-widest px-4 mb-1">Navigate</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`sidebar-link w-full text-left ${activeView === id ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span className="font-body text-sm">{label}</span>
            {id === 'pinned' && stats?.pinned_count > 0 && (
              <span className="ml-auto text-xs bg-brain-800 text-brain-300 rounded-full px-2 py-0.5">
                {stats.pinned_count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Categories */}
      <nav className="flex flex-col gap-1">
        <p className="text-xs font-mono text-slate-600 uppercase tracking-widest px-4 mb-1">Categories</p>
        {CATEGORIES.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setActiveView(`cat:${id}`)}
            className={`sidebar-link w-full text-left ${activeView === `cat:${id}` ? 'active' : ''}`}
          >
            <span className="text-base w-5 text-center">{emoji}</span>
            <span className="font-body text-sm">{label}</span>
            {stats?.categories?.[id] > 0 && (
              <span className="ml-auto text-xs text-slate-600">{stats.categories[id]}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Stats footer */}
      <div className="mt-auto glass-card p-4 rounded-xl border-neural-border">
        <p className="text-xs font-mono text-slate-500 mb-2">BRAIN STATUS</p>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Memories</span>
          <span className="text-brain-300 font-mono">{stats?.total_memories || 0}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-400">Words</span>
          <span className="text-brain-300 font-mono">{stats?.total_words || 0}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-400">Tags</span>
          <span className="text-brain-300 font-mono">{stats?.total_tags || 0}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
