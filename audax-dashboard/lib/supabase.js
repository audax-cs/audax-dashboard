const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://core.audax-cs.com';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

export const supabase = {
  async get(table, params = '') {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers, cache: 'no-store' });
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async post(table, data) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST', headers, body: JSON.stringify(data),
      });
      return await r.json();
    } catch {
      return null;
    }
  },

  async patch(table, id, data) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH', headers, body: JSON.stringify(data),
      });
      return await r.json();
    } catch {
      return null;
    }
  },

  async del(table, id) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE', headers,
      });
      return true;
    } catch {
      return false;
    }
  },
};
