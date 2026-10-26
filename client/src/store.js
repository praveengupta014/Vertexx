import { useState, useEffect } from 'react';
import { SEED } from './data/catalog';

export const mk = init => { const s = { v: init, subs: new Set() }; s.set = v => { s.v = typeof v === 'function' ? v(s.v) : v; s.subs.forEach(f => f()); }; s.use = () => { const [, f] = useState(0); useEffect(() => { const g = () => f(n => n + 1); s.subs.add(g); return () => s.subs.delete(g); }, []); return s.v; }; return s; };

export const EV = mk(SEED);

export const LEADS = mk([
  { id: 'HL-1001', name: 'Anita Desai', co: 'Karna Foods', items: ['flow'], budget: '₹25–50 lakh', st: 2 },
  { id: 'HL-1002', name: 'Rohit Verma', co: 'Bluefin Retail', items: ['trace', 'analytics'], budget: '₹10–25 lakh', st: 1 },
  { id: 'HL-1003', name: 'S. Kulkarni', co: 'Orbis Energy', items: ['grid'], budget: '₹50 lakh+', st: 3 },
]);

export const DRAFT = mk({ items: [] });

export const track = (t, id) => EV.set(l => [...l, [t, id]]);
