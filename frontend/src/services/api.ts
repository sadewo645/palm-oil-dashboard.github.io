export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  plantation: () => get('/data/plantation'),
  factory: () => get('/data/factory'),
  company: () => get('/data/company'),
  predictHarvest: (payload: any) => fetch(`${API_BASE}/predict/harvest`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  }).then(r => r.json())
}
