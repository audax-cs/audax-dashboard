'use client';

import { KpiCard } from '@/components/ui';
import { StatusBadge } from '@/components/ui';
import { paymentColors, paymentLabels, priorityColors, priorityLabels } from '@/lib/constants';
import { chartData } from '@/lib/demo-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage({ clients, revenue, tasks, blogPosts, setPage }) {
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();
  const monthRevenue = revenue.filter(r => r.period_month === curMonth && r.period_year === curYear);
  const totalNet = monthRevenue.reduce((s, r) => s + Number(r.amount_net || 0), 0);
  const totalGross = monthRevenue.reduce((s, r) => s + Number(r.amount_gross || 0), 0);
  const openInvoices = revenue.filter(r => r.payment_status === 'pending').length;
  const overdueInvoices = revenue.filter(r => r.payment_status === 'overdue').length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const newLeads = clients.filter(c => c.status === 'lead' || c.status === 'prospect').length;
  const openTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').length;
  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done').length;

  const upcomingTasks = [...tasks].filter(t => t.status !== 'done' && t.status !== 'cancelled').sort((a, b) => (a.due_date || '9').localeCompare(b.due_date || '9')).slice(0, 5);
  const recentInvoices = [...revenue].sort((a, b) => (b.invoice_date || '').localeCompare(a.invoice_date || '')).slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => setPage('revenue')} className="px-4 py-2 rounded border-none bg-audax-primary text-white cursor-pointer text-sm font-semibold font-clash">+ Rechnung</button>
          <button onClick={() => setPage('tasks')} className="px-4 py-2 rounded border border-gray-300 bg-white text-audax-text cursor-pointer text-sm font-clash">+ Aufgabe</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-6">
        <KpiCard label="Umsatz aktueller Monat (Netto)" value={`€${totalNet.toLocaleString('de-DE')}`} sub={`Brutto: €${totalGross.toLocaleString('de-DE')}`} />
        <KpiCard label="Offene Rechnungen" value={openInvoices} sub={overdueInvoices > 0 ? `${overdueInvoices} überfällig` : 'Keine überfälligen'} alert={overdueInvoices > 0} />
        <KpiCard label="Aktive Kunden" value={activeClients} sub={`${newLeads} Leads/Interessenten`} />
        <KpiCard label="Offene Aufgaben" value={openTasks} sub={urgentTasks > 0 ? `${urgentTasks} dringend/hoch` : 'Keine dringenden'} alert={urgentTasks > 0} />
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-black">Umsatz pro Monat</span>
            <span className="text-xs text-gray-400">Letzte 6 Monate</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4a4844' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#4a4844' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v.toLocaleString('de-DE')}`} />
              <Tooltip formatter={v => [`€${v.toLocaleString('de-DE')}`, 'Umsatz']} contentStyle={{ fontSize: 13, borderRadius: 4, border: '1px solid #e5e5e5' }} />
              <Line type="monotone" dataKey="umsatz" stroke="#5271ff" strokeWidth={2} dot={{ r: 4, fill: '#5271ff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="text-sm font-semibold text-black mb-4">Shortcuts</div>
          {[
            { label: 'Rechnung schreiben', page: 'revenue' },
            { label: 'Angebot schreiben', page: 'revenue' },
            { label: 'Neuer Kunde', page: 'clients' },
            { label: 'Neuer Blogpost', page: 'blog' },
          ].map((s, i) => (
            <button key={i} onClick={() => setPage(s.page)} className="block w-full text-left py-2.5 border-b border-gray-100 last:border-0 bg-transparent border-x-0 border-t-0 cursor-pointer text-sm text-audax-primary font-medium font-clash">
              {s.label} ↗
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-sm font-semibold text-black">Anstehende Aufgaben</span>
            <button onClick={() => setPage('tasks')} className="bg-transparent border-none text-audax-primary cursor-pointer text-xs font-clash">Alle anzeigen →</button>
          </div>
          {upcomingTasks.map((t, i) => {
            const client = clients.find(c => c.id === t.client_id);
            return (
              <div key={t.id} className={`py-2.5 flex justify-between items-center ${i < upcomingTasks.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <div className="text-sm text-black font-medium">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{client?.company || 'Intern'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium" style={{ color: priorityColors[t.priority] }}>{priorityLabels[t.priority]}</div>
                  <div className="text-[11px] text-gray-400">{t.due_date ? new Date(t.due_date).toLocaleDateString('de-DE') : '–'}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-sm font-semibold text-black">Letzte Rechnungen</span>
            <button onClick={() => setPage('revenue')} className="bg-transparent border-none text-audax-primary cursor-pointer text-xs font-clash">Alle anzeigen →</button>
          </div>
          {recentInvoices.map((r, i) => (
            <div key={r.id} className={`py-2.5 flex justify-between items-center ${i < recentInvoices.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div>
                <div className="text-sm text-black font-medium">{r.invoice_number}</div>
                <div className="text-xs text-gray-400 mt-0.5">{r.description}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-black font-semibold">€{Number(r.amount_net).toLocaleString('de-DE')}</div>
                <StatusBadge color={paymentColors[r.payment_status]} label={paymentLabels[r.payment_status]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
