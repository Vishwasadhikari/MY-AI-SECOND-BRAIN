import React from 'react';
import { Pin, Trash2, Edit3, Eye, Clock, Hash } from 'lucide-react';
import { getCategoryInfo, formatDate } from '../utils/helpers';

const MemoryCard = ({ memory, onEdit, onDelete, onTogglePin, onView, index }) => {
  const category = getCategoryInfo(memory.category);

  return (
    <div
      className="memory-card animate-fade-in group"
      style={{ animationDelay: `${index * 0.05}s`, borderLeft: `3px solid ${memory.color || '#6366f1'}` }}
      onClick={() => onView(memory)}
    >
      {/* Pin indicator */}
      {memory.is_pinned && (
        <div className="absolute top-3 right-3">
          <Pin size={14} className="text-brain-400 fill-brain-400" />
        </div>
      )}

      {/* Glow accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${memory.color || '#6366f1'}10 0%, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-start gap-2 mb-2 pr-6">
        <span className="text-xl mt-0.5 flex-shrink-0">{category.emoji}</span>
        <h3 className="font-display font-semibold text-slate-100 text-base leading-tight line-clamp-2">
          {memory.title}
        </h3>
      </div>

      {/* Content preview */}
      <p className="text-slate-400 text-sm line-clamp-3 mb-3 ml-7 leading-relaxed">
        {memory.content}
      </p>

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 ml-7">
          {memory.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill flex items-center gap-1">
              <Hash size={9} />
              {tag}
            </span>
          ))}
          {memory.tags.length > 3 && (
            <span className="tag-pill">+{memory.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between ml-7">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatDate(memory.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {memory.views || 0}
          </span>
          <span className="font-mono">{memory.word_count || 0}w</span>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onTogglePin(memory.id)}
            className={`p-1.5 rounded-lg transition-colors ${memory.is_pinned ? 'text-brain-400 bg-brain-900/50' : 'text-slate-500 hover:text-brain-400 hover:bg-brain-900/30'}`}
            title={memory.is_pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={13} />
          </button>
          <button
            onClick={() => onEdit(memory)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
            title="Edit"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete(memory.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
