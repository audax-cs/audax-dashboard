'use client';

import { useState } from 'react';
import { StatusBadge, Modal, FormField, inputClass, btnPrimary, btnSecondary } from '@/components/ui';
import { blogStatusLabels, blogStatusColors } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function BlogPage({ blogPosts, setBlogPosts, clients, isConnected }) {
  const [modal, setModal] = useState(null);

  const save = async (form) => {
    if (modal?.id) {
      if (isConnected) await supabase.patch('blog_posts', modal.id, form);
      setBlogPosts(prev => prev.map(b => b.id === modal.id ? { ...b, ...form } : b));
    } else {
      if (isConnected) {
        const r = await supabase.post('blog_posts', form);
        if (r?.[0]) { setBlogPosts(prev => [r[0], ...prev]); setModal(null); return; }
      }
      setBlogPosts(prev => [{ ...form, id: Date.now().toString(), created_at: new Date().toISOString() }, ...prev]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Blog-Tool</h1>
        <button onClick={() => setModal({ status: 'draft', author: 'KC' })} className={btnPrimary}>+ Neuer Blogpost</button>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {blogPosts.map(b => {
          const client = clients.find(c => c.id === b.client_id);
          return (
            <div key={b.id} className="bg-white border border-gray-200 rounded p-5 cursor-pointer hover:shadow-sm" onClick={() => setModal(b)}>
              <div className="flex justify-between items-start mb-2.5">
                <StatusBadge color={blogStatusColors[b.status]} label={blogStatusLabels[b.status]} />
                {b.category && <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{b.category}</span>}
              </div>
              <div className="text-sm font-semibold text-black mb-1.5">{b.title}</div>
              <div className="text-xs text-gray-400">{client?.company || 'Intern'} · {b.author || '–'}</div>
              {b.published_at && <div className="text-[11px] text-gray-400 mt-1.5">Veröffentlicht: {new Date(b.published_at).toLocaleDateString('de-DE')}</div>}
            </div>
          );
        })}
        {blogPosts.length === 0 && <div className="col-span-3 p-10 text-center text-gray-400 text-sm">Keine Blogposts</div>}
      </div>

      {modal && (
        <Modal title={modal.id ? 'Blogpost bearbeiten' : 'Neuer Blogpost'} onClose={() => setModal(null)} wide>
          <div className="grid grid-cols-2 gap-3.5">
            <FormField label="Titel *" span={2}><input className={inputClass} value={modal.title || ''} onChange={e => setModal(p => ({ ...p, title: e.target.value }))} /></FormField>
            <FormField label="Kunde"><select className={`${inputClass} cursor-pointer`} value={modal.client_id || ''} onChange={e => setModal(p => ({ ...p, client_id: e.target.value || null }))}>
              <option value="">Intern / AUDAX</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
            </select></FormField>
            <FormField label="Status"><select className={`${inputClass} cursor-pointer`} value={modal.status || 'draft'} onChange={e => setModal(p => ({ ...p, status: e.target.value }))}>
              {Object.entries(blogStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></FormField>
            <FormField label="Kategorie"><input className={inputClass} value={modal.category || ''} onChange={e => setModal(p => ({ ...p, category: e.target.value }))} placeholder="SEO, Ads, Social..." /></FormField>
            <FormField label="Autor"><input className={inputClass} value={modal.author || ''} onChange={e => setModal(p => ({ ...p, author: e.target.value }))} /></FormField>
            <FormField label="Inhalt" span={2}><textarea className={`${inputClass} min-h-[120px] resize-y`} value={modal.content || ''} onChange={e => setModal(p => ({ ...p, content: e.target.value }))} placeholder="Markdown oder Text..." /></FormField>
            <FormField label="SEO Titel"><input className={inputClass} value={modal.seo_title || ''} onChange={e => setModal(p => ({ ...p, seo_title: e.target.value }))} /></FormField>
            <FormField label="SEO Beschreibung"><input className={inputClass} value={modal.seo_description || ''} onChange={e => setModal(p => ({ ...p, seo_description: e.target.value }))} /></FormField>
          </div>
          <div className="flex gap-2.5 mt-6 justify-end">
            <button onClick={() => setModal(null)} className={btnSecondary}>Abbrechen</button>
            <button onClick={() => { if (modal.title) save(modal); }} className={btnPrimary}>{modal.id ? 'Speichern' : 'Erstellen'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
