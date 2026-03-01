'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import DashboardPage from '@/components/pages/dashboard';
import ClientsPage from '@/components/pages/clients';
import TasksPage from '@/components/pages/tasks';
import RevenuePage from '@/components/pages/revenue';
import BlogPage from '@/components/pages/blog';
import { supabase } from '@/lib/supabase';
import { demoClients, demoRevenue, demoTasks, demoBlogPosts } from '@/lib/demo-data';

export default function Home() {
  const [page, setPage] = useState('dashboard');
  const [clients, setClients] = useState(demoClients);
  const [revenue, setRevenue] = useState(demoRevenue);
  const [tasks, setTasks] = useState(demoTasks);
  const [blogPosts, setBlogPosts] = useState(demoBlogPosts);
  const [isConnected, setIsConnected] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await supabase.get('clients', 'order=created_at.desc');
        if (c && c.length > 0) {
          setClients(c);
          const r = await supabase.get('revenue', 'order=invoice_date.desc');
          if (r.length) setRevenue(r);
          const t = await supabase.get('tasks', 'order=created_at.desc');
          if (t.length) setTasks(t);
          const b = await supabase.get('blog_posts', 'order=created_at.desc');
          if (b.length) setBlogPosts(b);
          setIsConnected(true);
        }
      } catch {}
    };
    load();
  }, []);

  const nav = [
    { id: 'dashboard', label: 'Startseite' },
    { id: 'clients', label: 'Kunden' },
    { id: 'tasks', label: 'Aufgaben' },
    { id: 'revenue', label: 'Rechnungen' },
    { id: 'blog', label: 'Blog-Tool' },
  ];

  return (
    <div className="flex min-h-screen bg-audax-bg font-clash text-black">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} isConnected={isConnected} />
      <div className="flex-1 overflow-auto">
        <div className="px-7 py-3.5 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <button onClick={() => setCollapsed(!collapsed)} className="bg-transparent border-none cursor-pointer text-audax-text text-lg p-0">☰</button>
            <span className="text-sm text-audax-text">{nav.find(n => n.id === page)?.label || 'Dashboard'}</span>
          </div>
        </div>
        <div className="p-7">
          {page === 'dashboard' && <DashboardPage clients={clients} revenue={revenue} tasks={tasks} blogPosts={blogPosts} setPage={setPage} />}
          {page === 'clients' && <ClientsPage clients={clients} setClients={setClients} isConnected={isConnected} />}
          {page === 'tasks' && <TasksPage tasks={tasks} setTasks={setTasks} clients={clients} isConnected={isConnected} />}
          {page === 'revenue' && <RevenuePage revenue={revenue} setRevenue={setRevenue} clients={clients} isConnected={isConnected} />}
          {page === 'blog' && <BlogPage blogPosts={blogPosts} setBlogPosts={setBlogPosts} clients={clients} isConnected={isConnected} />}
        </div>
      </div>
    </div>
  );
}
