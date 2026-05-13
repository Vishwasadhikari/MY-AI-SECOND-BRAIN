import React, { useState, useEffect } from 'react';
import { X, Plus, Hash, Palette } from 'lucide-react';
import { CATEGORIES, COLORS, getWordCount } from '../utils/helpers';

const MemoryModal = ({ isOpen, onClose, onSave, editMemory }) => {
  const [form, setForm] = useState({
    title: '', content: '', tags: [], category: 'general',
    is_pinned: false, color: '#6366f1',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editMemory) {
      setForm({ ...editMemory });
    } else {
      setForm({ title: '', content: '', tags: [], category: 'general', is_pinned: false, color: '#6366f1' });
    }
    setTagInput('');
  }, [editMemory, isOpen]);

  if (!isOpen) return null;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gradient">
            {editMemory ? '✏️ Edit Memory' : '✨ New Memory'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-neural-border transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 block">Title *</label>
            <input
              className="brain-input font-display text-lg"
              placeholder="Give this memory a name..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 block flex justify-between">
              <span>Content *</span>
              <span className="text-slate-600">{getWordCount(form.content)} words</span>
            </label>
            <textarea
              className="brain-input resize-none"
              rows={6}
              placeholder="What's on your mind? Capture your thoughts, ideas, memories..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          {/* Category & Color row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                className="brain-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map(({ id, label, emoji }) => (
                  <option key={id} value={id}>{emoji} {label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Palette size={11} /> Accent Color
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: form.color === c ? '#fff' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 block">Tags</label>
            <div className="flex gap-2">
              <input
                className="brain-input flex-1"
                placeholder="Add a tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button type="button" onClick={addTag} className="brain-btn-ghost px-3">
                <Plus size={16} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag-pill flex items-center gap-1.5 cursor-pointer hover:bg-red-900/30 hover:text-red-300 hover:border-red-800 transition-colors" onClick={() => removeTag(tag)}>
                    <Hash size={10} />
                    {tag}
                    <X size={10} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pin toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_pinned: !form.is_pinned })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_pinned ? 'bg-brain-600' : 'bg-neural-muted'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_pinned ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-slate-400">Pin this memory</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="brain-btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim() || !form.content.trim()}
              className="brain-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Saving...' : editMemory ? '✓ Update Memory' : '✨ Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryModal;
