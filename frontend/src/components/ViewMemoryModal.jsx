import React from 'react';
import { X, Pin, Edit3, Trash2, Clock, Eye, Hash, BookOpen } from 'lucide-react';
import { getCategoryInfo, formatDate } from '../utils/helpers';

const ViewMemoryModal = ({ memory, onClose, onEdit, onDelete, onTogglePin }) => {
  if (!memory) return null;
  const category = getCategoryInfo(memory.category);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-fade-in" style={{ borderLeft: `4px solid ${memory.color || '#6366f1'}` }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{category.label}</span>
              <h2 className="font-display text-2xl font-bold text-white mt-0.5">{memory.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-neural-border transition-colors flex-shrink-0 ml-4">
            <X size={20} />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-mono">
          <span className="flex items-center gap-1"><Clock size={12} />{formatDate(memory.created_at)}</span>
          <span className="flex items-center gap-1"><Eye size={12} />{memory.views || 0} views</span>
          <span className="flex items-center gap-1"><BookOpen size={12} />{memory.word_count || 0} words</span>
          {memory.is_pinned && <span className="flex items-center gap-1 text-brain-400"><Pin size={12} /> Pinned</span>}
        </div>

        {/* Content */}
        <div className="glass-card p-6 rounded-xl mb-6" style={{ background: 'rgba(10,10,26,0.6)' }}>
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-body text-base">
            {memory.content}
          </p>
        </div>

        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {memory.tags.map((tag) => (
              <span key={tag} className="tag-pill flex items-center gap-1.5 text-sm py-1 px-3">
                <Hash size={11} />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => onTogglePin(memory.id)} className={`brain-btn flex items-center gap-2 ${memory.is_pinned ? 'bg-brain-900 text-brain-300 border border-brain-700' : 'brain-btn-ghost'}`}>
            <Pin size={15} />{memory.is_pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={() => { onClose(); onEdit(memory); }} className="brain-btn brain-btn-ghost flex items-center gap-2">
            <Edit3 size={15} /> Edit
          </button>
          <button onClick={() => { onDelete(memory.id); onClose(); }} className="brain-btn flex items-center gap-2 bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-900/50 ml-auto">
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMemoryModal;
