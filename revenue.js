'use client';

import { useState } from 'react';
import { StatusBadge, Modal, FormField, inputClass, btnPrimary, btnSecondary } from '@/components/ui';
import { paymentColors, paymentLabels, categoryLabels } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function RevenuePage({ revenue, setRevenue, clients, isConnected }) {
  const [modal, setModal] = useState(null);

  const save = async (form) => {
    const clean = { ...form, amount_net: Number(form.amount_net), tax_rate: Number(form.tax_rate || 19) };
    if (modal?.id) {
      if (isConnected) await supabase.patch('revenue', modal.id, clean);
      const tax = Math.round(clean.amount_net * clean.tax_rate) / 100;
      setRevenue(prev => prev.map(r => r.id === modal.id ? { ...r, ...clean, amount_tax: tax, amount_gross: clean.amount_net + tax } : r));
    } else {
      const tax = Math.round(clean.amount_net * clean.tax_rate) / 100;
      if (isConnected) {
        const r = await supabase.post('revenue', clean);
        if (r?.[0]) { setRevenue(prev => [r[0], ...prev]); setModal(null); return; }
      }
      setRevenue(prev => [{ ...clean, id: Date.now().toString(), amount_tax: tax, amount_gross: clean.amount_net + tax, created_at: new Date().toISOString() }, ...prev]);
    }
    setModal(null);
  };

  const sorted = [...revenue].sort((a, b) => (b.invoice_date || '').localeCompare(a.invoice_date || ''));
  const net = Number(modal?.amount_net || 0);
  const taxRate = Number(modal?.tax_rate || 19);
  const tax = Math.round(net * taxRate) / 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Rechnungen</h1>
        <button onClick={() => setModal({ tax_rate: '19', category: 'retainer', payment_status: 'pending', invoice_date: new Date().toISOString().split('T')[0], period_month: new Date().getMonth() + 1, period_year: new Date().getFullYear() })} className={btnPrimary}>+ Neue Rechnung</button>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {['Nr.', 'Beschreibung', 'Kunde', 'Netto', 'USt', 'Brutto', 'Status', 'Datum', ''].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-audax-text bg-gray-50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => {
              const client = clients.find(c => c.id === r.client_id);
              return (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-black">{r.invoice_number || '–'}</td>
                  <td className="px-4 py-3 text-sm text-audax-text max-w-[200px] truncate">{r.description}</td>
                  <td className="px-4 py-3 text-sm text-audax-text">{client?.company || '–'}</td>
                  <td className="px-4 py-3 text-sm font-medium">€{Number(r.amount_net).toLocaleString('de-DE')}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">€{Number(r.amount_tax || 0).toLocaleString('de-DE')}</td>
                  <td className="px-4 py-3 text-sm font-semibold">€{Number(r.amount_gross || 0).toLocaleString('de-DE')}</td>
                  <td className="px-4 py-3"><StatusBadge color={paymentColors[r.payment_status]} label={paymentLabels[r.payment_status]} /></td>
                  <td className="px-4 py-3 text-sm text-audax-text">{r.invoice_date ? new Date(r.invoice_date).toLocaleDateString('de-DE') : '–'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(r)} className="bg-transparent border border-gray-200 rounded px-2 py-1 cursor-pointer text-xs text-audax-text">✎</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {revenue.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">Keine Rechnungen</div>}
      </div>

      {modal && (
        <Modal title={modal.id ? 'Rechnung bearbeiten' : 'Neue Rechnung'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3.5">
            <FormField label="Rechnungsnr."><input className={inputClass} value={modal.invoice_number || ''} onChange={e => setModal(p => ({ ...p, invoice_number: e.target.value }))} placeholder="RE-2026-..." /></FormField>
            <FormField label="Kunde"><select className={`${inputClass} cursor-pointer`} value={modal.client_id || ''} onChange={e => setModal(p => ({ ...p, client_id: e.target.value || null }))}>
              <option value="">– Wählen –</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}
            </select></FormField>
            <FormField label="Beschreibung" span={2}><input className={inputClass} value={modal.description || ''} onChange={e => setModal(p => ({ ...p, description: e.target.value }))} /></FormField>
            <FormField label="Netto (€)"><input className={inputClass} type="number" value={modal.amount_net || ''} onChange={e => setModal(p => ({ ...p, amount_net: e.target.value }))} /></FormField>
            <FormField label="USt-Satz"><select className={`${inputClass} cursor-pointer`} value={modal.tax_rate || '19'} onChange={e => setModal(p => ({ ...p, tax_rate: e.target.value }))}>
              <option value="19">19%</option><option value="7">7%</option><option value="0">0%</option>
            </select></FormField>
            {net > 0 && <div className="col-span-2 px-3.5 py-2.5 bg-gray-50 rounded text-sm text-audax-text">
              USt: €{tax.toLocaleString('de-DE')} · Brutto: <strong>€{(net + tax).toLocaleString('de-DE')}</strong>
            </div>}
            <FormField label="Kategorie"><select className={`${inputClass} cursor-pointer`} value={modal.category || 'retainer'} onChange={e => setModal(p => ({ ...p, category: e.target.value }))}>
              {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></FormField>
            <FormField label="Status"><select className={`${inputClass} cursor-pointer`} value={modal.payment_status || 'pending'} onChange={e => setModal(p => ({ ...p, payment_status: e.target.value }))}>
              {Object.entries(paymentLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></FormField>
            <FormField label="Rechnungsdatum"><input className={inputClass} type="date" value={modal.invoice_date || ''} onChange={e => setModal(p => ({ ...p, invoice_date: e.target.value }))} /></FormField>
            <FormField label="Fällig am"><input className={inputClass} type="date" value={modal.due_date || ''} onChange={e => setModal(p => ({ ...p, due_date: e.target.value }))} /></FormField>
          </div>
          <div className="flex gap-2.5 mt-6 justify-end">
            <button onClick={() => setModal(null)} className={btnSecondary}>Abbrechen</button>
            <button onClick={() => { if (modal.amount_net) save(modal); }} className={btnPrimary}>{modal.id ? 'Speichern' : 'Erstellen'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
