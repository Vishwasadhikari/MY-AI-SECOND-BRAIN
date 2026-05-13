import React, { useState } from 'react';
import { Hash, Search, Brain } from 'lucide-react';
import MemoryCard from '../components/MemoryCard';

const TagsPage = ({ tags, memories, onEdit, onDelete, onTogglePin, onView }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [search, setSearch] = useState('');

  const filteredTags = (tags || []).filter((t) =>
    !search || t.toLowerCase().includes(search.toLowerCase())
  );

  const taggedMemories = selectedTag
    ? (memories || []).filter((m) => m.tags.includes(selectedTag))
    : [];

  // Build tag sizes
  const tagCounts = {};
  (memories || []).forEach((m) => m.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const maxCount = Math.max(...Object.values(tagCounts), 1);

  return (
    <div className="p-8 flex flex-col gap-6 animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-white">🏷 Tags Explorer</h2>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="brain-input pl-10"
          placeholder="Filter tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredTags.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <Hash size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tags found</p>
        </div>
      ) : (
        <div className="glass-card p-6">
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
            {filteredTags.length} tags · Click to explore
          </p>
          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => {
              const count = tagCounts[tag] || 0;
              const size = 12 + Math.round((count / maxCount) * 10);
              const opacity = 0.5 + (count / maxCount) * 0.5;
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 font-body ${
                    isSelected
                      ? 'bg-brain-600 text-white border-2 border-brain-400 scale-105'
                      : 'bg-brain-900/50 text-brain-300 border border-brain-800 hover:bg-brain-800 hover:scale-105'
                  }`}
                  style={{ fontSize: `${size}px`, opacity: isSelected ? 1 : opacity }}
                >
                  <Hash size={size * 0.7} />
                  {tag}
                  <span className={`text-xs ml-1 ${isSelected ? 'text-brain-200' : 'text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTag && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display text-xl font-semibold text-white">
              Memories tagged <span className="text-brain-300">#{selectedTag}</span>
            </h3>
            <span className="text-sm font-mono text-slate-500">{taggedMemories.length} memories</span>
          </div>
          {taggedMemories.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <Brain size={36} className="mx-auto mb-3 opacity-30" />
              <p>No memories with this tag</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {taggedMemories.map((m, i) => (
                <MemoryCard
                  key={m.id} memory={m} onEdit={onEdit}
                  onDelete={onDelete} onTogglePin={onTogglePin}
                  onView={onView} index={i}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsPage;
