export const demoClients = [
  { id: '1', name: 'Max Mustermann', company: 'TechStart GmbH', email: 'max@techstart.de', phone: '+49 170 1234567', status: 'active', monthly_retainer: 2500, city: 'Berlin', contract_start: '2025-06-01', notes: 'SEO + Google Ads' },
  { id: '2', name: 'Anna Weber', company: 'Blumenladen Weber', email: 'anna@blumen-weber.de', phone: '+49 171 7654321', status: 'active', monthly_retainer: 800, city: 'München', contract_start: '2025-09-15', notes: 'Social Media + Blog' },
  { id: '3', name: 'Stefan Koch', company: 'Koch Consulting', email: 'stefan@koch-consulting.de', status: 'lead', city: 'Hamburg', notes: 'Website-Relaunch' },
  { id: '4', name: 'Lisa Braun', company: 'FitLife Studios', email: 'lisa@fitlife.de', status: 'active', monthly_retainer: 1500, city: 'Frankfurt', contract_start: '2025-11-01', notes: 'Google Ads + Landing Pages' },
  { id: '5', name: 'Thomas Schmidt', company: 'Schmidt Immobilien', email: 'thomas@schmidt-immo.de', status: 'inactive', city: 'Köln', notes: 'Vertrag ausgelaufen' },
  { id: '6', name: 'Julia Hoffmann', company: 'Café Sonnenschein', email: 'julia@cafe-sonnenschein.de', status: 'prospect', city: 'Düsseldorf', notes: 'Erstes Gespräch' },
];

export const demoRevenue = [
  { id: '1', client_id: '1', invoice_number: 'RE-2026-001', description: 'Google Ads Betreuung Feb', amount_net: 2500, tax_rate: 19, amount_tax: 475, amount_gross: 2975, category: 'retainer', payment_status: 'paid', invoice_date: '2026-02-01', period_month: 2, period_year: 2026 },
  { id: '2', client_id: '2', invoice_number: 'RE-2026-002', description: 'Social Media Feb', amount_net: 800, tax_rate: 19, amount_tax: 152, amount_gross: 952, category: 'retainer', payment_status: 'paid', invoice_date: '2026-02-01', period_month: 2, period_year: 2026 },
  { id: '3', client_id: '4', invoice_number: 'RE-2026-003', description: 'Google Ads + Landing Page Feb', amount_net: 1500, tax_rate: 19, amount_tax: 285, amount_gross: 1785, category: 'retainer', payment_status: 'pending', invoice_date: '2026-02-15', due_date: '2026-03-15', period_month: 2, period_year: 2026 },
  { id: '4', client_id: '1', invoice_number: 'RE-2026-004', description: 'Website Audit', amount_net: 1200, tax_rate: 19, amount_tax: 228, amount_gross: 1428, category: 'one_time', payment_status: 'overdue', invoice_date: '2026-01-10', due_date: '2026-02-10', period_month: 1, period_year: 2026 },
  { id: '5', client_id: '1', invoice_number: 'RE-2025-048', description: 'Google Ads Jan', amount_net: 2500, tax_rate: 19, amount_tax: 475, amount_gross: 2975, category: 'retainer', payment_status: 'paid', invoice_date: '2026-01-01', period_month: 1, period_year: 2026 },
  { id: '6', client_id: '2', invoice_number: 'RE-2025-049', description: 'Social Media Jan', amount_net: 800, tax_rate: 19, amount_tax: 152, amount_gross: 952, category: 'retainer', payment_status: 'paid', invoice_date: '2026-01-01', period_month: 1, period_year: 2026 },
  { id: '7', client_id: '4', invoice_number: 'RE-2025-050', description: 'Google Ads Jan', amount_net: 1500, tax_rate: 19, amount_tax: 285, amount_gross: 1785, category: 'retainer', payment_status: 'paid', invoice_date: '2026-01-01', period_month: 1, period_year: 2026 },
];

export const demoTasks = [
  { id: '1', title: 'Google Ads Kampagne optimieren', client_id: '1', status: 'in_progress', priority: 'high', due_date: '2026-03-05' },
  { id: '2', title: 'Blogpost: 10 SEO Tipps', client_id: '2', status: 'todo', priority: 'medium', due_date: '2026-03-10' },
  { id: '3', title: 'Landing Page A/B Test', client_id: '4', status: 'review', priority: 'high', due_date: '2026-03-03' },
  { id: '4', title: 'Monatsreport Feb erstellen', client_id: null, status: 'todo', priority: 'urgent', due_date: '2026-03-02' },
  { id: '5', title: 'Angebot für Koch Consulting', client_id: '3', status: 'todo', priority: 'high', due_date: '2026-03-04' },
  { id: '6', title: 'Instagram Content Plan März', client_id: '2', status: 'todo', priority: 'medium', due_date: '2026-03-08' },
];

export const demoBlogPosts = [
  { id: '1', title: '10 SEO Tipps für 2026', client_id: '2', status: 'draft', author: 'KC', category: 'SEO', created_at: '2026-02-20' },
  { id: '2', title: 'Google Ads Budget richtig planen', client_id: '1', status: 'review', author: 'KC', category: 'Ads', created_at: '2026-02-18' },
  { id: '3', title: 'Social Media Trends März', client_id: '2', status: 'published', author: 'KC', category: 'Social', published_at: '2026-02-25', created_at: '2026-02-15' },
];

export const chartData = [
  { month: 'Sep', umsatz: 3200 },
  { month: 'Okt', umsatz: 3800 },
  { month: 'Nov', umsatz: 4800 },
  { month: 'Dez', umsatz: 4500 },
  { month: 'Jan', umsatz: 4800 },
  { month: 'Feb', umsatz: 4800 },
];
