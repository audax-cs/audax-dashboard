'use client';

import { useState } from 'react';
import { StatusBadge, Modal, FormField, inputClass, btnPrimary, btnSecondary } from '@/components/ui';
import { taskStatusLabels, taskStatusColors, priorityLabels, priorityColors } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function TasksPage({ tasks, setTasks, clients, isConnected }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('open');

  const filtered = filter === 'open' ? tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled') :
    filter === 'done' ? tasks.filter(t => t.status === 'done') : tasks;

  const save = async (form) => {
    if (modal?.id) {
      if (isConnected) await supabase.patch('tasks', modal.id, form);
      setTasks(prev => prev.map(t => t.id === modal.id ? { ...t, ...form } : t));
    } else {
      if (isConnected) {
        const r = await supabase.post('tasks', form);
        if (r?.[0]) { setTasks(prev => [r[0], ...prev]); setModal(null); return; }
      }
      setTasks(prev => [{ ...form, id: Date.now().toString(), created_at: new Date().toISOString() }, ...prev]);
    }
    setModal(null);
  };

  const toggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    if (isConnected) await supabase.patch('tasks', task.id, { status: newStatus });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  const sorted = [...filtered].sort((a, b) => {
    const po = { urgent: 0, high: 1, medium: 2, low: 3 };
    return (po[a.priority] || 2) - (po[b.priority] || 2);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Aufgaben</h1>
        <button onClick={() => setModal({})} className={btnPrimary}>+ Neue Aufgabe</button>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        {[['open', 'Offen'], ['done', 'Erledigt'], ['all', 'Alle']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2.5 border-none cursor-pointer text-sm font-medium font-clash bg-transparent -mb-px ${
            filter === k ? 'text-audax-primary border-b-2 border-audax-primary' : 'text-audax-text border-b-2 border-transparent'
          }`}>{l}</button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map(t => {
          const client = clients.find(c => c.id === t.client_id);
          return (
            <div key={t.id} className="bg-white border border-gray-200 rounded px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={t.status === 'done'} onChange={() => toggleDone(t)} className="w-4 h-4 cursor-pointer accent-audax-primary" />
                <div>
                  <div className={`text-sm font-medium ${t.status === 'done' ? 'text-gray-400 line-through' : 'text-black'}`}>{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {client?.company || 'Intern'}{t.due_date ? ` · Fällig: ${new Date(t.due_date).toLocaleDateString('de-DE')}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <StatusBadge color={priorityColors[t.priority]} label={priorityLabels[t.priority]} />
                <StatusBadge color={taskStatusColors[t.status]} label={taskStatusLabels[t.status]} />
                <button onClick={() => setModal(t)} className="bg-transparent border border-gray-200 rounded px-2 py-1 cursor-pointer text-xs text-audax-text">✎</button>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">Keine Aufgaben</div>}
      </div>

      {modal && (
        <Modal title={modal.id ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3.5">
            <FormField label="Titel *" span={2}><input className={inputClass} value={modal.title || ''} onChange={e => setModal(p => ({ ...p, title: e.target.value }))} /></FormField>
            <FormField label="Kunde"><select className={`${inputClass} cursor-pointer`} value={modal.client_id || ''} onChange={e => setModal(p => ({ ...p, client_id: e.target.value || null }))}>
              <option value="">Intern</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
            </select></FormField>
            <FormField label="Priorität"><select className={`${inputClass} cursor-pointer`} value={modal.priority || 'medium'} onChange={e => setModal(p => ({ ...p, priority: e.target.value }))}>
              {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></FormField>
            <FormField label="Status"><select className={`${inputClass} cursor-pointer`} value={modal.status || 'todo'} onChange={e => setModal(p => ({ ...p, status: e.target.value }))}>
              {Object.entries(taskStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></FormField>
            <FormField label="Fällig am"><input className={inputClass} type="date" value={modal.due_date || ''} onChange={e => setModal(p => ({ ...p, due_date: e.target.value }))} /></FormField>
            <FormField label="Beschreibung" span={2}><textarea className={`${inputClass} min-h-[60px] resize-y`} value={modal.description || ''} onChange={e => setModal(p => ({ ...p, description: e.target.value }))} /></FormField>
          </div>
          <div className="flex gap-2.5 mt-6 justify-end">
            <button onClick={() => setModal(null)} className={btnSecondary}>Abbrechen</button>
            <button onClick={() => { if (modal.title) save(modal); }} className={btnPrimary}>{modal.id ? 'Speichern' : 'Anlegen'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
