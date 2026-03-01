'use client';

export function StatusBadge({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-audax-text">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className={`bg-white rounded-md p-7 w-full shadow-lg max-h-[85vh] overflow-y-auto ${wide ? 'max-w-[600px]' : 'max-w-[520px]'}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-black">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, span, children }) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-audax-text mb-1">{label}</label>
      {children}
    </div>
  );
}

export function KpiCard({ label, value, sub, alert }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <div className="text-xs text-audax-text mb-1.5">{label}</div>
      <div className="text-2xl font-bold text-black">{value}</div>
      {sub && <div className={`text-xs mt-1 ${alert ? 'text-red-500' : 'text-gray-400'}`}>{sub}</div>}
    </div>
  );
}

export const inputClass = "w-full px-3 py-2 rounded border border-gray-300 bg-white text-black text-sm outline-none font-clash";
export const btnPrimary = "px-4 py-2 rounded border-none bg-audax-primary text-white cursor-pointer text-sm font-semibold font-clash";
export const btnSecondary = "px-4 py-2 rounded border border-gray-300 bg-white text-audax-text cursor-pointer text-sm font-clash";
