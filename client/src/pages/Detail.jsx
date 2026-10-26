import { useEffect, Fragment } from 'react';
import { CAT, IND, byId } from '../data/catalog';
import { track, DRAFT } from '../store';
import { Card, chip, link, btn, PH, Sec } from '../ui';

export function Detail({ id }) {
  const c = byId(id);
  useEffect(() => { if (c) track(c.type === 'Service' ? 'service' : 'solution', c.id); }, [id]);
  if (!c) return (<Sec><p>We could not find that page. <a className={link} href="#/services">Back to services</a></p></Sec>);
  const k = CAT.indexOf(c), prev = CAT[(k + CAT.length - 1) % CAT.length], next = CAT[(k + 1) % CAT.length];
  const rel = CAT.filter(x => x.id !== id && x.inds.some(i => c.inds.includes(i))).slice(0, 3);
  const add = () => DRAFT.set(d => ({ items: d.items.includes(id) ? d.items : [...d.items, id] }));
  return (<Fragment><PH t={c.n} s={c.x}/>
  <Sec><div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
    <div><h2 className="font-head text-2xl font-bold">What is included</h2><ul className="mt-4 space-y-3">{c.f.map(x => (<li key={x} className="flex gap-3"><span className="text-brand">✓</span>{x}</li>))}</ul>
    <h2 className="mt-10 font-head text-2xl font-bold">Best suited for</h2><div className="mt-4 flex flex-wrap gap-2">{c.inds.map(i => (<a key={i} href="#/services" className={chip(false)}>{IND[i]}</a>))}</div></div>
    <aside className={Card + ' h-fit'}><p className="text-sm text-mut">Starting price</p><p className="font-head text-4xl font-extrabold">₹{c.p} lakh</p><p className="mt-1 text-mut">Typical timeline: {c.wk} weeks</p><a href="#/inquiry" onClick={add} className={btn + ' mt-6 w-full bg-brand text-white'}>Add to inquiry</a></aside>
  </div></Sec>
  <Sec t="Related offers" tint><div className="grid gap-6 md:grid-cols-3">{rel.map(r => (<a key={r.id} href={'#/services/' + r.id} className={Card + ' transition hover:-translate-y-1 hover:shadow-xl'}><span className="text-xs font-semibold text-brand">{r.type}</span><h3 className="mt-2 font-head text-xl font-bold">{r.n}</h3><p className="mt-2 text-sm text-mut">{r.x}</p></a>))}</div></Sec>
  <Sec><div className="flex justify-between gap-4"><a href={'#/services/' + prev.id} className={link}>← {prev.n}</a><a href={'#/services/' + next.id} className={link}>{next.n} →</a></div></Sec></Fragment>);
}
