export const CATEGORIES = [
  { id: 'general', label: 'General', color: '#6366f1', emoji: '💡' },
  { id: 'idea', label: 'Ideas', color: '#f59e0b', emoji: '🚀' },
  { id: 'memory', label: 'Memories', color: '#10b981', emoji: '🧠' },
  { id: 'quote', label: 'Quotes', color: '#ec4899', emoji: '💬' },
  { id: 'learning', label: 'Learning', color: '#3b82f6', emoji: '📚' },
  { id: 'task', label: 'Tasks', color: '#f97316', emoji: '✅' },
  { id: 'dream', label: 'Dreams', color: '#8b5cf6', emoji: '🌙' },
  { id: 'insight', label: 'Insights', color: '#14b8a6', emoji: '✨' },
];

export const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ec4899',
  '#3b82f6', '#f97316', '#8b5cf6', '#14b8a6',
  '#ef4444', '#84cc16',
];

export const getCategoryInfo = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};
