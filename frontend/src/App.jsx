import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MemoryModal from './components/MemoryModal';
import ViewMemoryModal from './components/ViewMemoryModal';
import Dashboard from './pages/Dashboard';
import MemoriesPage from './pages/MemoriesPage';
import SearchPage from './pages/SearchPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TagsPage from './pages/TagsPage';
import { memoryAPI, statsAPI, tagsAPI } from './utils/api';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMemory, setEditMemory] = useState(null);
  const [viewMemory, setViewMemory] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [memRes, statsRes, tagsRes] = await Promise.all([
        memoryAPI.getAll(),
        statsAPI.get(),
        tagsAPI.getAll(),
      ]);
      setMemories(memRes.data.memories);
      setStats(statsRes.data);
      setTags(tagsRes.data.tags);
    } catch (err) {
      showToast('Could not connect to backend. Make sure the API is running.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (form) => {
    try {
      if (editMemory) {
        await memoryAPI.update(editMemory.id, form);
        showToast('Memory updated! ✨');
      } else {
        await memoryAPI.create(form);
        showToast('Memory saved to your brain! 🧠');
      }
      setEditMemory(null);
      await fetchAll();
    } catch {
      showToast('Failed to save memory', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory? This cannot be undone.')) return;
    try {
      await memoryAPI.delete(id);
      showToast('Memory deleted');
      await fetchAll();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await memoryAPI.togglePin(id);
      showToast(res.data.is_pinned ? 'Memory pinned 📌' : 'Memory unpinned');
      await fetchAll();
      if (viewMemory?.id === id) {
        setViewMemory((prev) => ({ ...prev, is_pinned: res.data.is_pinned }));
      }
    } catch {
      showToast('Failed to pin', 'error');
    }
  };

  const handleEdit = (memory) => {
    setEditMemory(memory);
    setModalOpen(true);
  };

  const handleView = (memory) => setViewMemory(memory);

  const openNew = () => { setEditMemory(null); setModalOpen(true); };

  const pinnedMemories = memories.filter((m) => m.is_pinned);
  const catFilter = activeView.startsWith('cat:') ? activeView.replace('cat:', '') : null;
  const catMemories = catFilter ? memories.filter((m) => m.category === catFilter) : memories;

  const renderPage = () => {
    if (activeView === 'dashboard')
      return <Dashboard stats={stats} onNewMemory={openNew} onViewMemory={handleView} setActiveView={setActiveView} />;
    if (activeView === 'memories')
      return <MemoriesPage memories={memories} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} onView={handleView} />;
    if (activeView === 'search')
      return <SearchPage memories={memories} tags={tags} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} onView={handleView} />;
    if (activeView === 'pinned')
      return <MemoriesPage memories={pinnedMemories} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} onView={handleView} title="📌 Pinned Memories" />;
    if (activeView === 'analytics')
      return <AnalyticsPage stats={stats} memories={memories} />;
    if (activeView === 'tags')
      return <TagsPage tags={tags} memories={memories} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} onView={handleView} />;
    if (catFilter)
      return <MemoriesPage memories={catMemories} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} onView={handleView} title={`Category: ${catFilter}`} filterCategory={catFilter} />;
    return null;
  };

  return (
    <div className="neural-grid min-h-screen flex relative">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onNewMemory={openNew}
        stats={stats}
      />

      {/* Main content */}
      <main className="flex-1 relative z-10 overflow-y-auto max-h-screen">
        {renderPage()}
      </main>

      {/* Modals */}
      <MemoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditMemory(null); }}
        onSave={handleSave}
        editMemory={editMemory}
      />
      <ViewMemoryModal
        memory={viewMemory}
        onClose={() => setViewMemory(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl font-body text-sm font-medium shadow-2xl animate-fade-in transition-all ${
          toast.type === 'error'
            ? 'bg-red-900 border border-red-700 text-red-200'
            : 'bg-brain-900 border border-brain-700 text-brain-200'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
