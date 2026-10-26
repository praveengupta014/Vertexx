import { useState, useEffect, useRef } from 'react';
import { wrap } from '../../ui';
import { STATS } from '../../data/catalog';

export function Counter({ v, s, l, dec, run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(v);
    let t0, raf;
    const tick = t => { t0 = t0 ?? t; const p = Math.min((t - t0) / 1300, 1); setN(v * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return (<div><div className="font-head text-5xl font-extrabold sm:text-6xl">{n.toFixed(dec)}{s}</div><div className="mt-2 text-teal-100">{l}</div></div>);
}

export function Stats() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: .3 }); io.observe(ref.current); return () => io.disconnect(); }, []);
  return (<section id="results" ref={ref} className="bg-gradient-to-br from-[#0a3a3e] to-[#0f5257] py-20 text-white">
    <div className={wrap + ' grid grid-cols-2 gap-10 lg:grid-cols-4'}>{STATS.map(([v, s, l, d]) => (<Counter key={l} v={v} s={s} l={l} dec={d} run={seen}/>))}</div>
  </section>);
}
