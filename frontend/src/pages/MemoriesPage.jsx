import React, { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, Brain } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';
import { CATEGORIES } from '../utils/helpers';

const MemoriesPage = ({ memories, loading, onEdit, onDelete, onTogglePin, onView, title = 'All Memories', filterCategory }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(filterCategory || 'all');
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('date');

  let filtered = [...(memories || [])];

  if (search) {
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.content.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some((t) => t.includes(search.toLowerCase()))
    );
  }

  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter((m) => m.category === selectedCategory);
  }

  if (sortBy === 'date') filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (sortBy === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === 'words') filtered.sort((a, b) => (b.word_count || 0) - (a.word_count || 0));

  const pinned = filtered.filter((m) => m.is_pinned);
  const unpinned = filtered.filter((m) => !m.is_pinned);

  const renderCards = (list, offset = 0) =>
    list.map((m, i) => (
      <MemoryCard
        key={m.id}
        memory={m}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePin={onTogglePin}
        onView={onView}
        index={i + offset}
      />
    ));

  return (
    <div className="p-8 flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm font-mono text-slate-500">{filtered.length} memories</span>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="brain-input pl-10"
            placeholder="Search memories, tags, content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="brain-input w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(({ id, label, emoji }) => (
              <option key={id} value={id}>{emoji} {label}</option>
            ))}
          </select>
          <select
            className="brain-input w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Newest</option>
            <option value="title">A-Z</option>
            <option value="words">By Length</option>
          </select>
          <button
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            className="brain-btn-ghost px-3"
            title="Toggle layout"
          >
            {layout === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
          </button>
        </div>
      </div>

      {/* Memories */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-brain-500 animate-pulse font-mono text-sm">Loading memories...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Brain size={48} className="text-slate-700 mb-4" />
          <p className="font-display text-xl text-slate-500">No memories found</p>
          <p className="text-slate-600 text-sm mt-1">
            {search ? 'Try a different search term' : 'Start by creating your first memory!'}
          </p>
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <div>
              <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">📌 Pinned</p>
              <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
                {renderCards(pinned)}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">🧠 All Memories</p>
              )}
              <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
                {renderCards(unpinned, pinned.length)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoriesPage;
