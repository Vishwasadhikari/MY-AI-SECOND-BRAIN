import React, { useState, useCallback } from 'react';
import { Search, Hash, X, Brain } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';

const SearchPage = ({ memories, tags, onEdit, onDelete, onTogglePin, onView }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = (memories || []).filter((m) => {
    const matchQuery = !query ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.content.toLowerCase().includes(query.toLowerCase());
    const matchTags = selectedTags.length === 0 ||
      selectedTags.every((t) => m.tags.includes(t));
    return matchQuery && matchTags;
  });

  return (
    <div className="p-8 flex flex-col gap-6 animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-white">🔍 Search Brain</h2>

      {/* Search input */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="brain-input pl-12 text-lg py-4"
          placeholder="Search your second brain..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tag filters */}
      {tags && tags.length > 0 && (
        <div>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">Filter by Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-brain-600 text-white border border-brain-500'
                    : 'tag-pill hover:bg-brain-900'
                }`}
              >
                <Hash size={11} />
                {tag}
                {selectedTags.includes(tag) && <X size={11} />}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button onClick={() => setSelectedTags([])} className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        {(query || selectedTags.length > 0) && (
          <p className="text-sm font-mono text-slate-500 mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}
        {filtered.length === 0 && (query || selectedTags.length > 0) ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Brain size={40} className="text-slate-700 mb-3" />
            <p className="text-slate-500 font-body">No memories match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(query || selectedTags.length > 0 ? filtered : []).map((m, i) => (
              <MemoryCard
                key={m.id}
                memory={m}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onView={onView}
                index={i}
              />
            ))}
          </div>
        )}
        {!query && selectedTags.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Search size={40} className="text-slate-700 mb-3" />
            <p className="text-slate-400 font-body">Start typing to search your memories</p>
            <p className="text-slate-600 text-sm mt-1">Or filter by tags above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
