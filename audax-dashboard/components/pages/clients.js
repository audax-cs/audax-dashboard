'use client';

import { useState } from 'react';
import { StatusBadge, Modal, FormField, inputClass, btnPrimary, btnSecondary } from '@/components/ui';
import { statusColors, statusLabels } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function ClientsPage({ clients, setClients, isConnected }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = clients.filter(c => {
    const matchSearch = !search || [c.name, c.company, c.email].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (filter === 'all' || c.status === filter);
  });

  const save = async (form) => {
    const clean = { ...form, monthly_retainer: form.monthly_retainer ? Number(form.monthly_retainer) : null };
    if (modal?.id) {
      if (isConnected) await supabase.patch('clients', modal.id, clean);
      setClients(prev => prev.map(c => c.id === modal.id ? { ...c, ...clean } : c));
    } else {
      if (isConnected) {
        const r = await supabase.post('clients', clean);
        if (r?.[0]) { setClients(prev => [r[0], ...prev]); setModal(null); return; }
      }
      setClients(prev => [{ ...clean, id: Date.now().toString(), created_at: new Date().toISOString() }, ...prev]);
    }
    setModal(null);
  };

  const remove = async (id) => {
    if (isConnected) await supabase.del('clients', id);
    setClients(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Kunden</h1>
        <button onClick={() => setModal({})} className={btnPrimary}>+ Neuer Kunde</button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kunden suchen..." className={`${inputClass} max-w-[300px]`} />
        <div className="flex border-b border-gray-200">
          {[['all', 'Alle'], ['active', 'Aktiv'], ['lead', 'Leads'], ['prospect', 'Interessenten'], ['inactive', 'Inaktiv']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2.5 border-none cursor-pointer text-sm font-medium font-clash bg-transparent -mb-px ${
              filter === k ? 'text-audax-primary border-b-2 border-audax-primary' : 'text-audax-text border-b-2 border-transparent'
            }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {['Name', 'Firma', 'Status', 'Stadt', 'Retainer', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-audax-text bg-gray-50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => setSelected(c)} className="border-b border-gray-100 cursor-pointer hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-black">{c.name}</td>
                <td className="px-4 py-3 text-sm text-audax-text">{c.company || '–'}</td>
                <td className="px-4 py-3"><StatusBadge color={statusColors[c.status]} label={statusLabels[c.status]} /></td>
                <td className="px-4 py-3 text-sm text-audax-text">{c.city || '–'}</td>
                <td className="px-4 py-3 text-sm font-medium">{c.monthly_retainer ? `€${Number(c.monthly_retainer).toLocaleString('de-DE')}` : '–'}</td>
                <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setModal(c)} className="bg-transparent border border-gray-200 rounded px-2 py-1 cursor-pointer text-xs text-audax-text mr-1">✎</button>
                  <button onClick={() => remove(c.id)} className="bg-transparent border border-gray-200 rounded px-2 py-1 cursor-pointer text-xs text-red-600">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">Keine Kunden gefunden</div>}
      </div>
      <div className="mt-2 text-xs text-gray-400">{filtered.length} von {clients.length} Kunden</div>

      {modal && (
        <Modal title={modal.id ? 'Kunde bearbeiten' : 'Neuer Kunde'} onClose={() => setModal(null)}>
          <ClientForm initial={modal} onSave={save} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {selected && (
        <div className="fixed right-0 top-0 bottom-0 w-[380px] bg-white border-l border-gray-200 overflow-y-auto z-50 shadow-lg">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-black">{selected.name}</h3>
            <button onClick={() => setSelected(null)} className="bg-transparent border-none text-gray-400 cursor-pointer text-xl">×</button>
          </div>
          <div className="px-6 py-5">
            {[['Firma', selected.company], ['E-Mail', selected.email], ['Telefon', selected.phone], ['Stadt', selected.city],
              ['Retainer', selected.monthly_retainer ? `€${Number(selected.monthly_retainer).toLocaleString('de-DE')}` : null],
              ['Vertragsbeginn', selected.contract_start ? new Date(selected.contract_start).toLocaleDateString('de-DE') : null],
            ].filter(([, v]) => v).map(([l, v], i) => (
              <div key={i} className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-audax-text">{l}</span>
                <span className="text-sm text-black font-medium">{v}</span>
              </div>
            ))}
            {selected.notes && <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-audax-text leading-relaxed">{selected.notes}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function ClientForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', company: '', email: '', phone: '', city: '', status: 'lead', monthly_retainer: '', notes: '', contract_start: '', tax_id: '', ...initial });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <>
      <div className="grid grid-cols-2 gap-3.5">
        <FormField label="Name *" span={2}><input className={inputClass} value={f.name} onChange={e => set('name', e.target.value)} /></FormField>
        <FormField label="Firma"><input className={inputClass} value={f.company} onChange={e => set('company', e.target.value)} /></FormField>
        <FormField label="Status"><select className={`${inputClass} cursor-pointer`} value={f.status} onChange={e => set('status', e.target.value)}>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select></FormField>
        <FormField label="E-Mail"><input className={inputClass} value={f.email} onChange={e => set('email', e.target.value)} /></FormField>
        <FormField label="Telefon"><input className={inputClass} value={f.phone} onChange={e => set('phone', e.target.value)} /></FormField>
        <FormField label="Stadt"><input className={inputClass} value={f.city} onChange={e => set('city', e.target.value)} /></FormField>
        <FormField label="Retainer (€)"><input className={inputClass} type="number" value={f.monthly_retainer} onChange={e => set('monthly_retainer', e.target.value)} /></FormField>
        <FormField label="Vertragsbeginn"><input className={inputClass} type="date" value={f.contract_start} onChange={e => set('contract_start', e.target.value)} /></FormField>
        <FormField label="USt-IdNr."><input className={inputClass} value={f.tax_id} onChange={e => set('tax_id', e.target.value)} /></FormField>
        <FormField label="Notizen" span={2}><textarea className={`${inputClass} min-h-[60px] resize-y`} value={f.notes} onChange={e => set('notes', e.target.value)} /></FormField>
      </div>
      <div className="flex gap-2.5 mt-6 justify-end">
        <button onClick={onCancel} className={btnSecondary}>Abbrechen</button>
        <button onClick={() => { if (f.name) onSave(f); }} className={btnPrimary}>{initial?.id ? 'Speichern' : 'Anlegen'}</button>
      </div>
    </>
  );
}
