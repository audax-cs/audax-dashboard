'use client';

const nav = [
  { id: 'dashboard', label: 'Startseite' },
  { id: 'clients', label: 'Kunden' },
  { id: 'tasks', label: 'Aufgaben' },
  { id: 'revenue', label: 'Rechnungen' },
  { id: 'blog', label: 'Blog-Tool' },
];

export default function Sidebar({ page, setPage, collapsed, isConnected }) {
  return (
    <div className={`${collapsed ? 'w-[50px]' : 'w-[200px]'} bg-audax-dark text-white flex flex-col flex-shrink-0 transition-all duration-200`}>
      <div className={`${collapsed ? 'px-2.5' : 'px-4'} py-5 border-b border-gray-800 flex items-center gap-2.5`}>
        <div className="w-7 h-7 rounded bg-audax-primary flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0">A</div>
        {!collapsed && <span className="text-[15px] font-bold">AUDAX</span>}
      </div>
      <div className="p-2 flex-1">
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            className={`flex items-center gap-2.5 w-full py-2 px-3 rounded text-sm text-left mb-0.5 border-none cursor-pointer font-clash ${
              page === n.id ? 'bg-gray-800 text-white font-medium' : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}>
            {!collapsed && n.label}
          </button>
        ))}
      </div>
      <div className="px-4 py-3.5 border-t border-gray-800 text-[11px] text-gray-600">
        {!collapsed && (
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {isConnected ? 'Verbunden' : 'Demo-Modus'}
          </div>
        )}
      </div>
    </div>
  );
}
